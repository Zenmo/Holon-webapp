from rest_framework.response import Response
from rest_framework import generics, status

from holon.serializers import HolonRequestSerializer


class HolonService(generics.CreateAPIView):
    serializer_class = HolonRequestSerializer

    def post(self, request):

        serializer = HolonRequestSerializer(data=request.data)

        if serializer.is_valid():
            print(serializer.validated_data)
            return Response({"message": "kpis"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
