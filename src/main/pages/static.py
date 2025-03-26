from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField
from wagtail.contrib.table_block.blocks import TableBlock

from .base import BasePage
from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock
from ..blocks.next_inlet import NextInletBlock
from ..blocks.row import RowBlock
from ..blocks.step_indicator import StepIndicator

new_table_options = {"renderer": "text", "startRows": 3, "editor": "text"}


class StaticPage(HeadlessPreviewMixin, BasePage):
    content = StreamField(
        [
            ("row_block", RowBlock()),
            ("title_block", TitleBlock()),
            ("header_full_image_block", HeaderFullImageBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("paragraph_block", ParagraphBlock()),
            (
                "table_block",
                TableBlock(
                    table_options=new_table_options,
                    required=True,
                    help_text=("Add extra columns and rows with right mouse click"),
                ),
            ),
            ("card_block", CardsBlock()),
            ("next_inlet_block", NextInletBlock()),
            ("step_indicator", StepIndicator()),
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
