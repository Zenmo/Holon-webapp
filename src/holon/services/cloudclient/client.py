from anylogiccloudclient.client.cloud_client import CloudClient as ALCloudClient
from anylogiccloudclient.client.cloud_client import Inputs
from anylogiccloudclient.client.single_run_outputs import SingleRunOutputs
from holon.models.scenario import Scenario
from holon.models.config import AnylogicCloudInput
import json


class CloudClient:
    """a more convient way of working with the AnyLogic cloud client"""

    def __init__(
        self,
        scenario: Scenario,
    ):
        from holon.models.config import AnylogicCloudConfig

        # db lookup
        config: AnylogicCloudConfig = scenario.anylogic_config.get()
        self.config = config

        # value attributes
        self.url = config.url
        self.scenario = scenario
        self.client = ALCloudClient(config.api_key, config.url)

        # method attributes
        self.model_version = self._get_model_version(
            model_name=config.model_name, model_version=config.model_version_number
        )
        self.payload = self.get_scenario_json(scenario)

        # initials
        self._outputs = None

    def _get_model_version(
        self,
        model_name: str,
        model_version: int,
    ) -> None:
        """connect to the cloud and get the right model version"""

        model_names = [m.name for m in self.client.get_models()]

        if model_name not in model_names:
            raise ValueError(
                f"Supplied model name '{model_name}' not in available models (check "
                + f"the rights for the provided 'api_key' if this doesn't feel right): "
                + f"{model_names}"
            )

        _model = self.client.get_model_by_name(model_name)
        return self.client.get_model_version_by_number(model=_model, version_number=model_version)

    def get_scenario_json(self, scenario: Scenario) -> dict:
        """gets AnyLogic safe serialized version of the copied datamodel (import here due to circulars)"""
        # TODO has hardcoded values for input mapping
        from holon.serializers import ScenarioSerializer

        return ScenarioSerializer(scenario).data

    def run(self) -> None:
        """run the scenario, outputs are set to the .outputs attribute"""

        inputs: Inputs = self.client.create_default_inputs(self.model_version)

        inputs.set_input("P grid connection config JSON", self.payload["gridconnections"])
        inputs.set_input("P grid node config JSON", self.payload["gridnodes"])
        inputs.set_input("P policies config JSON", self.payload["policies"])
        inputs.set_input("P actors config JSON", self.payload["policies"])

        # Oh lord why!
        inputs.set_input("P import local config jsons", False)

        additional_inputs = self.config.anylogic_cloud_input.all()
        if len(additional_inputs) > 0:
            for additional_input in additional_inputs:
                ai: AnylogicCloudInput = additional_input
                inputs.set_input(ai.anylogic_key, ai.anylogic_value)

        self.outputs = self.client.create_simulation(inputs).get_outputs_and_run_if_absent()

    @property
    def outputs(self) -> dict:
        return self._outputs

    @outputs.setter
    def outputs(self, anylogic_outputs: SingleRunOutputs):
        self._outputs = {
            co.internal_key: json.loads(anylogic_outputs.value(co.anylogic_key))
            for co in self.config.anylogic_cloud_output.all()
        }
