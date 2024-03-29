from django.utils.translation import gettext_lazy as _
from .base_storyline_challengemode import BaseStorylineChallengeMode


class StorylinePage(BaseStorylineChallengeMode):
    parent_page_types = ["main.StorylineOverviewPage", "main.CasusPage"]

    extra_panels = BaseStorylineChallengeMode.extra_panels + []
    content_panels = BaseStorylineChallengeMode.content_panels + []

    serializer_class = "main.pages.StorylinePageSerializer"

    class Meta:
        verbose_name = _("Storyline")
