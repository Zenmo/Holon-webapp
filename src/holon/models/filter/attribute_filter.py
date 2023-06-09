from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.filter.filter import Filter


class AttributeFilter(Filter):
    """Filter on attribute"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="attribute_filters")

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    class Meta:
        verbose_name = "AttributeFilter"

    def clean(self):
        super().clean()

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
        except ObjectDoesNotExist:
            return

    def get_q(self) -> Q:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            return Q(**{f"{model_type}___{self.model_attribute}": self.value})
        if self.comparator == AttributeFilterComparator.LESS_THAN.value:
            return Q(**{f"{model_type}___{self.model_attribute}__lt": self.value})
        if self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            return Q(**{f"{model_type}___{self.model_attribute}__gt": self.value})
        if self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            return ~Q(**{f"{model_type}___{self.model_attribute}": self.value})

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the attribute filter to a repository"""

        return repository.filter_attribute_value(self.model_attribute, self.value, self.comparator)

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value}]"
