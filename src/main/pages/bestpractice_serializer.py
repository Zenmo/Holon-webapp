from .base_serializer import BasePageSerializer
from . import BestPracticePage


class BestPracticePageSerializer(BasePageSerializer):
    class Meta:
        model = BestPracticePage
        fields = BasePageSerializer.Meta.fields

