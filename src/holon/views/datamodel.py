from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.request import Request

from holon.serializers import ActorSerializer, DatamodelRequestSerializer
from holon.models import Actor
from rest_framework.renderers import JSONRenderer


class DatamodelService(generics.RetrieveAPIView):
    serializer_class = DatamodelRequestSerializer

    def get(self, request: Request):
        serializer = DatamodelRequestSerializer(data=request.data)

        if serializer.is_valid():
            actor = Actor.objects.get(id=serializer.data["id"])
            serializer = ActorSerializer(actor)
            return Response(
                JSONRenderer().render(serializer.data),
                status=status.HTTP_200_OK,
            )

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
