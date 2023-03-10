from holon.models.rule_actions import RuleAction
from holon.models.scenario_rule import ScenarioRule

from django.db import models
from django.db.models.query import QuerySet

from modelcluster.fields import ParentalKey

class RuleActionRemove(RuleAction):
    """Remove the filtered items"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_remove"
    )

    class Meta:
        verbose_name = "RuleActionRemove"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Remove the filtered items"""

        filtered_queryset.delete()