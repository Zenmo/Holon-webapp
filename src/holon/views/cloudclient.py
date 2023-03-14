from rest_framework import generics, status
from rest_framework.response import Response

from holon.serializers.cloudclient import CloudclientRequestSerializer


class CloudclientService(generics.CreateAPIView):
    serializer_class = CloudclientRequestSerializer

    def post(self, request):
        serializer = CloudclientRequestSerializer(data=request.data)
        try:
            if serializer.is_valid():
                data = serializer.validated_data

                """
                IMPLEMENT SAME CLOUDCLIENT LOGIC HERE!
                """
                return Response

            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(f"Something went wrong: {e}", status=status.HTTP_400_BAD_REQUEST)
