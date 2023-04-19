
from holon.models import Scenario
import traceback

def pprint(msg: str):
    return print(f"[holon-endpoint]: {msg}")

cloned_scenarios = Scenario.objects.filter(cloned_from__isnull=False)
try:
    for scenario in cloned_scenarios:
        pprint(f"Deleting scenario {scenario.id}...")
        cid = scenario.id
        scenario.delete()
        pprint(f"... deleted scenario {cid}")
except Exception as e:
    pprint(traceback.format_exc())
