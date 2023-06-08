from django.apps import apps
from django.db import models
from django.db.models import Q
from polymorphic.models import PolymorphicModel

from holon.models.util import (
    is_exclude_field,
    is_allowed_relation,
)
from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.rule_engine.repositories.repository_base import RepositoryBaseClass
from holon.rule_engine.scenario_aggregate import ScenarioAggregate


class Filter(PolymorphicModel):
    """Information on how to find the objects a scenario rule should be applied to"""

    model_attribute = models.CharField(max_length=255, null=True, blank=True)
    comparator = models.CharField(max_length=255, choices=AttributeFilterComparator.choices)
    value = models.JSONField(null=True, blank=True)

    def model_attribute_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if is_allowed_relation(field.name)
            or (not field.is_relation and not is_exclude_field(field))
        ]

    class Meta:
        abstract = True

    def get_q(self) -> Q:
        pass

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the current filter to a repository"""
        pass
