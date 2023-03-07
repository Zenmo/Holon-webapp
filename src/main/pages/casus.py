from django.utils.translation import gettext_lazy as _

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.snippets.models import register_snippet
from wagtail.contrib.table_block.blocks import TableBlock
from wagtail.fields import StreamField
from django.db import models

from modelcluster.fields import ParentalManyToManyField, ForeignKey

from holon.models.scenario import Scenario

from .base import BasePage
from .base_card import BaseCard
from .base_storyline_challengemode import StorylinePageFilter

from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock


new_table_options = {"renderer": "text", "startRows": 3, "editor": "text"}


@register_snippet
class CasusFilter(StorylinePageFilter):
    panels = [
        FieldPanel("name"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("CasusFilter")
        verbose_name_plural = _("CasusFilters")
        ordering = ["name"]


class CasusPage(HeadlessPreviewMixin, BaseCard):
    casus_filter = ForeignKey(
        CasusFilter, on_delete=models.DO_NOTHING, related_name="+", null=True, blank=True
    )

    scenario = ForeignKey(
        Scenario, on_delete=models.SET_NULL, related_name="+", null=True, blank=True
    )

    linked_best_practices = ParentalManyToManyField("main.bestpracticepage", blank=True)

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

    parent_page_types = ["main.CasusOverviewPage"]
    subpage_types = ["main.StorylinePage", "main.ChallengeModePage", "main.SandboxPage"]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.CasusPageSerializer"

    content_panels = BaseCard.content_panels + [
        FieldPanel("scenario"),
        FieldPanel("casus_filter"),
        FieldPanel("linked_best_practices"),
        FieldPanel("content"),
    ]

    class Meta:
        verbose_name = _("CasusPage")
