from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField

from .base import BasePage
from ..blocks import TitleBlock, HeroBlock, CardsBlock, TextAndMediaBlock


class HomePage(HeadlessPreviewMixin, BasePage):

    body = StreamField(
        [
            ("title_block", TitleBlock()),
            ("hero_block", HeroBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("card_block", CardsBlock()),
        ],
        verbose_name="Page body",
        blank=True,
        null=True,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("body"),
    ]
    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.HomePageSerializer"

    class Meta:
        verbose_name = _("Home")
