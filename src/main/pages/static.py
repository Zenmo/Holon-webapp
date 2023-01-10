from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField

from .base import BasePage
from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock


class StaticPage(HeadlessPreviewMixin, BasePage):
    content = StreamField(
        [
            ("title_block", TitleBlock()),
            ("header_full_image_block", HeaderFullImageBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("paragraph_block", ParagraphBlock()),
            ("card_block", CardsBlock()),
        ],
        verbose_name="Page body",
        blank=True,
        null=True,
        use_json_field=True,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("content"),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.StaticPageSerializer"

    class Meta:
        verbose_name = _("Static")
