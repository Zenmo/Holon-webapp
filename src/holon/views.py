from rest_framework.response import Response
from rest_framework import generics, status

from holon.serializers import HolonRequestSerializer
from etm_service import retrieve_results

from pathlib import Path

ETM_CONFIG_PATH = Path(__file__).resolve().parent / "services"
ETM_CONFIG_FILE = "etm.config"
SCENARIO_ID = 1647734


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.validated_data)
            etm_results = retrieve_results(SCENARIO_ID, ETM_CONFIG_PATH, ETM_CONFIG_FILE)
            return Response(
                {"message": "kpis", "etm_result": etm_results}, status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
