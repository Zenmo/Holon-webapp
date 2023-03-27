from holon.models.rule_actions import RuleAction
from holon.models.scenario_rule import ScenarioRule

from django.db import models
from django.db.models.query import QuerySet

from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel


class RemoveMode(models.TextChoices):
    """Types of remove modes"""

    REMOVE_ALL = "remove_all"  # remove all items
    REMOVE_N = "remove_n"  # remove n items
    KEEP_N = "keep_n"  # remove everything but n items


class RuleActionRemove(RuleAction):
    """Remove the filtered items"""

    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_remove"
    )

    remove_mode = models.CharField(max_length=255, choices=RemoveMode.choices)

    panels = [
        FieldPanel("remove_mode"),
    ]

    class Meta:
        verbose_name = "RuleActionRemove"

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Remove the filtered items"""

        # remove subselection
        if self.remove_mode == RemoveMode.REMOVE_ALL.value:
            remove_n = len(filtered_queryset)

        elif self.remove_mode == RemoveMode.REMOVE_N.value:
            remove_n = int(value)

        elif self.remove_mode == RemoveMode.KEEP_N.value:
            remove_n = len(filtered_queryset) - int(value)

        else:
            raise NotImplementedError(f"No functionality implemented for remove mode {self.remove_mode}")

        # remove remove_n items
        for filtered_object in filtered_queryset:
            if remove_n <= 0:
                return

            filtered_object.delete()

            remove_n -= 1
