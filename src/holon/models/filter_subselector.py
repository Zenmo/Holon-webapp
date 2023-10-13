from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.core.exceptions import ValidationError
from django.db import models
from polymorphic.models import PolymorphicModel
from wagtail.admin.panels import FieldPanel
import random
from modelcluster.fields import ParentalKey


class AmountType(models.TextChoices):
    """Select absolute number of items or relative number"""

    ABSOLUTE = "ABSOLUTE"
    RELATIVE = "RELATIVE"


class FilterSubSelector(PolymorphicModel):
    """Base class for a class that allows selecting a subset of the elements in a repository"""

    use_interactive_element_value = models.BooleanField(default=True)
    number_of_items = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="number or percentage of items (leave empty if using interactive element value)",
    )
    amount_type = models.CharField(
        max_length=32,
        choices=AmountType.choices,
        default=AmountType.ABSOLUTE.value,
        null=False,
        blank=False,
        verbose_name="Absolute number of items or percentage of total selection (number between 0 and 100)",
    )

    panels = [
        FieldPanel("use_interactive_element_value"),
        FieldPanel("amount_type"),
        FieldPanel("number_of_items"),
    ]

    def clean(self):
        if not self.use_interactive_element_value and self.number_of_items <= 0:
            raise ValidationError("number of items should be larger than zero")

    def subselect_repository(
        self,
        repository: RepositoryBaseClass,
        value: str,
        number_generator: random.Random,
    ) -> RepositoryBaseClass:
        """Return a subset of items from the object list"""
        pass


class Skip(FilterSubSelector):
    """Class that allows for skipping a certain amount of items in a repository"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="subselector_skips")

    def subselect_repository(
        self,
        repository: RepositoryBaseClass,
        value: str,
        number_generator: random.Random,
    ) -> RepositoryBaseClass:
        """Skip a number of items in the object list"""

        # determine number of items to skip
        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        # case mode relative
        if self.amount_type == AmountType.RELATIVE.value:
            n = int(float(n / 100) * repository.len())

        # return repository with subset of objects
        return repository.get_subset_range(start=n)

    def hash(self):
        return f"[S{self.id},{self.use_interactive_element_value},{self.number_of_items}]"


class TakeMode(models.TextChoices):
    """Different methods of selecting part of a repository"""

    FIRST = "FIRST"
    RANDOM = "RANDOM"


class Take(FilterSubSelector):
    """Class that takes a certain amount of items in a repository"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="subselector_takes")
    mode = models.CharField(max_length=32, choices=TakeMode.choices, null=False, blank=False)

    panels = FilterSubSelector.panels + [
        FieldPanel("mode"),
    ]

    def hash(self):
        return (
            f"[S{self.id},{self.use_interactive_element_value},{self.number_of_items},{self.mode}]"
        )

    def subselect_repository(
        self,
        repository: RepositoryBaseClass,
        value: str,
        number_generator: random.Random,
    ) -> RepositoryBaseClass:
        """Take a number of items from the object list, either the first n or random n"""

        # determine number of items to take
        if self.use_interactive_element_value:
            n = int(float(value))
        else:
            n = self.number_of_items

        # in case the mode is relative
        if self.amount_type == AmountType.RELATIVE.value:
            n = int(float(n / 100) * repository.len())

        # take items depending on mode
        if self.mode == TakeMode.FIRST.value:
            return repository.get_subset_range(end=n)

        elif self.mode == TakeMode.RANDOM.value:
            indices = range(repository.len())
            random_indices = number_generator.sample(indices, k=n)
            return repository.get_subset_range(indices=random_indices)
