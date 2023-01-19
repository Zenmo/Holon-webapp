from .base_serializer import BasePageSerializer
from . import CasusOverviewPage


class CasusOverviewPageSerializer(BasePageSerializer):
    class Meta:
        model = CasusOverviewPage
        fields = BasePageSerializer.Meta.fields
