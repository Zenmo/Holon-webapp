from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from django.db import models
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, StreamFieldPanel
from wagtail.contrib.table_block.blocks import TableBlock
from wagtail.core.blocks import StreamBlock

from .base import BasePage


new_table_options = {"renderer": "text", "startRows": 3, "editor": "text"}


class ContentBlocks(StreamBlock):
    table_block = TableBlock(table_options=new_table_options)


class WikiPage(HeadlessPreviewMixin, BasePage):
    introduction = models.CharField(
        max_length=500, help_text=_("Text used in the highlight on other pages")
    )

    rich_text = RichTextField(blank=True, null=True, verbose_name=_("Rich text"))

    table = StreamField(
        ContentBlocks(),
        blank=True,
        null=True,
        help_text=_("Add extra columns and rows with right mouse click"),
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("introduction"),
        FieldPanel("rich_text"),
        FieldPanel("table"),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.WikiPageSerializer"

    class Meta:
        verbose_name = _("Wiki")
