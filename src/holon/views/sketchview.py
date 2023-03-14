from rest_framework import request, status
from rest_framework.response import Response
from holon.models import Scenario

import etm_service


class SuperSerializer:
    pass


class CloudClient:
    pass

    def run():
        pass


class DashboardResults:
    @property.setter
    def costs(self, value):
        def parse():
            pass

        self._costs = parse(value)

    def as_json(self):
        return self.results


def Endpoint(request):
    serializer = SuperSerializer(data=request.data)

    if serializer.is_valid():
        scenario_id, interactive_inputs = serializer.validated_data
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    datamodel = Scenario.objects.get(id=scenario_id)

    # RULE (bewerking op datamodel a.d.h.v. basisconfig en interactieve inputs)
    datamodel_new = datamodel.apply_rules(scenario_id, interactive_inputs)

    # ANYLOGIC
    # fetches config and datamodel based on id
    cloudclient = CloudClient()
    anylogic_results = cloudclient.run(
        scenario_id=scenario_id,
        datamodel_id=datamodel_new.id,
    )

    # ------- ASYNC ----- #
    # COST ETM
    cost_results, cost_queries = etm_service.retrieve_results()

    # UPSCALING ETM - national
    upscaling_results = etm_service.retrieve_results()

    # UPSCALING ETM - intermediate
    upscaling_results = etm_service.retrieve_results()

    # COST&BENIFIT
    cost_benefit_result_json = etm_service.retrieve_results()
    # ------- ASYNC ----- #

    dashboard_results = DashboardResults(
        costs=cost_results, anylogic=anylogic_results, upscaling=upscaling_results
    )

    return {"dashboard": dashboard_results.as_json(), "costbenifit": cost_benefit_result_json}


cost_benefit_result_json = {"overview": {"zoals_dummydata"}, "detail": {"zoals_dummydata"}}

cost_results = {
    "local": {"costs": float},
}

upscaling_results = {
    "intermediate": {
        "costs": float,
        "netload": float,
        "sustainability": float,
        "self_sufficiency": float,
    },
    "national": {
        "costs": float,
        "netload": float,
        "sustainability": float,
        "self_sufficiency": float,
    },
}


target_result = {
    "national": {
        "netload": 102.4,
        "costs": 50500000000.0,
        "sustainability": 21.3,
        "self_sufficiency": 27.6,
    },
    "intermediate": {
        "costs": 1527000.0,
        "sustainability": 16.6,
        "self_sufficiency": 5.0,
        "netload": 50.0,
    },
    "local": {"costs": 1527000.0, "sustainability": 16.6, "self_sufficiency": 5.0, "netload": 50.0},
}
