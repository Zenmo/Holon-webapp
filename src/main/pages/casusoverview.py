from django.utils.translation import gettext_lazy as _
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.fields import StreamField
from wagtail.contrib.table_block.blocks import TableBlock

from .base import BasePage, new_table_options
from .base_overview import BaseOverview

from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock


class CasusOverviewPage(BaseOverview):
    content = StreamField(
        [
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
        ],
        verbose_name="Page body",
        blank=True,
        null=True,
        use_json_field=True,
    )
    content_panels = BaseOverview.content_panels + [FieldPanel("content")]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusOverviewPageSerializer"

    subpage_types = ["main.CasusPage"]

    class Meta:
        verbose_name = _("CasusOverview")
