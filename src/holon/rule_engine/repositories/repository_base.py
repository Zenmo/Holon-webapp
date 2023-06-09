from __future__ import annotations

from polymorphic import utils
import copy
from typing import Type, TypeVar
from django.db.models.base import Model as DjangoModel
from polymorphic.models import PolymorphicModel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.scenario import Scenario


class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    base_model_type = PolymorphicModel

    def __init__(self, objects: list[PolymorphicModel]):
        self.objects = objects

    @classmethod
    def from_scenario(cls, scenario: Scenario):
        return cls(cls.base_model_type.objects.filter(payload=scenario).get_real_instances())

    def dict(self):
        return {obj.id: obj for obj in self.objects}

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

    # TODO ERIK
    def filter_attribute_value(
        self, attribute_name: str, value: str, comparator: AttributeFilterComparator
    ) -> RepositoryBaseClass:
        """
        Filter on items' attribute given a comparator and a value
        <RETURNS MODIFIED REPOSITORY>
        """
        # attributes = [getattr(obj, attribute_name) for obj in self.objects]

        # if self.comparator == AttributeFilterComparator.EQUAL.value:
        #     return repository.filter_attribute_value(self.model_attribute, self.value)

        #     return repository.filter(**{f"{model_type}___{self.model_attribute}": self.value})
        # if self.comparator == AttributeFilterComparator.LESS_THAN.value:
        #     return repository.filter(**{f"{model_type}___{self.model_attribute}__lt": self.value})
        # if self.comparator == AttributeFilterComparator.GREATER_THAN.value:
        #     return repository.filter(**{f"{model_type}___{self.model_attribute}__gt": self.value})
        # if self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
        #     return repository.filter(
        #         invert=True, **{f"{model_type}___{self.model_attribute}": self.value}

        # if
        return self

    # TODO ERIK
    def filter_enum_attribute_value(
        self, attribute_name: str, value: str, comparator: AttributeFilterComparator
    ) -> RepositoryBaseClass:
        """
        Filter a discrete series (Enum) attribute
        <RETURNS MODIFIED REPOSITORY>
        """

        # Zelfde als standaard attribute filter, maar greater/lesser than moet met Enum/Textchoice volgorde werken.
        # -1/None waardes moeten uitgesloten worden.
        # kijk voor meer info naar `get_q()` van `DiscreteAttributeFilter`

        raise NotImplementedError()

    # TODO ERIK
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

        if (not start is None) or (not end is None):
            objects = self.objects[start:end]
        elif not indices is None:
            objects = [self.objects[i] for i in indices]
        else:
            raise ValueError("Neither `start`, `end` nor `indices` are provided")

        return self.__class__(objects)

    # TODO ERIK
    def get(self, id: int) -> object:
        """Get an item in the objects list by id"""
        raise NotImplementedError()

    def all(self) -> list[object]:
        """Return all objects in the repository"""
        return self.objects

    def len(self) -> int:
        """Return the number of objects in the repository"""
        return len(self.objects)

    def update_attribute(self, id: int, attribute_name: str, value):
        """
        Select an object by id in the repository and set it's attribute attribute_name to value
        <CHANGES INTERNAL STATE>
        """

        raise NotImplementedError()

    # TODO ERIK
    def add(self, object):
        """
        Add an object to the repository
        <CHANGES INTERNAL STATE>
        """
        raise NotImplementedError()

    # TODO ERIK
    def remove(self, object):
        """
        Remove an item from the repository
        <CHANGES INTERNAL STATE>
        """
        raise NotImplementedError()
