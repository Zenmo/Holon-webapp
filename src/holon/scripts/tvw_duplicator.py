from functools import partial

import numpy as np
from django.db.models import Q

from holon.models import (BuildingGridConnection,
                          DistrictHeatingGridConnection, ElectricGridNode,
                          EnergyAsset, HouseGridConnection, Scenario)
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
        gridnode = scenario.gridnode_set.get(id=m["id"])
        for ma in m["action"]:
            if ma["type"] is None:
                gridconnection = gridnode.gridconnection_set.instance_of(ma["model"]).get()
            else:
                gridconnection = (
                    gridnode.gridconnection_set.instance_of(ma["model"])
                    .filter(Q(HouseGridConnection___type=ma["type"]))
                    .get()
                )

            print(f"gridconnection {gridconnection.id}")

            gridconnection_assets = gridconnection.energyasset_set.all()
            print(
                f"found {len(gridconnection_assets)} assets for gridconnection {gridconnection.id}"
            )

            gridconnection_actor = gridconnection.owner_actor
            print(f"found actor {gridconnection_actor.id}")

            actor_contracts = gridconnection_actor.contracts.all()
            print(f"found {len(actor_contracts)} contracts for actor")

            for _ in range(ma["factor"]):
                # duplicate actors
                dupe_actor = duplicate_model(gridconnection_actor)

                for contract in actor_contracts:
                    duplicate_model(contract, {"actor": dupe_actor})

                # duplicate gridconnection
                ndf_field_dict = {field: int(ndf()) for field, ndf in ma["ndf"].items()}
                attr_dict = {"owner_actor": dupe_actor}
                ndf_field_dict.update(attr_dict)

                dupe_gridconnection = duplicate_model(gridconnection, attrs=ndf_field_dict)

                # duplicate asset
                for asset in gridconnection_assets:
                    duplicate_model(asset, {"gridconnection": dupe_gridconnection})
