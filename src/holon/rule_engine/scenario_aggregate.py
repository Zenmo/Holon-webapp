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

    def apply_rules(self, interactive_element_inputs: list[InteractiveElementInput]):
        """Apply the rules with interactive element inputs on the scenario aggregate"""
        pass

    def serialize_to_json(self) -> dict:
        """"""
        pass  # TODO SEM HIERZO!!!

    def __get_filtered_repository(self, rule: ScenarioRule) -> RepositoryBaseClass:
        """Return a filtered repository"""

        # get the correct repository
        repository = self.__get_repository_for_model_type(rule.model_type)

        # filter the repository
        if rule.model_subtype:
            model_subtype = apps.get_model("holon", rule.model_subtype)
            repository = repository.filter_model_subtype(model_subtype)

    def __get_repository_for_model_type(self, model_type: str) -> RepositoryBaseClass:
        """Get the correct repository based on the scenario rule model type"""

        if model_type == ModelType.ACTOR.value:
            return self.actor_repository
        elif model_type == ModelType.ENERGYASSET.value:
            return self.energyasset_repository
        elif model_type == ModelType.GRIDNODE.value:
            return self.gridnode_repository
        elif model_type == ModelType.GRIDCONNECTION.value:
            return self.gridconnection_repository
        elif model_type == ModelType.POLICY.value:
            return self.policy_repository
        elif model_type == ModelType.CONTRACT.value:
            return self.contract_repository
        else:
            raise Exception("Not implemented model type")
