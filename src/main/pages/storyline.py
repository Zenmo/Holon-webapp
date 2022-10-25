from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms

from modelcluster.fields import ParentalManyToManyField
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.fields import StreamField
from wagtail.snippets.models import register_snippet
from wagtail.api import APIField

from .base import BasePage
from ..blocks import TextAndMediaBlock, StorylineSectionBlock


class StorylinePage(HeadlessPreviewMixin, BasePage):
    """A default Storyline page"""

    thumbnail = models.ImageField(
        null=True,
        blank=False,
    )

    description = models.TextField(null=True, blank=True, help_text="Description of the storyline")

    categories = ParentalManyToManyField("main.StorylinePageCategory", blank=True)

    scenario = models.ForeignKey(
        "api.Scenario",
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    storyline = StreamField(
        [
            ("text_and_media", TextAndMediaBlock()),
            ("section", StorylineSectionBlock()),
        ],
        block_counts={"text_and_media": {"min_num": 1, "max_num": 1}, "section": {"min_num": 1}},
        use_json_field=True,
    )

    serializer_class = "main.pages.StorylinePageSerializer"

    content_panels = BasePage.content_panels + [
        FieldPanel("thumbnail"),
        FieldPanel("description"),
        MultiFieldPanel(
            [FieldPanel("categories", widget=forms.CheckboxSelectMultiple)], heading="Categories"
        ),
        FieldPanel("scenario"),
        FieldPanel("storyline"),
    ]

    parent_page_types = ["main.StorylineOverviewPage"]

    class Meta:
        verbose_name = _("Storyline")


class StorylinePageCategory(models.Model):
    """Categories for Storylines"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(
        verbose_name="slug",
        allow_unicode=True,
        max_length=255,
        help_text="A slug to identify a model by this category",
    )

    panels = [FieldPanel("name"), FieldPanel("slug")]

    class Meta:
        verbose_name = "Storyline Category"
        verbose_name_plural = "Storyline Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


register_snippet(StorylinePageCategory)
