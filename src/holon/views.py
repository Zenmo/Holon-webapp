from rest_framework.response import Response
from rest_framework import generics, status
from holon.cloudclient.run_cloud_experiments.scripts.run_scenario import run_scenario_endpoint

from holon.serializers import HolonRequestSerializer
from etm_service import retrieve_results

from pathlib import Path

ETM_CONFIG_PATH = Path(__file__).resolve().parent / "services"
ETM_CONFIG_FILE = "etm.config"
SCENARIO_ID = 1647734
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
            print(holon_results)
            etm_results = retrieve_results(
                data.get("scenario").etm_scenario_id, ETM_CONFIG_PATH, ETM_CONFIG_FILE
            )
            return Response(
                {"message": "kpis", "etm_result": etm_results, "holon_result": holon_results},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
