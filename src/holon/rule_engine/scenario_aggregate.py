from holon.models import Scenario
from holon.rule_engine.repositories import (
    ActorRepository,
    EnergyAssetRepository,
    ContractRepository,
    GridConnectionRepository,
    GridNodeRepository,
    PolicyRepository,
)
from src.holon.models.interactive_element import ChoiceType
from src.holon.models.scenario_rule import ModelType, ScenarioRule
from src.holon.rule_engine.repositories.repository_base import RepositoryBaseClass
from src.holon.serializers.interactive_element import InteractiveElementInput
from django.apps import apps
from holon.serializers import ScenarioV2Serializer


class ScenarioAggregate:
    """Aggregate containing scenario and related models in memory"""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario

        self.actor_repository = ActorRepository(self.scenario)
        self.energyasset_repository = EnergyAssetRepository(self.scenario)
        self.contract_repository = ContractRepository(self.scenario)
        self.gridconnection_repository = GridConnectionRepository(self.scenario)
        self.gridnode_repository = GridNodeRepository(self.scenario)
        self.policy_repository = PolicyRepository(self.scenario)

    def get_repository_for_model_type(self, model_type_name: str) -> RepositoryBaseClass:
        """Get the correct repository based on the model type name"""

        if model_type_name == ModelType.ACTOR.value:
            return self.actor_repository.clone()
        elif model_type_name == ModelType.ENERGYASSET.value:
            return self.energyasset_repository.clone()
        elif model_type_name == ModelType.GRIDNODE.value:
            return self.gridnode_repository.clone()
        elif model_type_name == ModelType.GRIDCONNECTION.value:
            return self.gridconnection_repository.clone()
        elif model_type_name == ModelType.POLICY.value:
            return self.policy_repository.clone()
        elif model_type_name == ModelType.CONTRACT.value:
            return self.contract_repository.clone()
        else:
            raise Exception(f"ScenarioAggregate: Not implemented model type name {model_type_name}")

    def serialize_to_json(self) -> dict:
        """"""
        scenario_tree = self.__to_tree()
        json_data = ScenarioV2Serializer(scenario_tree).data

        return json_data

    def __to_tree(self):
        """Convert scenario to a tree structure"""
        tree = self.scenario

        actor_lookup = self.actor_repository.dict()
        gridnode_lookup = self.gridnode_repository.dict()

        contracts = self.contract_repository.list()
        for contract in contracts:
            contract.contractScope = actor_lookup[contract.contractScope_id]

        tree.actors = self.actor_repository.list()
        for actor in tree.actors:
            actor.contract_list = [
                contract for contract in contracts if contract.actor_id == actor.id
            ]

        tree.gridnodes = self.gridnode_repository.list()
        for gridnode in tree.gridnodes:
            if gridnode.owner_actor_id:
                gridnode.owner_actor = actor_lookup[gridnode.owner_actor_id]
            if gridnode.parent_id:
                gridnode.parent = gridnode_lookup[gridnode.parent_id]

            gridnode.energyasset_list = [
                asset
                for asset in self.energyasset_repository.list()
                if asset.gridnode_id == gridnode.id
            ]

        tree.gridconnections = self.gridconnection_repository.list()
        for gridconnection in tree.gridconnections:
            if gridconnection.owner_actor_id:
                gridconnection.owner_actor = actor_lookup[gridconnection.owner_actor_id]
            if gridconnection.parent_heat_id:
                gridconnection.parent_heat = gridnode_lookup[gridconnection.parent_heat_id]
            if gridconnection.parent_electric:
                gridconnection.parent_electric = gridnode_lookup[gridconnection.parent_electric_id]

            gridconnection.energyasset_list = [
                asset
                for asset in self.energyasset_repository.list()
                if asset.gridconnection_id == gridconnection.id
            ]

        tree.policies = self.policy_repository.list()

        return tree
