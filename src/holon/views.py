from rest_framework.response import Response
from rest_framework import generics, status
from cloudclient.scripts.run_scenario import run_scenario_endpoint

from etm_service import retrieve_results, scale_copy_and_send
from holon.economic.im_sorry import calculate_total_costs
from pathlib import Path

from .models import Factor
from .serializers import HolonRequestSerializer

ETM_CONFIG_PATH = Path(__file__).resolve().parent / "services"
ETM_CONFIG_FILE_GET_KPIS = "etm_kpis.config"
ETM_CONFIG_FILE_COSTS = "etm_costs.config"
ETM_CONFIG_FILE_SCALING = "etm_scaling.config"
SCENARIO_ID = 1647734  # unused?
COSTS_SCENARIO_ID = 2166341
SCENARIO_HOLON_NAME = "webdev_cloud_poc"  # unused?
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

    def convert_input_to_assets(self, data):
        converted_assets = []
        factors = Factor.objects.all()
        for factor in factors:
            interactive_input = next(
                (
                    item
                    for item in data
                    if item["interactive_element"].asset_type_id == factor.asset_id
                ),
                None,
            )
            if interactive_input is not None:
                factor.value = (factor.max_value + factor.min_value) * (
                    interactive_input["value"] / 100
                )

            converted_assets.append(factor)

        return converted_assets

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        if serializer.is_valid():
            data = serializer.validated_data

            asset_data = self.convert_input_to_assets(data.get("interactive_elements"))
            value = data.get("interactive_elements")[0]["value"]
            holon_results = {}
            # holon_results = run_scenario_endpoint(
            #     data.get("scenario").model_name, format_holon_input(value), RESULTS
            # )

            # Upscaling of KPI's to national
            # TODO: Make sure the right holon results are sent here (as a dict) - check config for
            # the expected keys
            updated_etm_scenario_id = scale_copy_and_send(
                data.get("scenario").etm_scenario_id,
                holon_results,  # TODO: + sliders holon (merged dict) {e.g. solarpanels: 30}
                ETM_CONFIG_PATH,
                ETM_CONFIG_FILE_SCALING,  # TODO: add slider names if they are known
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
            # TODO: Make sure the right holon results are sent here (as a list, as I used the json
            # output for costs as inspiration)
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
