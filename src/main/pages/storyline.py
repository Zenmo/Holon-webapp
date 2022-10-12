from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.core.fields import StreamField

from .base import BasePage
from ..blocks import TextAndMediaBlock


class StorylinePage(HeadlessPreviewMixin, BasePage):
    body = StreamField(
        [("text_and_media", TextAndMediaBlock())], null=True, blank=True, use_json_field=False
    )

    content_panels = BasePage.content_panels + [FieldPanel("body")]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.StorylinePageSerializer"

    class Meta:
        verbose_name = _("Storyline")
