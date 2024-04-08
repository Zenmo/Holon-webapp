from __future__ import annotations

from polymorphic import utils
from typing import Type, Iterator
from django.db.models import Model
from polymorphic.models import PolymorphicModel
from modelcluster.models import ClusterableModel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.scenario import Scenario
from copy import deepcopy
from django.db.models.fields.related import ManyToOneRel


class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    base_model_type = Model

    def __init__(self, objects: list[Model]):
        self.assert_object_ids(objects)  # TODO make property with setter?
        self.objects = objects

        # Set original id of each model
        # This maintains backwards compatibility when id's weren't stable because of cloning in the database
        for object in self.objects:
            object.original_id = object.id

        # start an id counter at an arbitrary high number
        self.id_counter = self.id_counter_generator(objects)

    def assert_object_ids(self, objects: list[Model]):
        """Raises a ValueError if any of the objects have invalid or no ids"""

        id_list = [object.id for object in objects]
        stoute_lijst = [
            {str(object): object.id}
            for object in objects
            if object.id is None or id_list.count(object.id) > 1 or not isinstance(object.id, int)
        ]

        if any(stoute_lijst):
            raise ValueError(
                f"Some of the provided objects have invalid, duplicate or no ids. Offending objects: {stoute_lijst}"
            )

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(cls.base_model_type.objects.filter(payload=scenario).get_real_instances())

    def get_list_index_for_object_id(self, object_id: int) -> int:
        """Get the index in the objects list for a certain id. Raises ValueError if object is not found"""

        try:
            return next(i for i, object in enumerate(self.objects) if object.id == object_id)
        except:
            raise ValueError(
                f"{self.base_model_type.__name__} object with id {object_id} not found"
            )

    def clone(self) -> RepositoryBaseClass:
        """Clone the object"""
        return self.__class__(self.objects[:])

    def merge(self, other: RepositoryBaseClass) -> RepositoryBaseClass:
        """Merge two Repositories"""
        if self.__class__ == other.__class__:
            unique_objects = set(self.objects[:] + other.objects[:])
            return self.__class__(list(unique_objects))
        else:
            raise TypeError("Repository classes should be of the same type!")

    def filter_model_subtype(self, model_subtype: Type) -> RepositoryBaseClass:
        """Keep only items in the repository that are of the specified subtype, including further derived types."""

        self.__assert_valid_subtype(model_subtype)

        objects = [o for o in self.objects if isinstance(o, model_subtype)]

        return self.__class__(objects)

    def __assert_valid_subtype(self, model_subtype: Type) -> None:
        """Sanity check to verify that the model belongs to this repository."""
        if len(self.objects) == 0:
            return

        base_type = get_instance_base_type(self.objects[0])

        if not issubclass(model_subtype, base_type):
            raise Exception(f"${model_subtype} is not a subtype of ${base_type}")

    def filter_attribute_value(
        self, attribute_name: str, comparator: AttributeFilterComparator, value
    ) -> RepositoryBaseClass:
        """Filter on items' attribute given a comparator and a value"""

        objects = [
            object
            for object in self.objects
            if attribute_matches_value(object, attribute_name, value, comparator)
        ]

        return self.__class__(objects)

    def filter_enum_attribute_value(
        self, attribute_name: str, comparator: AttributeFilterComparator, value: str
    ) -> RepositoryBaseClass:
        """Filter a discrete series (Enum) attribute"""

        objects = [
            object
            for object in self.objects
            if attribute_matches_value(object, attribute_name, value, comparator)
            and discrete_attribute_passes_none_check(object, attribute_name, comparator)
        ]

        return self.__class__(objects)

    def filter_has_relation(
        self,
        relation_field: str,
        relation_repository: RepositoryBaseClass,
        invert: bool = False,
    ) -> RepositoryBaseClass:
        """
        Filter the repository on items that have a relation that exists in the relation_repository. Possibility to invert the filter.
        """
        relation_type = self.base_model_type()._meta.get_field(relation_field)

        if isinstance(relation_type, ManyToOneRel):
            # if the relation field refers to a child, we need to find the field name of the child's foreign key field
            reverse_relation_field = relation_type.field.name + "_id"

            referred_object_ids = [
                getattr(relation_object, reverse_relation_field)
                for relation_object in relation_repository.all()
            ]

            selection_mask = [object.id in referred_object_ids for object in self.objects]

        else:
            relation_ids = relation_repository.ids()
            selection_mask = [
                getattr(object, f"{relation_field}_id") in relation_ids for object in self.objects
            ]

        # possibly invert the selection mask
        if invert:
            selection_mask = [not x for x in selection_mask]

        # select objects based on the mask
        objects = [
            object for is_selected, object in zip(selection_mask, self.objects) if is_selected
        ]

        return self.__class__(objects)

    def get_subset_range(
        self, start: int = None, end: int = None, indices: list[int] = None
    ) -> RepositoryBaseClass:
        """Return a repository with a subset of it's objects, depending on an index range"""

        # get a subset of the objects in this repository
        if (not start is None) or (not end is None):
            objects = self.objects[start:end]
        elif not indices is None:
            objects = [self.objects[i] for i in indices]
        else:
            raise ValueError("Provide at least a `start`, `end` or `indices` parameter")

        # return a new repository initialized with the subset of objects
        return self.__class__(objects)

    def get(self, object_id: int) -> Model:
        """Get an item in the objects list by id. Raises IndexError if object was not found"""

        list_index = self.get_list_index_for_object_id(object_id)
        return self.objects[list_index]

    def all(self) -> list[Model]:
        """Return all objects in the repository"""

        return self.objects

    def dict(self) -> dict[int, PolymorphicModel]:
        """Return all objects in the repository in an id to model dictionary"""
        return {object.id: object for object in self.objects}

    def ids(self) -> list[int]:
        """Returns a list of object ids"""

        return [object.id for object in self.objects]

    def first(self) -> object:
        """Return first object in the repository"""
        return self.objects[0]

    def len(self) -> int:
        """Return the number of objects in the repository"""

        return len(self.objects)

    def update(self, updated_object: Model):
        """
        Select an object by id in the repository and set it's attribute attribute_name to value.
        Raises an IndexError if the id was not found.
        """

        # check if object base type is correct
        self.assert_correct_object_type(updated_object)

        # find object in list and overwrite
        update_id = updated_object.id
        list_index = self.get_list_index_for_object_id(update_id)

        self.objects[list_index] = updated_object

    def add(self, new_object: Model) -> Model:
        """
        Add an object to the repository.
        The object is cloned and gets a new id regardless of its current id.
        Added object is returned.
        """

        # check if object base type is correct
        self.assert_correct_object_type(new_object)

        # copy object and set new id
        cloned_new_object = deepcopy(new_object)

        new_id = next(self.id_counter)
        if new_object.id is not None:
            while new_id <= new_object.id:
                new_id = next(self.id_counter)

        cloned_new_object.pk = cloned_new_object.id = new_id

        # add new object to list and return new object
        self.objects.append(cloned_new_object)

        return cloned_new_object

    def id_counter_generator(self, objects: list[Model]) -> Iterator[int]:
        """Generator to keep track of new ids"""

        max_id = max([object.id for object in objects], default=0)
        new_id = max_id + 1

        while True:
            yield new_id
            new_id += 1

    def remove(self, object_id: int):
        """Remove an item from the repository"""

        list_index = self.get_list_index_for_object_id(object_id)
        self.objects.pop(list_index)

    def get_distinct_attribute_values(self, attributes: list[str]) -> list[dict]:
        """Get a list of unique combinations of attributes in the object collection"""
        # first create set so only unique combinations remain
        set = {
            tuple(map(lambda attribute: getattr(s, attribute), attributes)) for s in self.objects
        }

        # then convert to list of dictionaries so caller code is more readable
        return [
            {attribute: value_tuple[i] for i, attribute in enumerate(attributes)}
            for value_tuple in set
        ]

    def assert_correct_object_type(self, object: Model):
        """Raises a ValueError if the base model type of object is different from this repository's base model type"""

        if not self.base_model_type.__name__ == get_instance_base_type(object).__name__:
            raise ValueError(
                f"Can only insert objects of type {self.base_model_type.__name__}. Object type for attempted insertion: {get_instance_base_type(object).__name__}"
            )


