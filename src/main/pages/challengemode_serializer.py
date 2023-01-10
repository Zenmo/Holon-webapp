from .base_serializer import BasePageSerializer
from .storyline_serializer import (
    StorylinePageSerializer,
    StorylinePageRoleTypeSerializer,
    StorylinePageInformationTypeSerializer,
)

from . import ChallengeModePage


class ChallengeModePageSerializer(BasePageSerializer):
    roles = StorylinePageRoleTypeSerializer(many=True)
    information_types = StorylinePageInformationTypeSerializer(many=True)

    class Meta:
        model = ChallengeModePage
        fields = StorylinePageSerializer.Meta.fields
