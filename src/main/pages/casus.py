from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail_headless_preview.models import HeadlessPreviewMixin

from .base import BasePage
from .base_storyline_challengemode import BaseStorylineChallengeMode


class CasusPage(HeadlessPreviewMixin, BasePage):
    parent_page_types = ["main.CasusOverviewPage"]
    subpage_types = [
        "main.StorylinePage",
        "main.ChallengeModePage",
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusPageSerializer"

    class Meta:
        verbose_name = _("CasusPage")
