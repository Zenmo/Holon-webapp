import json

from anylogiccloudclient.client.cloud_client import CloudClient as ALCloudClient
from anylogiccloudclient.client.cloud_client import Inputs
from anylogiccloudclient.client.single_run_outputs import SingleRunOutputs
from anylogiccloudclient.data.model import Model
from anylogiccloudclient.data.model_data import ModelData

from holon.models.config import AnylogicCloudInput
from holon.models.scenario import Scenario
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.services.cloudclient.output import AnyLogicOutput
from pipit.sentry import sentry_sdk_trace
import sentry_sdk


class CloudClient:
    """a more convient way of working with the AnyLogic cloud client"""

    def __init__(self, payload: ScenarioAggregate, scenario: Scenario = None):
        from holon.models.config import AnylogicCloudConfig

        # db lookup
        config: AnylogicCloudConfig = scenario.anylogic_config.get()
        self.config = config

        # value attributes
        self.url = config.url
        self.client = ALCloudClient(config.api_key, config.url)

        # method attributes
        self.model_version = self._get_model_version(
            model_name=config.model_name, model_version=config.model_version_number
        )

        self.payload = payload

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

    @sentry_sdk_trace
    def run(self) -> AnyLogicOutput:
        """run the scenario, outputs are set to the .outputs attribute"""

        inputs = self.create_inputs()

        outputs = self.client.create_simulation(inputs).get_outputs_and_run_if_absent()
        self.log_input_output(inputs, outputs)

        return AnyLogicOutput.from_source(outputs, self.config.anylogic_cloud_output.all())

    def create_inputs(self) -> Inputs:
        inputs = self.client.create_default_inputs(self.model_version)
        inputs.set_input("P import local config jsons", False)

        self.__add_datamodel_inputs(inputs)
        self.__add_custom_inputs(inputs)

        return inputs

    def __add_datamodel_inputs(self, inputs: Inputs):
        json_data = self.payload.serialize_to_json()
        inputs.set_input("P grid connection config JSON", json_data["gridconnections"])
        inputs.set_input("P grid node config JSON", json_data["gridnodes"])
        inputs.set_input("P policies config JSON", json_data["policies"])
        inputs.set_input("P actors config JSON", json_data["actors"])

    def __add_custom_inputs(self, inputs: Inputs):
        additional_inputs = self.config.anylogic_cloud_input.all()
        for additional_input in additional_inputs:
            ai: AnylogicCloudInput = additional_input
            inputs.set_input(ai.anylogic_key, ai.anylogic_value)

    def log_input_output(self, inputs: Inputs, outputs: SingleRunOutputs):
        span = sentry_sdk.Hub.current.scope.span
        ## Disabled because it's too much data and Sentry seems to drop it.
        # if span is not None and span.sampled is True:
        #     span.set_data(
        #         "inputs", list(map(self.model_input_value_to_log_format, inputs.inputs_array))
        #     )
        #     span.set_data(
        #         "outputs",
        #         list(map(self.model_output_value_to_log_format, outputs.get_raw_outputs())),
        #     )

    def model_input_value_to_log_format(self, model_input: dict) -> dict:
        value = model_input["value"]
        if isinstance(value, str):
            try:
                # Some parameters are received double-encoded.
                # This removes the double encoding, so it is easier to read.
                model_input["value"] = json.loads(value)
            except json.decoder.JSONDecodeError:
                pass

        return model_input

    def model_output_value_to_log_format(self, model_output: ModelData) -> dict:
        value = model_output.value
        if isinstance(value, str):
            try:
                # Some parameters are received double-encoded.
                # This removes the double encoding, so it is easier to read.
                value = json.loads(value)
            except json.decoder.JSONDecodeError:
                pass

        return {
            "name": model_output.name,
            "value": value,
            "type": model_output.type,
            "unit": model_output.units,
        }
