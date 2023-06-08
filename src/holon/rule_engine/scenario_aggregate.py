# from __future__ import annotations
# from typing import TYPE_CHECKING

from holon.models.scenario import Scenario
from holon.rule_engine.repositories import (
    ActorRepository,
    EnergyAssetRepository,
    ContractRepository,
    GridConnectionRepository,
    GridNodeRepository,
    PolicyRepository,
)

from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from holon.models.scenario_rule import ModelType


class ScenarioAggregate:
    """Aggregate containing scenario and related models in memory"""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario

        self.repositories: dict[str, RepositoryBaseClass] = {
            ModelType.ACTOR.value: ActorRepository(self.scenario),
            ModelType.ENERGYASSET.value: EnergyAssetRepository(self.scenario),
            ModelType.CONTRACT.value: ContractRepository(self.scenario),
            ModelType.POLICY.value: PolicyRepository(self.scenario),
            ModelType.GRIDCONNECTION.value: GridConnectionRepository(self.scenario),
            ModelType.GRIDNODE.value: GridNodeRepository(self.scenario),
        }

    def get_repository_for_model_type(self, model_type_name: str) -> RepositoryBaseClass:
        """Get the correct repository based on the model type name"""

        if not model_type_name in self.repositories:
            raise Exception(f"ScenarioAggregate: Not implemented model type name {model_type_name}")

        return self.repositories[model_type_name].clone()

    def serialize_to_json(self) -> dict:
        """Serialize scenario to json with embedded relations"""
        from holon.serializers import ScenarioV2Serializer

        scenario_tree = self.__to_tree()
        # TODO rename after rule engine update
        json_data = ScenarioV2Serializer(scenario_tree).data

        return json_data

    def __to_tree(self):
        """Convert scenario to a tree structure"""
        tree = self.scenario

        actor_lookup = self.repositories[ModelType.ACTOR.value].dict()
        gridnode_lookup = self.repositories[ModelType.GRIDNODE.value].dict()

        contracts = self.repositories[ModelType.CONTRACT.value].all()
        for contract in contracts:
            contract.contractScope = actor_lookup[contract.contractScope_id]

        tree.actors = self.repositories[ModelType.ACTOR.value].all()
        for actor in tree.actors:
            actor.contract_list = [
                contract for contract in contracts if contract.actor_id == actor.id
            ]

        tree.gridnodes = self.repositories[ModelType.GRIDNODE.value].all()
        for gridnode in tree.gridnodes:
            if gridnode.owner_actor_id:
                gridnode.owner_actor = actor_lookup[gridnode.owner_actor_id]
            if gridnode.parent_id:
                gridnode.parent = gridnode_lookup[gridnode.parent_id]

            gridnode.energyasset_list = [
                asset
                for asset in self.repositories[ModelType.ENERGYASSET.value].all()
                if asset.gridnode_id == gridnode.id
            ]

        tree.gridconnections = self.repositories[ModelType.GRIDCONNECTION.value].all()
        for gridconnection in tree.gridconnections:
            if gridconnection.owner_actor_id:
                gridconnection.owner_actor = actor_lookup[gridconnection.owner_actor_id]
            if gridconnection.parent_heat_id:
                gridconnection.parent_heat = gridnode_lookup[gridconnection.parent_heat_id]
            if gridconnection.parent_electric:
                gridconnection.parent_electric = gridnode_lookup[gridconnection.parent_electric_id]

            gridconnection.energyasset_list = [
                asset
                for asset in self.repositories[ModelType.ENERGYASSET.value].all()
                if asset.gridconnection_id == gridconnection.id
            ]

        tree.policies = self.repositories[ModelType.POLICY.value].all()

        return tree
