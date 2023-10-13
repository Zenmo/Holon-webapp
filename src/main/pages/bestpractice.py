from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms

from modelcluster.fields import ParentalManyToManyField

from wagtail.admin.panels import FieldPanel
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.fields import StreamField
from wagtail.contrib.table_block.blocks import TableBlock

from .base import BasePage
from .base_card import BaseCard

from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock

from .base import new_table_options


class BestPracticePage(HeadlessPreviewMixin, BaseCard):
    linked_casus = ParentalManyToManyField("main.casuspage", blank=True)

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

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.BestPracticePageSerializer"

    parent_page_types = ["main.BestPracticeOverviewPage"]
    subpage_types = []

    content_panels = BaseCard.content_panels + [FieldPanel("linked_casus"), FieldPanel("content")]

    class Meta:
        verbose_name = _("Best Practice")
        verbose_name_plural = _("Best Practices")
