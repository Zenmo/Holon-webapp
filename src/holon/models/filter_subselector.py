from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import QuerySet
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel
import random
from modelcluster.fields import ParentalKey


class FilterSubSelector(PolymorphicModel):
    """Base class for a class that allows selecting a subset of the elements in a queryset"""

    use_interactive_element_value = models.BooleanField(default=True)
    number_of_items = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="number of items (leave empty if using interactive element value)",
    )

    panels = [
        FieldPanel("use_interactive_element_value"),
        FieldPanel("number_of_items"),
    ]

    def clean(self):
        if not self.use_interactive_element_value and self.number_of_items <= 0:
            raise ValidationError("number of items should be larger than zero")

    def subselect_queryset(self, queryset: QuerySet, value: str) -> QuerySet:
        """Select a subset of items from the queryset"""
        pass

    def subselect_repository(
        self, repository: RepositoryBaseClass, value: str
    ) -> RepositoryBaseClass:
        """Return a subset of items from the object list"""
        pass


class Skip(FilterSubSelector):
    """Class that allows for skipping a certain amount of items in a queryset"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="subselector_skips")

    # TODO remove after rule engine update
    def subselect_queryset(self, queryset: QuerySet, value: str) -> QuerySet:
        """Skip a number of items in the queryset"""
        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        return queryset[n:]

    def subselect_repository(
        self, repository: RepositoryBaseClass, value: str
    ) -> RepositoryBaseClass:
        """Skip a number of items in the object list"""

        # determine number of items to skip
        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        # return repository with subset of objects
        return repository.get_subset_range(start=n)

    def hash(self):
        return f"[S{self.id},{self.use_interactive_element_value},{self.number_of_items}]"


class TakeMode(models.TextChoices):
    """Different methods of selecting part of a queryset"""

    FIRST = "FIRST"
    RANDOM = "RANDOM"


class Take(FilterSubSelector):
    """Class that takes a certain amount of items in a queryset"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="subselector_takes")
    mode = models.CharField(max_length=32, choices=TakeMode.choices, null=False, blank=False)

    panels = FilterSubSelector.panels + [
        FieldPanel("mode"),
    ]

    def hash(self):
        return (
            f"[S{self.id},{self.use_interactive_element_value},{self.number_of_items},{self.mode}]"
        )

    # TODO remove after rule engine update
    def subselect_queryset(self, queryset: QuerySet, value: str) -> QuerySet:
        """Take a number of items from the queryset, either the first n or random n"""

        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        if self.mode == TakeMode.FIRST.value:
            return queryset[:n]

        elif self.mode == TakeMode.RANDOM.value:
            ids = list(queryset.values_list("id", flat=True))
            random_ids = random.sample(ids, k=n)
            return queryset.filter(pk__in=random_ids)

        raise NotImplementedError(f"Take mode {self.mode} is not implemented")

    def subselect_repository(
        self, repository: RepositoryBaseClass, value: str
    ) -> RepositoryBaseClass:
        """Take a number of items from the object list, either the first n or random n"""

        # determine number of items to take
        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        # take items depending on mode
        if self.mode == TakeMode.FIRST.value:
            return repository.get_subset_range(end=n)

        elif self.mode == TakeMode.RANDOM.value:
            indices = range(repository.len())
            random_indices = random.sample(indices, k=n)
            return repository.get_subset_range(indices=random_indices)
