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
        # TODO SEM HIERZO!!!
        raise NotImplementedError()
