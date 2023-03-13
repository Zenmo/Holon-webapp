from anylogiccloudclient.client.cloud_client import CloudClient as ALCloudClient
from anylogiccloudclient.client.cloud_client import Inputs
from holon.models.scenario import Scenario


class CloudClient:
    """a more convient way of working with the AnyLogic cloud client"""

    def __init__(
        self,
        scenario: Scenario,
    ) -> None:
        from holon.models.config import AnylogicCloudConfig

        config: AnylogicCloudConfig = scenario.anylogic_config.get()
        # value attributes
        self.url = config.url
        self.scenario = scenario
        self.client = ALCloudClient(config.api_key, config.url)

        # method attributes
        self.model_version = self.connect_to_model(
            model_name=config.model_name, model_version=config.model_version_number
        )
        self.payload = self.get_scenario_json(scenario)

    def connect_to_model(
        self,
        model_name: str,
        model_version: int,
    ) -> None:
        """connect to model"""

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
        """gets AnyLogic safe serialized version of datamodel (import due to circular)"""
        from holon.serializers import ScenarioSerializer

        return ScenarioSerializer(scenario).data

    def run(self):
        """run the scenario"""

        inputs: Inputs = self.client.create_default_inputs(self.model_version)

        inputs.set_input("P grid connection config JSON", self.payload["gridconnections"])
        inputs.set_input("P grid node config JSON", self.payload["gridnodes"])
        inputs.set_input("P policies config JSON", self.payload["policies"])

        return self.client.create_simulation(inputs).get_outputs_and_run_if_absent()
