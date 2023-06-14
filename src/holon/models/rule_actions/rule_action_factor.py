from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from holon.models.rule_actions import RuleAction
from holon.models.scenario_rule import ScenarioRule

from django.db import models
from modelcluster.fields import ParentalKey

from wagtail.admin.edit_handlers import FieldPanel
from django.core.exceptions import ObjectDoesNotExist, ValidationError


class RuleActionFactor(RuleAction):
    """A continuous factor for scaling an input value between a certain range"""

    model_attribute = models.CharField(max_length=255, null=False)

    rule: ScenarioRule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="continuous_factors"
    )

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("min_value"),
        FieldPanel("max_value"),
    ]

    class Meta:
        verbose_name = "RuleActionFactor"

    def clean(self):
        super().clean()

        try:
            if not self.model_attribute in self.rule.get_model_attributes_options():
                raise ValidationError(f"Invalid value {self.model_attribute} for model_attribute")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[A{self.id},{self.model_attribute},{self.min_value},{self.max_value}]"

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply a rule action to an object in the repository"""

        # rescale value according to min/max
        value_flt = float(value)
        mapped_value = (self.max_value - self.min_value) * (value_flt / 100.0) + self.min_value

        for filtered_object in filtered_repository.all():
            setattr(filtered_object, self.model_attribute, mapped_value)
            scenario_aggregate.repositories[filtered_repository.base_model_type.__name__].update(
                filtered_object
            )

        return scenario_aggregate
