from .base_serializer import BasePageSerializer
from .storyline_serializer import (
    StorylinePageSerializer,
    StorylinePageRoleTypeSerializer,
    StorylinePageInformationTypeSerializer,
)

from . import ChallengeModePage


class ChallengeModePageSerializer(StorylinePageSerializer):
    class Meta:
        model = ChallengeModePage
        fields = StorylinePageSerializer.Meta.fields + ["feedbackmodals"]
