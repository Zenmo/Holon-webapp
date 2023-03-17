from functools import partial

import numpy as np
from django.db.models import Q

from holon.models import (
    BuildingGridConnection,
    DistrictHeatingGridConnection,
    ElectricGridNode,
    EnergyAsset,
    HouseGridConnection,
    Scenario,
)
from holon.models.asset import (
    DieselVehicleAsset,
    ElectricConsumptionAsset,
    HeatConsumptionAsset,
    HybridConsumptionAsset,
)
from holon.models.util import duplicate_model

np.random.seed(0)

A = 0.2

house_pdf = {
    "tempSetpointNight_degC": partial(np.random.normal, loc=15, scale=0.5, size=1),
    "tempSetpointNight_start_hr": partial(np.random.normal, loc=22, scale=1, size=1),
    "tempSetpointDay_degC": partial(np.random.normal, loc=20, scale=0.5, size=1),
    "tempSetpointDay_start_hr": partial(np.random.normal, loc=8, scale=0.5, size=1),
    "pricelevelLowDifFromAvg_eurpkWh": partial(np.random.uniform, low=0.01, high=A, size=1),
    "pricelevelHighDifFromAvg_eurpkWh": partial(np.random.uniform, low=0, high=A - 0.01, size=1),
}


multis = [
    {
        "id": 3,
        "action": [
            {"model": HouseGridConnection, "type": None, "factor": 39, "pdf": house_pdf},
        ],
    }
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
                ndf_field_dict = {field: int(ndf()) for field, ndf in ma["pdf"].items()}
                attr_dict = {"owner_actor": dupe_actor}
                ndf_field_dict.update(attr_dict)

                dupe_gridconnection = duplicate_model(gridconnection, attrs=ndf_field_dict)

                # duplicate asset
                for asset in gridconnection_assets:

                    verbruik_field = get_verbruik_field(asset)

                    if verbruik_field:  # wel consumptionasset
                        random_verbruik = np.random.uniform(low=1500, high=4500)
                        print(
                            f"Asset {asset.__class__.__name__} found, set field {verbruik_field} to {random_verbruik}"
                        )
                        duplicate_model(
                            asset,
                            {
                                "gridconnection": dupe_gridconnection,
                                verbruik_field: random_verbruik,
                            },
                        )
                    else:  # geen consumptionasset
                        duplicate_model(
                            asset,
                            {"gridconnection": dupe_gridconnection},
                        )


def get_verbruik_field(asset: EnergyAsset) -> str:
    """Get the verbruikfield of the asset in question"""

    if isinstance(asset, DieselVehicleAsset):
        return "energyConsumption_kWhpkm"
    if isinstance(asset, HeatConsumptionAsset):
        return "yearlyDemandHeat_kWh"
    if isinstance(asset, ElectricConsumptionAsset):
        return "yearlyDemandElectricity_kWh"
    if isinstance(asset, HybridConsumptionAsset):
        return "yearlyDemandHeat_kWh"  # TODO OF IS DIT "yearlyDemandElectricity_kWh" ?? - TAVM
