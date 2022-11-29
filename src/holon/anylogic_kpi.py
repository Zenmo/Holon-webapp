import numpy as np


def calculate_holon_kpis(total_cost_data: dict, etm_data: dict) -> dict:

    import_curve_MWh = np.array(
        list(total_cost_data["SystemHourlyElectricityImport_MWh"].values())[:8760]
    )

    CO2_electricity_kg = np.inner(etm_data["CO2_curve"], import_curve_MWh)

    # TODO: now hard coded; replace by a query
    etm_data.update({"CO2diesel_kgpMWh": 323, "CO2methane_kgpMWh": 1890 / 9})

    CO2totaal = (
        CO2_electricity_kg
        + total_cost_data["totalDieselImport_MWh"] * etm_data["CO2diesel_kgpMWh"]
        + total_cost_data["totalMethaneImport_MWh"] * etm_data["CO2methane_kgpMWh"]
    )

    netElectricityImport_MWh = (
        total_cost_data["totalElectricityImport_MWh"]
        - total_cost_data["totalElectricityExport_MWh"]
    )

    # TODO: Hardcoded; Grid electricity is considered 100% unsustainable at this CO2 intensity level
    CO2intensityUnsustainable_kgpMWh = 389

    UnsustainableImportedElectricity_MWh = netElectricityImport_MWh * (
        CO2_electricity_kg / netElectricityImport_MWh / CO2intensityUnsustainable_kgpMWh
    )

    Sustainability_pct = 100 * (
        1
        - (
            total_cost_data["totalDieselImport_MWh"]
            + total_cost_data["totalMethaneImport_MWh"]
            + UnsustainableImportedElectricity_MWh / 1000  # TODO: This should be fixed somehow
        )
        / total_cost_data["TotalEnergyUsed_MWh"]
    )
    # print(UnsustainableImportedElectricity_MWh)
    # print(CO2_electricity_kg)

    # TODO: Hardcoded net capacity
    netOverload_pct = (max(0, total_cost_data["MSLSPeakLoadElectricity_kW"] - 1200)) / 1200

    KPIs = {
        "sustainability": round(Sustainability_pct, 1),
        "self_sufficiency": round(total_cost_data["totalSelfSufficiency_fr"] * 100, 1),
        "netload": round(netOverload_pct, 1),
    }
    return KPIs
