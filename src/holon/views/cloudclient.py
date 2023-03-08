from rest_framework import generics

from holon.models import Scenario
from holon.serializers.cloudclientconfig import ScenarioAnylogicConfigSerializer


class CloudclientService(generics.RetrieveAPIView):
    serializer_class = ScenarioAnylogicConfigSerializer

    queryset = (
        Scenario.objects.prefetch_related("anylogic_config")
        .prefetch_related("anylogic_config__anylogic_cloud_input")
        .prefetch_related("anylogic_config__anylogic_cloud_output")
        .all()
    )
