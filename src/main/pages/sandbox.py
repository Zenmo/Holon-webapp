from django.utils.translation import gettext_lazy as _
from wagtail.fields import StreamField
from wagtail.admin.panels import MultiFieldPanel, FieldPanel

from .base_storyline_challengemode import BaseStorylineChallengeMode
from ..blocks import FeedbackModal


class SandboxPage(BaseStorylineChallengeMode):
    feedbackmodals = StreamField(
        [
            ("feedbackmodals", FeedbackModal()),
        ],
        block_counts={},
        use_json_field=True,
        null=True,
        blank=True,
    )

    parent_page_types = ["main.StorylineOverviewPage", "main.CasusPage"]

    extra_panels = BaseStorylineChallengeMode.extra_panels + []
    content_panels = BaseStorylineChallengeMode.content_panels + [
        FieldPanel("feedbackmodals"),
    ]

    serializer_class = "main.pages.ChallengeModePageSerializer"

    class Meta:
        verbose_name = _("Sandbox")
