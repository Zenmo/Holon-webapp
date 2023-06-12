from __future__ import annotations

import logging
import sentry_sdk

from polymorphic import utils
from typing import Type
from polymorphic.models import PolymorphicModel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.scenario import Scenario
from copy import deepcopy


class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    base_model_type = PolymorphicModel

    def __init__(self, objects: list[PolymorphicModel]):
        self.assert_object_ids(objects)  # TODO make property with setter?
        self.objects = objects

        # start an id counter at an arbitrary high number
        self.id_counter = self.id_counter_generator(objects)

    def assert_object_ids(self, objects: list[PolymorphicModel]):
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

    def filter_model_subtype(self, model_subtype: Type) -> RepositoryBaseClass:
        """Keep only items in the repository that are of the specified subtype, including further derived types."""

        self.__assert_valid_subtype(model_subtype)

        objects = [o for o in self.objects if isinstance(o, model_subtype)]

        return self.__class__(objects)

    def __assert_valid_subtype(self, model_subtype: Type) -> None:
        """Sanity check to verify that the model belongs to this repository."""
        if len(self.objects) == 0:
            return

        base_type = utils.get_base_polymorphic_model(self.objects[0].__class__)

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
        <RETURNS MODIFIED REPOSITORY>
        """

        # TODO
        # - filter deze repository op welke items' relation field een item refereren die in de gefilterde relation_repository zit

        raise NotImplementedError()

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

    def get(self, object_id: int) -> PolymorphicModel:
        """Get an item in the objects list by id. Raises IndexError if object was not found"""

        list_index = self.get_list_index_for_object_id(object_id)
        return self.objects[list_index]

    def all(self) -> list[PolymorphicModel]:
        """Return all objects in the repository"""

        return self.objects

    def first(self) -> object:
        """Return first object in the repository"""
        return self.objects[0]

    def len(self) -> int:
        """Return the number of objects in the repository"""

        return len(self.objects)

    def update(self, updated_object: PolymorphicModel):
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

    def add(self, new_object: PolymorphicModel) -> PolymorphicModel:
        """
        Add an object to the repository.
        The object is deep copied and gets a new id.
        Added object is returned.
        """

        # check if object base type is correct
        self.assert_correct_object_type(new_object)

        # copy object and set new id
        cloned_new_object = deepcopy(new_object)
        cloned_new_object.id = next(self.id_counter)

        # add new object to list and return new object
        self.objects.append(cloned_new_object)

        return cloned_new_object

    def id_counter_generator(self, objects: list[PolymorphicModel]) -> list[int]:
        """Generator to keep track of new ids"""

        max_id = max([object.id for object in objects])
        new_id = max_id + 1

        while True:
            yield new_id
            new_id += 1

    def remove(self, object_id: int):
        """Remove an item from the repository"""

        list_index = self.get_list_index_for_object_id(object_id)
        self.objects.pop(list_index)

    def assert_correct_object_type(self, object: PolymorphicModel):
        """Raises a ValueError if the base model type of object is different from this repository's base model type"""

        if (
            not self.base_model_type.__name__
            == utils.get_base_polymorphic_model(object.__class__).__name__
        ):
            raise ValueError(
                f"Can only insert objects of type {self.base_model_type.__name__}. Object type for attempted insertion: {utils.get_base_polymorphic_model(object.__class__).__name__}"
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
    """If comparator is larger than or smaller than, check if the attribute is not the default enum"""

    NONE_VALUE = -1
    if comparator == AttributeFilterComparator.EQUAL.value:
        return True
    if comparator == AttributeFilterComparator.NOT_EQUAL.value:
        return True

    return getattr(object, attribute_name) != NONE_VALUE
