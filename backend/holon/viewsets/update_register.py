from holon.models import UpdateRegister
from holon.serializers import UpdateRegisterSerializer
from rest_framework import viewsets

# ViewSets define the view behavior.
class UpdateRegisterViewSet(viewsets.ModelViewSet):
    queryset = UpdateRegister.objects.all()
    serializer_class = UpdateRegisterSerializer
