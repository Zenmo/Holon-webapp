from rest_framework import generics

from holon.models import Scenario
from holon.serializers import ScenarioSerializer, ScenarioV2Serializer
from holon.rule_engine.scenario import ScenarioAggregate
from rest_framework.views import APIView
from rest_framework.response import Response


class DatamodelService(generics.RetrieveAPIView):
    serializer_class = ScenarioSerializer
    queryset = (
        Scenario.objects.prefetch_related("actor_set")
        .prefetch_related("actor_set__contracts")
        .prefetch_related("gridconnection_set")
        .prefetch_related("gridconnection_set__energyasset_set")
        .prefetch_related("gridnode_set")
        .prefetch_related("gridnode_set__energyasset_set")
        .prefetch_related("policy_set")
        .all()
    )


class DatamodelTempService(APIView):
    def get(self, request, pk):
        scenario = Scenario.objects.get(id=pk)
        aggr = ScenarioAggregate(scenario)

        tree = aggr.to_tree()

        data = ScenarioV2Serializer(tree).data

        return Response(data)
