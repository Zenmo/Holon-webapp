from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.filter.filter import Filter
from holon.models.util import is_allowed_relation


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

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the attribute filter to a repository"""

        model_attribute = self.model_attribute
        if is_allowed_relation(model_attribute):
            # Add id to attribute so it can be updated with an id compared to a model instance
            model_attribute += "_id"

        return repository.filter_attribute_value(model_attribute, self.comparator, self.value)

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value}]"
