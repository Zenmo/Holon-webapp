from holon.services import CloudClient
from holon.models import Scenario


def run():
    api_key = "7a3563c1-ea1c-41d6-8009-b7abfd93f7ba"
    model_name = "Base_9mar"
    model_version = 1
    scenario = Scenario.objects.get(id=1)

    c = CloudClient(
        scenario=scenario, api_key=api_key, model_name=model_name, model_version=model_version
    )
    c.run()
