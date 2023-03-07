from rest_framework import generics

from holon.models import Scenario
from holon.serializers import ScenarioSerializer


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
