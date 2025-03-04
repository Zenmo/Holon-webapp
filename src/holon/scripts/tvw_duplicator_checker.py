from functools import partial

import numpy as np
from django.db.models import Q

from holon.models import BuildingGridConnection, HouseGridConnection, Scenario
from holon.models.util import duplicate_model

np.random.seed(0)


house_ndf = {
    "tempSetpointNight_degC": partial(np.random.normal, loc=15, scale=0.5, size=1),
    "tempSetpointNight_start_hr": partial(np.random.normal, loc=22, scale=1, size=1),
    "tempSetpointDay_degC": partial(np.random.normal, loc=20, scale=0.5, size=1),
    "tempSetpointDay_start_hr": partial(np.random.normal, loc=8, scale=0.5, size=1),
    "pricelevelLowDifFromAvg_eurpkWh": partial(np.random.normal, loc=0.018, scale=0.004, size=1),
    "pricelevelHighDifFromAvg_eurpkWh": partial(np.random.normal, loc=0.009, scale=0.002, size=1),
}


multis = [
    {
        "id": 14,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 19, "ndf": house_ndf},
            {"model": BuildingGridConnection, "type": None, "factor": 19, "ndf": house_ndf},
        ],
    },
    {
        "id": 15,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 39, "ndf": house_ndf},
        ],
    },
    {
        "id": 16,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 39, "ndf": house_ndf},
        ],
    },
    {
        "id": 17,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 39, "ndf": house_ndf},
        ],
    },
    {
        "id": 18,
        "action": [
            {"model": HouseGridConnection, "type": "TERRACED", "factor": 29, "ndf": house_ndf},
            {"model": HouseGridConnection, "type": "SEMIDETACHED", "factor": 9, "ndf": house_ndf},
        ],
    },
    {
        "id": 19,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 39, "ndf": house_ndf},
        ],
    },
]

scenario = Scenario.objects.get(id=1)


def run():
    for m in multis:
        gridnode = scenario.gridnode_set.get(id=m["id"])
        for ma in m["action"]:
            print(
                f"\U0001f449 Should find {ma['factor']+1} instances of type {ma['model'].__name__} ({ma['type']})"
            )

            if ma["type"] is None:
                count = gridnode.gridconnection_set.instance_of(ma["model"]).all().count()
            else:
                count = (
                    gridnode.gridconnection_set.instance_of(ma["model"])
                    .filter(Q(HouseGridConnection___type=ma["type"]))
                    .all()
                    .count()
                )
            if count == ma["factor"] + 1:
                check = "\U00002705"
            else:
                check = "\U0000214c"

            print(
                f"\t {check} Found {count} instances of type {ma['model'].__name__} ({ma['type']}){check}\n "
            )
