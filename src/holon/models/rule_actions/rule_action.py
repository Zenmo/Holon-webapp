from __future__ import annotations
from typing import TYPE_CHECKING

from polymorphic.models import PolymorphicModel


if TYPE_CHECKING:
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

    from holon.rule_engine.scenario_aggregate import ScenarioAggregate

# Don't forget to register new actions in get_actions() of ScenarioRule


class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    class Meta:
        verbose_name = "RuleAction"

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply a rule action to an object in the repository"""

        raise NotImplementedError()
