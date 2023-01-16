from .base_serializer import BasePageSerializer
from . import CasusPage


class CasusPageSerializer(BasePageSerializer):
    class Meta:
        model = CasusPage
        fields = BasePageSerializer.Meta.fields
