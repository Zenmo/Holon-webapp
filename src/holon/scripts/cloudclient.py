from holon.services import CloudClient
from holon.models import Scenario


def run():
    scenario = Scenario.objects.get(id=1)

    cc = CloudClient(scenario)

    cc.run()

    cc.outputs
