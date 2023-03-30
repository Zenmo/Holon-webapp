import json
from pathlib import Path

import numpy as np

from holon.models import Scenario
from holon.serializers import ScenarioSerializer


class Results:
    # TODO:
    # accept etm data
    # do something on the datamodel (grid node something)
    # check this with the model bois

    def __init__(
        self,
        scenario: Scenario,
        request,
        anylogic_outcomes: dict,
        inter_upscaling_outcomes: dict,
        nat_upscaling_outcomes: dict,
        cost_outcome: float,
        cost_benefit_overview: dict,
        cost_benefit_detail: dict,
    ) -> None:
        self.anylogic_outcomes = anylogic_outcomes
        self.inter_upscaling_outcomes = inter_upscaling_outcomes
        self.nat_upscaling_outcomes = nat_upscaling_outcomes
        self.cost_outcome = cost_outcome
        self.cost_benefit_overview = cost_benefit_overview
        self.cost_benefit_detail = cost_benefit_detail
        self.scenario = scenario
        self.request = request

    @property
    def anylogic_outcomes(self):
        return self._anylogic_outcomes

    @anylogic_outcomes.setter
    def anylogic_outcomes(self, anylogic_outcomes: dict):
        self._anylogic_outcomes = calculate_holon_kpis(anylogic_outcomes)

    def to_dict(self):
        result = {
            "dashboard_results": {
                "local": {**self.anylogic_outcomes, "costs": self.cost_outcome},
                "intermediate": self.inter_upscaling_outcomes,
                "national": self.nat_upscaling_outcomes,
            },
            "cost_benefit_results": {
                "overview": self.cost_benefit_overview,
                "detail": self.cost_benefit_detail,
            },
        }
        if self.__include_scenario():
            result["scenario"] = ScenarioSerializer(self.scenario).data

        return result

    def __include_scenario(self):
        """Only include modified scenario if request is done locally or on acceptatie"""
        uri = self.request.build_absolute_uri()
        return "localhost" in uri or "acceptatie" in uri


def calculate_holon_kpis(anylogic_outcomes: dict) -> dict:
    def get_key_over_all_results(key: str) -> float:
        value = 1
        for subdict in anylogic_outcomes.values():
            try:
                value = subdict[0][key]  # TODO why is this like this? Seems like jackson artefact
            except KeyError:
                pass
        return value

    import_curve_MWh = np.array(
        list(get_key_over_all_results("SystemHourlyElectricityImport_MWh").values())[:8760]
    )

    jsons = Path(__file__).absolute().parent / "jsons"

    with open(jsons / "share_of_renewable_electricity.json", "r") as _infile:
        share_of_renewables = np.array(json.load(_infile))

    UnsustainableImportedElectricity_MWh = np.inner(1 - share_of_renewables, import_curve_MWh)

    Sustainability_pct = 100 * (
        1
        - (
            get_key_over_all_results("totalDieselImport_MWh")
            + get_key_over_all_results("totalMethaneImport_MWh")
            + UnsustainableImportedElectricity_MWh
        )
        / get_key_over_all_results("TotalEnergyUsed_MWh")
    )
    Sustainability_pct = min(100, Sustainability_pct)

    netOverload_pct = get_key_over_all_results("netOverload_pct")
    if netOverload_pct == 1:
        netload_mv_pos_pct = (
            (get_key_over_all_results("MSLSnodePeakPositiveLoadElectricity_kW"))
            / get_key_over_all_results("cumulativeCapacityLS")
        ) * 100

        netload_mv_neg_pct = (
            (get_key_over_all_results("MSLSnodePeakNegativeLoadElectricity_kW"))
            / get_key_over_all_results("cumulativeCapacityLS")
        ) * 100

        netOverload_pct = max(abs(netload_mv_pos_pct), abs(netload_mv_neg_pct))

    KPIs = {
        "sustainability": round(Sustainability_pct, 1),
        "self_sufficiency": round(get_key_over_all_results("totalSelfSufficiency_fr") * 100, 1),
        "netload": round(netOverload_pct, 1),
    }
    return KPIs
