from anylogiccloudclient.client.cloud_client import CloudClient as ALCloucClient


class CloudClient:
    """a more convient way of working with the AnyLogic cloud client"""

    def __init__(self, api_key: str, url: str, model_name: str, model_version: int) -> None:
        self.url = url
        self.client = ALCloucClient(api_key, url)
        self.connect_to_model(model_name=model_name, model_version=model_version)

    def connect_to_model(
        self,
        model_name: str,
        model_version: int,
    ) -> None:
        """connect to model"""

        if model_name not in self.client.get_models():
            raise ValueError(
                f"Supplied model name '{model_name}' not in available models (check "
                + f"the rights for the provided 'api_key' if this doesn't feel right): "
                + f"{self.client.get_models()}"
            )

        _model = self.client.get_model_by_name(model_name)
        self.model = self.client.get_model_version_by_number(
            model=_model, version_number=model_version
        )

    def run():
        pass
