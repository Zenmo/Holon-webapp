from holon.services import CloudClient
from holon.models import Scenario
import json


def run():
    scenario = Scenario.objects.get(id=1)

    cc = CloudClient(scenario)

    # print(cc.client.create_default_inputs(cc.model_version).names())

    cc.run()

    cc.outputs

    with open("outputs-anylogic-fixture.json", "w") as outfile:
        json.dump(cc.outputs, outfile)
