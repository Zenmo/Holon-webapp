from .base_page import BasePageFactory
from ..pages.challengemode import ChallengeModePage


class ChallengeModePageFactory(BasePageFactory):
    class Meta:
        model = ChallengeModePage
