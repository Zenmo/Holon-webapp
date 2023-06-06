from holon.models import Scenario
from holon.rule_engine.repositories import (
    ActorRepository,
    EnergyAssetRepository,
    ContractRepository,
    GridConnectionRepository,
    GridNodeRepository,
    PolicyRepository,
)


class ScenarioAggregate:
    """Aggregate containing scenario and related models in memory"""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario

        self.actor_repository = ActorRepository(self)
        self.energyasset_repository = EnergyAssetRepository(self)
        self.contract_repository = ContractRepository(self)
        self.gridconnection_repository = GridConnectionRepository(self)
        self.gridnode_repository = GridNodeRepository(self)
        self.policy_repository = PolicyRepository(self)
