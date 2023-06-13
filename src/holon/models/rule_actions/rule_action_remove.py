from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass


from holon.models.rule_actions import RuleAction
from holon.models.scenario_rule import ScenarioRule

from django.db import models
from django.db.models.query import QuerySet

from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel

from holon.models import Actor


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

    def hash(self):
        return f"[A{self.id},{self.remove_mode}]"

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply a rule action to an object in the queryset"""

        # remove subselection
        if self.remove_mode == RemoveMode.REMOVE_ALL.value:
            remove_n = filtered_repository.len()

        elif self.remove_mode == RemoveMode.REMOVE_N.value:
            remove_n = int(float(value))

        elif self.remove_mode == RemoveMode.KEEP_N.value:
            remove_n = filtered_repository.len() - int(float(value))

        else:
            raise NotImplementedError(
                f"No functionality implemented for remove mode {self.remove_mode}"
            )

        # remove remove_n items
        for filtered_object in filtered_repository.all():
            if remove_n <= 0:
                return scenario_aggregate

            scenario_aggregate = scenario_aggregate.remove_object(
                filtered_object, filtered_repository.base_model_type.__name__
            )

            remove_n -= 1

        return scenario_aggregate
