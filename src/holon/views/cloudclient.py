from rest_framework import generics

from holon.models import Scenario
from holon.serializers.cloudclient import ScenarioAnylogicConfigSerializer


class CloudclientService(generics.CreateAPIView):
    pass
