from rest_framework.response import Response
from rest_framework import generics, status
from holon.cloudclient.run_cloud_experiments.scripts.run_scenario import run_scenario_endpoint

from holon.serializers import HolonRequestSerializer
from etm_service import retrieve_results, scale_copy_and_send
from holon.economic.im_sorry import calculate_total_costs

from pathlib import Path

ETM_CONFIG_PATH = Path(__file__).resolve().parent / "services"
ETM_CONFIG_FILE_GET_KPIS = "etm_kpis.config"
ETM_CONFIG_FILE_COSTS = "etm_costs.config"
ETM_CONFIG_FILE_SCALING = "etm_scaling.config"
SCENARIO_ID = 1647734
COSTS_SCENARIO_ID = 2166341
SCENARIO_HOLON_NAME = "webdev_cloud_poc"
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
            data = serializer.validated_data
            value = data.get("sliders")[0]["value"]
            holon_results = run_scenario_endpoint(
                data.get("scenario").model_name, format_holon_input(value), RESULTS
            )

            # Upscaling of KPI's to national
            updated_etm_scenario_id = scale_copy_and_send(
                data.get("scenario").etm_scenario_id,
                holon_results[0],  # TODO: + sliders holon (merged dict)
                ETM_CONFIG_PATH,
                ETM_CONFIG_FILE_SCALING,
            )
            etm_results = retrieve_results(
                updated_etm_scenario_id, ETM_CONFIG_PATH, ETM_CONFIG_FILE_GET_KPIS
            )

            # Economic - total costs
            # NOTE: inputs for the costs are queried from a different 'standard' scenario and
            # independent of any HOLON influence. These are an excellent candidate for caching.
            etm_costs = retrieve_results(COSTS_SCENARIO_ID, ETM_CONFIG_PATH, ETM_CONFIG_FILE_COSTS)
            # TODO: hook into data model instead of having this empty list
            holon_grid_connection_inputs = []
            total_costs = calculate_total_costs(
                etm_costs, holon_grid_connection_inputs, holon_results
            )

            return Response(
                {
                    "message": "kpis",
                    "etm_result": etm_results,
                    "holon_result": holon_results,
                    "total_costs": total_costs,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
