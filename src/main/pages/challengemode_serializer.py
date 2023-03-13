from .storyline_serializer import StorylinePageSerializer
from . import ChallengeModePage


class ChallengeModePageSerializer(StorylinePageSerializer):
    class Meta:
        model = ChallengeModePage
        fields = StorylinePageSerializer.Meta.fields + ["feedbackmodals"]
