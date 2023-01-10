from .base_serializer import BasePageSerializer
from . import ChallengeModePage


class ChallengeModePageSerializer(BasePageSerializer):
    class Meta:
        model = ChallengeModePage
        fields = BasePageSerializer.Meta.fields

