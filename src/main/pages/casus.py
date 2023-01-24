from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms


from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.snippets.models import register_snippet
from wagtail.contrib.table_block.blocks import TableBlock
from wagtail.fields import StreamField

from modelcluster.fields import ParentalManyToManyField

from .base_storyline_challengemode import COLOR_CHOICES
from .base import BasePage
from .base_storyline_challengemode import StorylinePageFilter
from .bestpractice import BestPracticePage
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


class CasusPage(HeadlessPreviewMixin, BasePage):
    casus_filter = ParentalManyToManyField(CasusFilter)

    thumbnail = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    @property
    def thumbnail_rendition_url(self):
        url = None
        if self.thumbnail is not None:
            url = self.thumbnail.get_rendition("fill-750x380|jpegquality-80")
        return url

    description = models.TextField(null=True, blank=True, help_text="Description of the casus")

    card_color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        default="card__bg-blue",
        blank=True,
        help_text="Background color in the overview pages",
    )

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

    content_panels = BasePage.content_panels + [
        FieldPanel("thumbnail"),
        FieldPanel("description"),
        FieldPanel("card_color"),
        FieldPanel("casus_filter"),
        FieldPanel("content"),
    ]

    class Meta:
        verbose_name = _("CasusPage")
