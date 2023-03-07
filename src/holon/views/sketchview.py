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


class PostProcessor:
    pass

    def add():
        pass


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

    # UPSCALING ETM
    cost_results, cost_queries = etm_service.retrieve_results()

    # COST&BENIFIT
    cost_results, cost_queries = etm_service.retrieve_results()
    # ------- ASYNC ----- #

    postprocessor = PostProcessor()
    dashboard_results = postprocessor.add(
        costs=cost_results,
    )

    return dashboard_results, cost_benefit_results


cost_results = {
    "national": int,
    "intermediate": int,
    "local": int,
}


target_result = {
    "national": {
        "netload": 102.4,
        "costs": 50500000000.0,
        "sustainability": 21.3,
        "self_sufficiency": 27.6,
    },
    "local": {"costs": 1527000.0, "sustainability": 16.6, "self_sufficiency": 5.0, "netload": 50.0},
}
