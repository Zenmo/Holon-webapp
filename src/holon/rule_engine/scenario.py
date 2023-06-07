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

    def to_tree(self):
        tree = self.scenario

        actor_lookup = self.actor_repository.dict()
        node_lookup = self.gridnode_repository.dict()

        contracts = self.contract_repository.list()
        for contract in contracts:
            contract.contractScope = actor_lookup[contract.contractScope_id]

        tree.actors = self.actor_repository.list()
        for actor in tree.actors:
            actor.contract_list = [
                contract for contract in contracts if contract.actor_id == actor.id
            ]

        tree.gridconnections = self.gridconnection_repository.list()

        tree.gridnodes = self.gridnode_repository.list()

        for node in tree.gridnodes:
            if node.owner_actor_id:
                node.owner_actor = actor_lookup[node.owner_actor_id]
            if node.parent_id:
                node.parent = node_lookup[node.parent_id]

            node.energyasset_list = [
                asset
                for asset in self.energyasset_repository.list()
                if asset.gridnode_id == node.id
            ]

        for connection in tree.gridconnections:
            if connection.owner_actor_id:
                connection.owner_actor = actor_lookup[connection.owner_actor_id]
            if connection.parent_heat_id:
                connection.parent_heat = node_lookup[connection.parent_heat_id]
            if connection.parent_electric:
                connection.parent_electric = node_lookup[connection.parent_electric_id]

            connection.energyasset_list = [
                asset
                for asset in self.energyasset_repository.list()
                if asset.gridconnection_id == connection.id
            ]

        tree.policies = self.policy_repository.list()

        return tree
