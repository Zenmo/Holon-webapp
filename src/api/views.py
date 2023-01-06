from rest_framework import viewsets

from api.models import InteractiveInput
from api.serializers import InteractiveInputSerializer


class InteractiveInputViewset(viewsets.ReadOnlyModelViewSet):
    queryset = InteractiveInput.objects.all()
    serializer_class = InteractiveInputSerializer
