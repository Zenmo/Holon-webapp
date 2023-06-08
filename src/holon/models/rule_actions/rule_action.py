from django.db.models.query import QuerySet
from polymorphic.models import PolymorphicModel
from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from holon.rule_engine.scenario_aggregate import ScenarioAggregate

# Don't forget to register new actions in get_actions() of ScenarioRule


class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    class Meta:
        verbose_name = "RuleAction"
        # abstract = True

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Apply a rule action to an object in the queryset"""
        pass

    def apply_to_scenario_aggregate(
        self,
        scenario_aggregate: ScenarioAggregate,
        filtered_repository: RepositoryBaseClass,
        value: str,
    ) -> ScenarioAggregate:
        """Apply a rule action to an object in the queryset"""

        raise NotImplementedError()
