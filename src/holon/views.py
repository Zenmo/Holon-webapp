from django.shortcuts import get_object_or_404, render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from api.models.scenario import Scenario

from holon.serializers import HolonRequestSerializer

# Create your views here.


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):
        scenario = get_object_or_404(Scenario, pk=request.data.get("scenario").get("id"))
        holon_request = {
            "scenario": scenario,
            "sliders": None,
        }

        return Response(holon_request)
