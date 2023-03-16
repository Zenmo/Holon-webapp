from holon.models.scenario import Scenario
from holon.models import QueryAndConvertConfig
from holon.services import QConfig
from pathlib import Path

fixture = Path(__file__).parent / "fixtures" / "outputs-anylogic-fixture.json"


def run():
    from holon.services import CloudClient
    import json

    scenario = Scenario.objects.get(id=1)
    configs: list[QueryAndConvertConfig] = scenario.query_and_convert_config.all()

    with open(fixture, "r") as infile:
        cc_outputs = json.load(infile)

    for c in configs:
        qc = QConfig(c, anylogic_outcomes=cc_outputs, copied_scenario=scenario)
        with open(f"{c.module}-{c.pk}.json", "w") as outfile:
            json.dump(qc.queries, outfile, indent=4)
