from holon.models import Scenario


class Results:
    # TODO:
    # accept etm data
    # do something on the datamodel (grid node something)
    # check this with the model bois

    def __init__(
        self,
        scenario: Scenario,
        anylogic_outcomes: dict,
        inter_upscaling_outcomes: dict,
        nat_upscaling_outcomes: dict,
        cost_outcome: float,
        costbenefit_outcomes: dict,
    ) -> None:
        self.anylogic_outcomes = anylogic_outcomes
        self.inter_upscaling_outcomes = inter_upscaling_outcomes
        self.nat_upscaling_outcomes = nat_upscaling_outcomes
        self.cost_outcome = cost_outcome
        self.costbenefit_outcomes = costbenefit_outcomes

    @property
    def anylogic_outcomes(self):
        return self._anylogic_outcomes

    @anylogic_outcomes.setter
    def anylogic_outcomes(self, anylogic_outcomes: dict):
        # TODO should actually be based on calculation
        # self._anylogic_outcomes = calculate_holon_kpis(anylogic_outcomes)

        self._anylogic_outcomes = {"sustainability": 42, "self_sufficiency": 42, "netload": 42}

    def to_dict(self):
        return {
            "dashboard_results": {
                "local": {**self.anylogic_outcomes, "cost": self.cost_outcome},
                "intermediate": self.inter_upscaling_outcomes,
                "national": self.nat_upscaling_outcomes,
            },
            "cost_benefit_results": {
                "overview": self.costbenefit_outcomes["overview"],
                "detail": self.costbenefit_outcomes["detail"],
            },
        }


### This shite comes from holon.anylogic_kpi, bah

import numpy as np


def determine_share_of_renewables(etm_data: dict) -> np.ndarray:
    # TODO: move this to the ETsource repo as a gquery

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


def calculate_holon_kpis(total_cost_data: dict, etm_data: dict, gridnode_config: dict) -> dict:
    import_curve_MWh = np.array(
        list(total_cost_data["SystemHourlyElectricityImport_MWh"].values())[:8760]
    )

    total_CO2_imported_electricity_kg = np.inner(etm_data["CO2_curve"], import_curve_MWh)

    # TODO: now hard coded; replace by a query
    etm_data.update({"CO2diesel_kgpMWh": 323, "CO2methane_kgpMWh": 1890 / 9})

    CO2totaal = (
        total_CO2_imported_electricity_kg
        + total_cost_data["totalMethaneImport_MWh"] * etm_data["CO2methane_kgpMWh"]
        + total_cost_data["totalDieselImport_MWh"] * etm_data["CO2diesel_kgpMWh"]
    )

    # TODO: Hardcoded; Grid electricity is considered 100% unsustainable at this CO2 intensity level
    share_of_renewables = determine_share_of_renewables(etm_data=etm_data)

    UnsustainableImportedElectricity_MWh = np.inner(1 - share_of_renewables, import_curve_MWh)

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

    MSLS_capacity_kW = sum([gn["capacity_kw"] for gn in gridnode_config if gn["type"] == "MSLS"])
    netOverload_pct = (
        max(0, total_cost_data["MSLSPeakLoadElectricity_kW"]) / MSLS_capacity_kW
    ) * 100

    KPIs = {
        "sustainability": round(Sustainability_pct, 1),
        "self_sufficiency": round(total_cost_data["totalSelfSufficiency_fr"] * 100, 1),
        "netload": round(netOverload_pct, 1),
    }

    return KPIs
