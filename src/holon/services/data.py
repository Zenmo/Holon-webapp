import json
from pathlib import Path
from typing import Any

import numpy as np

from holon.services.cloudclient.output import AnyLogicOutput
from pipit.settings import get_env_bool


class Results:
    def __init__(
        self,
        cc_payload: dict,
        request,
        anylogic_outcomes: AnyLogicOutput,
        inter_upscaling_outcomes: dict,
        nat_upscaling_outcomes: dict,
        cost_outcome: float,
        cost_benefit_overview: dict,
        cost_benefit_detail: dict,
        anylogic_outputs: dict[str, Any],
        datamodel_query_results: dict[int, Any],
        error: Exception = None,
    ) -> None:
        self.cc_payload = cc_payload
        self.request = request
        self.anylogic_outcomes = anylogic_outcomes
        self.inter_upscaling_outcomes = inter_upscaling_outcomes
        self.nat_upscaling_outcomes = nat_upscaling_outcomes
        self.cost_outcome = cost_outcome
        self.cost_benefit_overview = cost_benefit_overview
        self.cost_benefit_detail = cost_benefit_detail
        self.anylogic_outputs = anylogic_outputs
        self.datamodel_query_results = datamodel_query_results
        self.error = error

    @property
    def anylogic_outcomes(self):
        return self._anylogic_outcomes

    @anylogic_outcomes.setter
    def anylogic_outcomes(self, anylogic_outcomes: AnyLogicOutput):
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
            "anylogic_outputs": self.anylogic_outputs,
            "datamodel_query_results": self.datamodel_query_results,
            "error": repr(self.error) if self.error is not None else None,
        }
        if self.__include_scenario():
            result["scenario"] = self.cc_payload

        return result

    def __include_scenario(self):
        """Only include modified scenario if env variable is set"""
        return get_env_bool("RETURN_SCENARIO", False)


def calculate_holon_kpis(anylogic_outcomes: AnyLogicOutput) -> dict:
    def get_key_over_all_results(key):
        return anylogic_outcomes.get_key_over_all_results(key)

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
            # assumption is that all imported hydrogen is grey
            + get_key_over_all_results("totalHydrogenImport_MWh")
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
