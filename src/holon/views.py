from rest_framework.response import Response
from rest_framework import generics, status
from cloudclient.scripts.run_scenario import run_scenario_endpoint

from .serializers import HolonRequestSerializer
from .models.pepe import Pepe

RESULTS = [
    "totalElectricityImported_MWh",
    "totalElectricityExported_MWh",
    "APIOutputTotalCostData",
    "totalEHGVHourlyChargingProfile_kWh",
]


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        if serializer.is_valid():
            pepe = Pepe()

            data = serializer.validated_data
            pepe.preprocessor.set(data)

            # holon_results = {}
            holon_results = run_scenario_endpoint(
                data.get("scenario").model_name, pepe.preprocessor.holon_payload.to_json(), RESULTS
            )

            pepe.postprocessor.set(holon_results)

            pepe.upscale_to_etm()
            pepe.calculate_costs()

            return Response(
                pepe.postprocessor.results(),
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
