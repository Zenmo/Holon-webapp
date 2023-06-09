from __future__ import annotations

import logging
import sentry_sdk

from polymorphic import utils
from typing import Type
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

    # TODO ERIK
    def filter_enum_attribute_value(
        self, attribute_name: str, comparator: AttributeFilterComparator, value: str
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

    def get(self, id: int) -> PolymorphicModel:
        """Get an item in the objects list by id. Return None if object was not found"""

        return next((object for object in self.objects if object.id == id), None)

    def all(self) -> list[PolymorphicModel]:
        """Return all objects in the repository"""

        return self.objects

    def len(self) -> int:
        """Return the number of objects in the repository"""

        return len(self.objects)

    def update_attribute(self, id: int, attribute_name: str, value):
        """Select an object by id in the repository and set it's attribute attribute_name to value"""

        object_index = next((i for i, object in enumerate(self.objects) if object.id == id), -1)

        if object_index < 0:
            raise IndexError(f"{self.base_model_type.__name__} object with id {id} not found")

        setattr(self.objects[object_index], attribute_name, value)

    def add(self, object: PolymorphicModel):
        """Add an object to the repository"""

        # check if object base type is correct
        if not self.base_model_type.__name__ == utils.get_base_polymorphic_model(object).__name__:
            raise ValueError(
                f"Can only insert objects of type {self.base_model_type.__name__}. Object type for attempted insertion: {utils.get_base_polymorphic_model(object).__name__}"
            )

        self.objects.append(object)

    def remove(self, object: PolymorphicModel):
        """Remove an item from the repository"""

        self.objects.remove(object)


def attribute_matches_value(
    object: object, attribute_name: str, value, comparator: AttributeFilterComparator
):
    # throws if attribute doesn't exist
    attribute = getattr(object, attribute_name)

    if comparator.value == AttributeFilterComparator.EQUAL.value:
        return attribute == value

    if comparator.value == AttributeFilterComparator.LESS_THAN.value:
        return attribute < value

    if comparator.value == AttributeFilterComparator.GREATER_THAN.value:
        return attribute > value

    if comparator.value == AttributeFilterComparator.NOT_EQUAL.value:
        return attribute != value

    raise Exception("unreachable")
