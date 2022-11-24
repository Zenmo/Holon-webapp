from rest_framework.response import Response
from rest_framework import generics, status

from cloudclient.experiments import prepare_scenario_as_experiment, AnyLogicExperiment


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

            data["scenario"] = {"etm_scenario_id": 1647734, "model_name": "technical_debt"}
            pepe.preprocessor = data

            # holon_results = {}
            scenario: AnyLogicExperiment = prepare_scenario_as_experiment(
                data.get("scenario")["model_name"]
            )
            pepe.preprocessor.holon_payload = scenario.client.datamodel_payload
            pepe.preprocessor.apply_interactive_to_payload()

            holon_results = scenario.runScenario()
            holon_results = {key: value for key, value in holon_results.items() if key in RESULTS}

            pepe.postprocessor = holon_results

            pepe.upscale_to_etm()
            pepe.calculate_costs()

            return Response(
                pepe.postprocessor.results(),
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
