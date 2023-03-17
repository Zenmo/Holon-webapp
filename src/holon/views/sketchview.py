from rest_framework import request, status
from rest_framework.response import Response
from holon.models import Scenario, InteractiveElement
from typing import Iterable, Tuple, Dict
import etm_service
from holon.services.cloudclient import CloudClient


### DUMMY SECTION


def apply_rules(
    scenario_template: Scenario, interactive_inputs: Iterable[InteractiveElement]
) -> Scenario:
    """dummy function that just returns the same scenario. Replace by actual apply_rules"""
    return Scenario


class SuperSerializer:
    pass


class DashboardResults:
    @property.setter
    def costs(self, value):
        def parse():
            pass

        self._costs = parse(value)

    def as_json(self):
        return self.results


class Cost:
    def __init__(self, scenario_copy: Scenario) -> None:
        scenario = scenario_copy

    def run(self) -> Tuple[dict, dict]:
        # some combination of various upscale and manipulations
        # etm_service.retrieve_results()
        return


class Upscaling:
    def __init__(self, scenario_copy: Scenario) -> None:
        scenario = scenario_copy

    def run(self) -> Tuple[dict, dict]:
        # some combination of various upscale and manipulations
        # etm_service.retrieve_results()
        return


class CostBenifit:
    def __init__(self, scenario_copy: Scenario) -> None:
        scenario = scenario_copy

    def run(self) -> Tuple[dict, dict]:
        # some combination of various upscale and manipulations
        # etm_service.retrieve_results()
        return


### DUMMY SECTION


def Endpoint(request):
    serializer = SuperSerializer(data=request.data)

    if serializer.is_valid():
        scenario_id, interactive_inputs = serializer.validated_data
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    scenario_template = Scenario.objects.get(id=scenario_id)

    # RULE (bewerking op datamodel a.d.h.v. basisconfig en interactieve inputs)
    scenario_copy = apply_rules(scenario_template, interactive_inputs)

    # ANYLOGIC
    # fetches config and datamodel based on id
    cloudclient = CloudClient()
    anylogic_results = cloudclient.run(scenario=scenario_copy)

    # ------- ASYNC ----- #
    # COST ETM
    cost_results, cost_queries = Cost(scenario_copy=scenario_copy).run()

    # UPSCALING ETM
    upscaling_results = cost_results, cost_queries = Cost(scenario_copy=scenario_copy).run()

    # COST&BENIFIT
    cost_benefit_result_json = Cost(scenario_copy=scenario_copy).run()
    # ------- ASYNC ----- #

    dashboard_results = DashboardResults(
        costs=cost_results, anylogic=anylogic_results, upscaling=upscaling_results
    )
    dashboard_result_json = dashboard_results.as_json()

    from .dummies import costbenefit_result_json, dashboard_result_json

    return {"dashboard": dashboard_result_json, "costbenifit": costbenefit_result_json}
