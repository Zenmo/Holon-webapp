from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.filter.filter import Filter


class DiscreteAttributeFilter(Filter):
    """Filter on attribute with discrete series"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="discrete_attribute_filters"
    )

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    def clean(self):
        super().clean()

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.discrete_relation_field_options():
                raise ValidationError("Invalid model attribute, not discrete")

            if self.value not in self.value_options():
                raise ValidationError("Invalid value, not a choice for model attribute")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value}]"

    def discrete_relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if hasattr(field, "choices") and field.choices
        ]

    def value_options(self) -> list[str]:
        if not self.model_attribute:
            return []

        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)
        field = model()._meta.get_field(self.model_attribute)

        if not hasattr(field, "choices") and not field.choices:
            return []

        return [choice[0] for choice in field.choices]

    def get_q(self) -> Q:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            return Q(**{f"{model_type}___{self.model_attribute}": self.value})
        if self.comparator == AttributeFilterComparator.LESS_THAN.value:
            ignore_none_value_q = ~Q(**{f"{model_type}___{self.model_attribute}": -1})
            return (
                Q(**{f"{model_type}___{self.model_attribute}__lt": self.value})
                & ignore_none_value_q
            )
        if self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            ignore_none_value_q = ~Q(**{f"{model_type}___{self.model_attribute}": -1})
            return (
                Q(**{f"{model_type}___{self.model_attribute}__gt": self.value})
                & ignore_none_value_q
            )
        if self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            return ~Q(**{f"{model_type}___{self.model_attribute}": self.value})

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the attribute filter with an Enum attribute to a repository"""

        return repository.filter_enum_attribute_value(
            self.model_attribute, self.value, self.comparator
        )
