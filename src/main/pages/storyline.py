from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail import blocks
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from wagtail.api import APIField


from .base import BasePage
from ..blocks import TextAndMediaBlock, StorylineSectionBlock


class StorylinePage(HeadlessPreviewMixin, BasePage):
    thumbnail = models.ImageField(
        null=True,
        blank=True,
    )
    description = models.TextField(null=True, blank=True, help_text="Description of the storyline")

    scenario = models.ForeignKey(
        "api.Scenario",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    storyline = StreamField(
        [
            ("text_and_media", TextAndMediaBlock()),
            ("section", StorylineSectionBlock()),
        ],
        block_counts={"text_and_media": {"min_num": 1, "max_num": 1}, "section": {"min_num": 1}},
        use_json_field=True,
    )

    serializer_class = "main.pages.StorylinePageSerializer"

    content_panels = BasePage.content_panels + [
        FieldPanel("thumbnail"),
        FieldPanel("description"),
        FieldPanel("scenario"),
        FieldPanel("storyline"),
    ]

    parent_page_types = ["main.StorylineOverviewPage"]

    class Meta:
        verbose_name = _("Storyline")