def attribute_matches_value(
    object: object, attribute_name: str, value, comparator: AttributeFilterComparator
):
    # throws if attribute doesn't exist
    attribute = getattr(object, attribute_name)

    if comparator == AttributeFilterComparator.EQUAL.value:
        return attribute == value

    if comparator == AttributeFilterComparator.LESS_THAN.value:
        return attribute < value

    if comparator == AttributeFilterComparator.GREATER_THAN.value:
        return attribute > value

    if comparator == AttributeFilterComparator.NOT_EQUAL.value:
        return attribute != value

    raise Exception("unreachable")


def discrete_attribute_passes_none_check(
    object: object, attribute_name: str, comparator: AttributeFilterComparator
) -> bool:
    """Check if object with discrete attribute should be ignored in the comparison based on NONE value usage"""

    NONE_VALUE = -1
    if comparator == AttributeFilterComparator.EQUAL.value:
        return True
    if comparator == AttributeFilterComparator.NOT_EQUAL.value:
        return True

    return getattr(object, attribute_name) != NONE_VALUE


def get_instance_base_type(obj: object) -> type:
    """
    Get the base type of the model within our domain.
    For example, for a DieselVehicleAsset return EnergyAsset,
    and for a HouseGridConnection return GridConnection
    """
    return get_base_type(obj.__class__)


def get_base_type(cls: type) -> type:
    """
    Get the base type of the model within our domain.
    For example, for a DieselVehicleAsset return EnergyAsset,
    and for a HouseGridConnection return GridConnection
    """
    while True:
        base = cls.__base__
        if base in (PolymorphicModel, Model, ClusterableModel, object):
            return cls
        else:
            cls = base
