from .base_serializer import BasePageSerializer
from . import BestPracticeOverviewPage


class BestPracticeOverviewPageSerializer(BasePageSerializer):
    class Meta:
        model = BestPracticeOverviewPage
        fields = BasePageSerializer.Meta.fields
