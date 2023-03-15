from holon.models import (
    Scenario,
    ElectricGridNode,
    DistrictHeatingGridConnection,
    HouseGridConnection,
    BuildingGridConnection,
    EnergyAsset,
)
from django.db.models import Q
from functools import partial
import numpy as np
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
            {"model": HouseGridConnection, "type": None, "factor": 20, "ndf": house_ndf},
            {"model": BuildingGridConnection, "type": None, "factor": 20, "ndf": house_ndf},
        ],
    },
    {
        "id": 15,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 40, "ndf": house_ndf},
        ],
    },
    {
        "id": 16,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 40, "ndf": house_ndf},
        ],
    },
    {
        "id": 17,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 40, "ndf": house_ndf},
        ],
    },
    {
        "id": 18,
        "action": [
            {"model": HouseGridConnection, "type": "TERRACED", "factor": 30, "ndf": house_ndf},
            {"model": HouseGridConnection, "type": "SEMIDETACHED", "factor": 10, "ndf": house_ndf},
        ],
    },
    {
        "id": 19,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 40, "ndf": house_ndf},
        ],
    },
]

scenario = Scenario.objects.get(id=1)


def run():
    for m in multis:
        gn = scenario.gridnode_set.get(id=m["id"])

        for ma in m["action"]:
            if ma["type"] is None:
                gc = gn.gridconnection_set.instance_of(ma["model"]).get()
            else:
                gc = (
                    gn.gridconnection_set.instance_of(ma["model"])
                    .filter(Q(HouseGridConnection___type=ma["type"]))
                    .get()
                )

            for _ in range(ma["factor"]):
                dupe_assets = [
                    duplicate_model(
                        asset, attrs={field: int(ndf()) for field, ndf in ma["ndf"].items()}
                    )
                    for asset in gc.energyasset_set.all()
                ]

                dupe_gc = duplicate_model(gc)
                # restore relations
                dupe_gc.save()

                for asset in dupe_assets:
                    asset: EnergyAsset = asset
                    asset.id = None
                    asset.gridconnection = dupe_gc
                    asset.save()

                # actors and their contracts
