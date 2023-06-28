from rest_framework.views import APIView

from holon.models import Scenario
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class DatamodelService(APIView):
    def get(self, request, pk):
        scenario = get_object_or_404(Scenario, id=pk)
        scenario_aggregate = ScenarioAggregate(scenario)

        return Response(scenario_aggregate.serialize_to_json())
