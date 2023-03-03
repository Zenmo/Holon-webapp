from cloudclient.experiments import AnyLogicExperiment, prepare_scenario_as_experiment
from rest_framework import generics, status
from rest_framework.response import Response

from holon.models import rule_mapping

from .models.pepe import Pepe
from .serializers import HolonRequestSerializer

RESULTS = [
    "SystemHourlyElectricityImport_MWh",
    "APIOutputTotalCostData",
    "totalEHGVHourlyChargingProfile_kWh",
]


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        if serializer.is_valid():

            scenario = rule_mapping.get_scenario_and_apply_rules(
                serializer.scenario, serializer.interactive_elements
            )

            pepe = Pepe()

            data = serializer.validated_data

            # TODO: this is hardcoded; should be a result from the DB::scenario linked to the storyline
            # NOTE: other things (like balancer in ETM_service) are now also hardcoded to work with
            # this specific scenario, please notify @noracto when you change this. Scenario = KEV
            data["scenario"] = {"etm_scenario_id": 2175158, "model_name": "technical_debt"}
            pepe.preprocessor = data

            # holon_results = {}
            scenario: AnyLogicExperiment = prepare_scenario_as_experiment(
                data.get("scenario")["model_name"]
            )
            pepe.preprocessor.holon_payload = scenario.client.datamodel_payload
            pepe.preprocessor.apply_interactive_to_payload()

            holon_results = scenario.runScenario()

            temp_holon_results = {
                key: value for key, value in holon_results.items() if key in RESULTS
            }
            temp_holon_results.update(
                {
                    key: value
                    for key, value in holon_results["APIOutputTotalCostData"][0].items()
                    if key in RESULTS
                }
            )

            holon_results = temp_holon_results

            pepe.postprocessor = (holon_results, pepe.preprocessor.holon_payload)

            pepe.upscale_to_etm()
            pepe.calculate_costs()

            results = pepe.postprocessor.results()

            print(results)
            return Response(
                results,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HolonV2Service(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        try:
            if serializer.is_valid():
                data = serializer.validated_data

                # TODO add try catch with 422 response if failed
                scenario = rule_mapping.get_scenario_and_apply_rules(
                    data["scenario"].id, data["interactive_elements"]
                )

                # TODO serialize and send to anylogic

                # Delete duplicated scenario
                scenario.delete()

                return Response(
                    "success",
                    status=status.HTTP_200_OK,
                )

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(f"Something went wrong: {e}", status=status.HTTP_400_BAD_REQUEST)
            
