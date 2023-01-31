from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from django.db import models
from wagtail.fields import StreamField, RichTextField
from wagtail.contrib.table_block.blocks import TableBlock
from wagtail.core.blocks import StreamBlock
from main.blocks.paragraph import ParagraphBlock

from .base import BasePage


new_table_options = {"renderer": "text", "startRows": 3, "editor": "text"}


class ContentBlocks(StreamBlock):
    table_block = TableBlock(table_options=new_table_options)


class WikiPage(HeadlessPreviewMixin, BasePage):
    introduction = models.CharField(
        max_length=500, help_text=_("Text used in the highlight on other pages")
    )

    content = StreamField(
        [
            ("paragraph_block", ParagraphBlock()),
            (
                "table_block",
                TableBlock(
                    table_options=new_table_options,
                    required=True,
                    help_text=("Add extra columns and rows with right mouse click"),
                ),
            ),
        ],
        verbose_name="Page body",
        blank=True,
        null=True,
        use_json_field=True,
    )

    content_panels = BasePage.content_panels + [FieldPanel("introduction"), FieldPanel("content")]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.WikiPageSerializer"

    class Meta:
        verbose_name = _("Wiki")
