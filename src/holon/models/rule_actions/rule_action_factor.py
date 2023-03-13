from holon.models.rule_actions import RuleAction
from holon.models.scenario_rule import ScenarioRule

from django.db import models
from django.db.models.query import QuerySet
from modelcluster.fields import ParentalKey

from wagtail.admin.edit_handlers import FieldPanel


class RuleActionFactor(RuleAction):
    """A continuous factor for scaling an input value between a certain range"""

    model_attribute = models.CharField(max_length=255, null=False)

    rule = ParentalKey(ScenarioRule, on_delete=models.CASCADE, related_name="continuous_factors")

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("min_value"),
        FieldPanel("max_value"),
    ]

    class Meta:
        verbose_name = "RuleActionFactor"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """
        Apply rescaling of an atribute of filtered_object according to value.
        May throw ValueError if value cannot be parsed to float.
        """

        # rescale value according to min/max
        value_flt = float(value)
        mapped_value = (self.max_value - self.min_value) * (value_flt / 100.0) + self.min_value

        for filtered_object in filtered_queryset:
            setattr(filtered_object, self.model_attribute, mapped_value)
            filtered_object.save()
