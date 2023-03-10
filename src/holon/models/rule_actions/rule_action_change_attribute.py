from holon.models.rule_actions import RuleAction

from django.db import models
from modelcluster.fields import ParentalKey
from holon.models.scenario_rule import ScenarioRule

class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_attribute"
    )

    class Meta:
        verbose_name = "RuleActionChangeAttribute"

