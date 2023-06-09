from __future__ import annotations
from typing import Type

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator


class RepositoryBaseClass:
    """Repository containing all actors in memory"""

    objects: list[object] = []

    def dict(self):
        return {obj.id: obj for obj in self.objects}

    # TODO ERIK
    def clone(self) -> RepositoryBaseClass:
        """Clone the object"""

        raise NotImplementedError()

    # TODO ERIK
    def filter_model_subtype(self, model_subtype: Type) -> RepositoryBaseClass:
        """
        Keep only items in the repository that match with a certain filter
        <RETURNS MODIFIED REPOSITORY>
        """
        raise NotImplementedError()

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

    def get_subset_range(self, start: int = None, end: int = None):
        """Return a repository with a subset of it's objects, depending on an index range"""
        
        # TODO test broadcasting [x:None] etc

        self.objects = 

    # TODO ERIK
    def get(self, id: int) -> object:
        """Get an item in the objects list by id"""
        raise NotImplementedError()

    def all(self) -> list[object]:
        """Return all objects in the repository"""
        return self.objects

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
