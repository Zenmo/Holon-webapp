from .base_serializer import BasePageSerializer
from . import SandboxPage


class SandboxPageSerializer(BasePageSerializer):
    class Meta:
        model = SandboxPage
        fields = BasePageSerializer.Meta.fields
