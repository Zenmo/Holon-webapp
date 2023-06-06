from holon.models import Scenario
from holon.rule_engine.repositories import ActorRepository


class ScenarioAggregate:
    """Aggregate containing scenario and related models in memory"""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario
        self.actor_repository = ActorRepository(self)
