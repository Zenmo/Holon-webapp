from __future__ import annotations
from typing import Type

from src.holon.models.filter.attribute_filter_comparator import AttributeFilterComparator


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
        """Keep only items in the repository that match with a certain filter"""
        raise NotImplementedError()

    def filter(self, filter) -> RepositoryBaseClass:
        """Keep only items in the repository that match with a certain filter"""
        raise NotImplementedError()

    # TODO ERIK
    def filter_attribute_value(
        self, attribute_name: str, value: str, comparator: AttributeFilterComparator
    ) -> RepositoryBaseClass:
        """"""
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

    def filter_has_relation(
        self,
        relation_field: str,
        relation_repository: RepositoryBaseClass,
        invert: bool = False,
    ) -> RepositoryBaseClass:
        """Filter the repository on items that have a relation that exists in the relation_repository. Possibility to invert the filter."""

        # TODO
        # - filter deze repository op welke items' relation field een item refereren die in de gefilterde relation_repository zit

        raise NotImplementedError()

    # TODO ERIK
    def get(self, id: int) -> object:
        """Get an item in the objects list by id"""
        raise NotImplementedError()

    def all(self) -> list[object]:
        """Return all objects in the repository"""
        return self.objects

    # TODO ERIK
    def add(self, object):
        """Add an object to the repository"""
        raise NotImplementedError()

    # TODO ERIK
    def remove(self, object):
        """Remove an item from the repository"""
        raise NotImplementedError()
