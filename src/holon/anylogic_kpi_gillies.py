import numpy as np
import pandas as pd


def determine_share_of_renewables(etm_data: dict) -> np.ndarray:

    renewables = np.array(
        [
            etm_data["hourly_supply_electricity_from_biogas"],
            etm_data["hourly_supply_electricity_from_biomass"],
            etm_data["hourly_supply_electricity_from_geothermal"],
            etm_data["hourly_supply_electricity_from_greengas"],
            etm_data["hourly_supply_electricity_from_hydro"],
            etm_data["hourly_supply_electricity_from_hydrogen"],
            etm_data["hourly_supply_electricity_from_solar"],
            etm_data["hourly_supply_electricity_from_uranium"],
            etm_data["hourly_supply_electricity_from_waste"],
            etm_data["hourly_supply_electricity_from_wind"],
        ]
    ).sum(axis=0)
    total = np.array(etm_data["hourly_production_electricity"])

    return renewables / total


def calculate_holon_kpis(
    total_cost_data: dict, etm_data: dict, gridnode_config: dict
) -> dict:

    import_curve_MWh = np.array(
        list(total_cost_data["SystemHourlyElectricityImport_MWh"].values())[:8760]
    )

    total_CO2_imported_electricity_kg = np.inner(
        etm_data["CO2_curve"], import_curve_MWh
    )

    # TODO: now hard coded; replace by a query
    etm_data.update({"CO2diesel_kgpMWh": 323, "CO2methane_kgpMWh": 1890 / 9})

    CO2totaal = (
        total_CO2_imported_electricity_kg
        + total_cost_data["totalMethaneImport_MWh"] * etm_data["CO2methane_kgpMWh"]
        + total_cost_data["totalDieselImport_MWh"] * etm_data["CO2diesel_kgpMWh"]
    )

    # TODO: Hardcoded; Grid electricity is considered 100% unsustainable at this CO2 intensity level
    share_of_renewables = determine_share_of_renewables(etm_data=etm_data)
    print("mean share renewables", np.mean(share_of_renewables))

    UnsustainableImportedElectricity_MWh = np.inner(
        1 - share_of_renewables, import_curve_MWh
    )

    print("Unsus electricity use: ", UnsustainableImportedElectricity_MWh, " MWh")
    print("Unsus diesel use: ", total_cost_data["totalDieselImport_MWh"], " MWh")
    print("Unsus methane use: ", total_cost_data["totalMethaneImport_MWh"], " MWh")
    print("Total energy use: ", total_cost_data["TotalEnergyUsed_MWh"], " MWh")
    # for key, value in etm_data.items() :
    #     print(key, value)

    Sustainability_pct = 100 * (
        1
        - (
            total_cost_data["totalDieselImport_MWh"]
            + total_cost_data["totalMethaneImport_MWh"]
            + UnsustainableImportedElectricity_MWh
        )
        / total_cost_data["TotalEnergyUsed_MWh"]
    )
    Sustainability_pct = min(100, Sustainability_pct)

    gridnode_config = pd.DataFrame(gridnode_config)
    MScapacity = gridnode_config[gridnode_config["type"] == "MSLS"]["capacity_kw"].sum()
    print("capacity ==== ", MScapacity)

    netload_pct = (max(0, total_cost_data["MSLSPeakLoadElectricity_kW"])) / MScapacity

    KPIs = {
        "sustainability": round(Sustainability_pct, 1),
        "self_sufficiency": round(total_cost_data["totalSelfSufficiency_fr"] * 100, 1),
        "normalized netload": round(netload_pct, 1),
    }
    return KPIs
