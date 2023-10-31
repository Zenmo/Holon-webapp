from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField

from .base import BasePage
from ..blocks import HeroBlock, HeaderFullImageBlock


class BaseOverview(HeadlessPreviewMixin, BasePage):
    """A abstract class for the overview pages"""

    hero = StreamField(
        [
            ("hero_block", HeroBlock()),
            ("header_full_image_block", HeaderFullImageBlock()),
        ],
        verbose_name="Page intro (above the storylines)",
        blank=True,
        null=True,
        use_json_field=True,
    )

    extra_panels = BasePage.extra_panels
    content_panels = BasePage.content_panels + [FieldPanel("hero")]

    class Meta:
        abstract = True
