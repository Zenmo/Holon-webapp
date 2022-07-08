from holon.models import UpdateRegister
from holon.serializers import UpdateRegisterSerializer
from rest_framework import viewsets, mixins

# ViewSets define the view behavior.
class UpdateRegisterViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = UpdateRegister.objects.all()
    serializer_class = UpdateRegisterSerializer
