from .base_serializer import BasePageSerializer
from . import StorylineOverviewPage


class StorylineOverviewPageSerializer(BasePageSerializer):
    class Meta:
        model = StorylineOverviewPage
        fields = BasePageSerializer.Meta.fields

