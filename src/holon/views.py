from rest_framework.response import Response
from rest_framework import generics, status
from cloudclient.scripts.run_scenario import run_scenario_endpoint

from etm_service import retrieve_results, scale_copy_and_send
from holon.economic.im_sorry import calculate_total_costs
from pathlib import Path

from .serializers import HolonRequestSerializer
from .models.pepe import Pepe

ETM_CONFIG_PATH = Path(__file__).resolve().parent / "services"
ETM_CONFIG_FILE_GET_KPIS = "etm_kpis.config"
ETM_CONFIG_FILE_COSTS = "etm_costs.config"
ETM_CONFIG_FILE_SCALING = "etm_scaling.config"
COSTS_SCENARIO_ID = 2166341  # KEV + 1 MW grid battery | ETM sceanrio on beta
RESULTS = ["totalElectricityImported_MWh", "totalElectricityExported_MWh"]


def format_holon_input(value):
    CAPACITY_PER_WINDWILL = 100
    return {
        "P energy assets config JSON": {
            "index": 0,
            "agenttype": "energyAsset",
            "id": "a1",
            "type": "PRODUCTION",
            "type2": "WINDMILL",
            "parent": "b25",
            "capacity_electric_kw": value * CAPACITY_PER_WINDWILL,
            "capacity_heat_kw": 0,
        }
    }


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

            # Upscaling of KPI's to national
            # NOTE: WE COULD MOVE THIS TO PEPE
            updated_etm_scenario_id = scale_copy_and_send(
                data.get("scenario").etm_scenario_id,
                pepe.preprocessor.slider_settings() | pepe.postprocessor.etm_kpi_holon_output(),
                ETM_CONFIG_PATH,
                ETM_CONFIG_FILE_SCALING,
            )
            etm_results = retrieve_results(
                updated_etm_scenario_id, ETM_CONFIG_PATH, ETM_CONFIG_FILE_GET_KPIS
            )

            # Economic - total costs
            # NOTE: WE COULD MOVE THIS TO PEPE
            # NOTE: inputs for the costs are queried from a different 'standard' scenario and
            # independent of any HOLON influence. These are an excellent candidate for caching.
            etm_costs = retrieve_results(COSTS_SCENARIO_ID, ETM_CONFIG_PATH, ETM_CONFIG_FILE_COSTS)

            # TODO: Make sure the right holon results are sent here (as a list, as I used the json
            # output for costs as inspiration)
            total_costs = calculate_total_costs(
                etm_costs,
                pepe.preprocessor.grid_connections,
                pepe.postprocessor.costs_holon_output(),
            )

            return Response(
                {
                    "message": "kpis",
                    "etm_result": etm_results,
                    "holon_result": pepe.postprocessor.holon_kpis(),
                    "total_costs": total_costs,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
