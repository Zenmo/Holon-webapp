from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms
from autoslug import AutoSlugField

from modelcluster.fields import ParentalManyToManyField
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.fields import StreamField
from wagtail.snippets.models import register_snippet
from wagtail.admin.edit_handlers import MultiFieldPanel, FieldPanel
from api.models.scenario import Scenario

from .base import BasePage
from ..blocks import TextAndMediaBlock, StorylineSectionBlock

ICON_CHOICES = (
    ("book", "Book"),
    ("bell", "Bell"),
    ("cog", "Cog"),
    ("folder", "Folder"),
    ("heart", "Heart"),
    ("info", "Info"),
    ("lightning", "Lightning bolt"),
    ("mapmarker", "Map marker"),
    ("rocket", "Rocket"),
    ("star", "Star"),
    ("user", "User"),
)


class StorylinePageFilter(models.Model):
    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from="name")

    icon = models.CharField(
        max_length=20,
        choices=ICON_CHOICES,
        default="green",
        blank=True,
        help_text="Icon shown in storyline overview page",
    )

    class Meta:
        abstract = True


@register_snippet
class StorylinePageRoleType(StorylinePageFilter):
    panels = [
        FieldPanel("name"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Storyline Roletype")
        verbose_name_plural = _("Storyline Rolestypes")
        ordering = ["name"]


@register_snippet
class StorylinePageInformationType(StorylinePageFilter):
    panels = [
        FieldPanel("name"),
        FieldPanel("icon"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Storyline InformationType")
        verbose_name_plural = _("Storyline InformationTypes")
        ordering = ["name"]


class StorylinePage(HeadlessPreviewMixin, BasePage):
    """A default Storyline page"""

    roles = ParentalManyToManyField(StorylinePageRoleType, blank=True)
    information_types = ParentalManyToManyField(StorylinePageInformationType, blank=True)

    thumbnail = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=False,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    @property
    def thumbnail_rendition_url(self):
        url = self.thumbnail.get_rendition("fill-300x186|jpegquality-80")
        return url

    description = models.TextField(null=True, blank=True, help_text="Description of the storyline")

    scenario = models.ForeignKey(
        Scenario,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    COLOR_CHOICES = (
        ("card__bg-gold", "Gold"),
        ("card__bg-blue", "Blue"),
        ("card__bg-gray", "Gray"),
        ("card__bg-purple", "Purple"),
        ("card__bg-pink", "Pink"),
        ("card__bg-orange", "Orange"),
    )

    card_color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        default="card__bg-blue",
        blank=True,
        help_text="Background color in storyline overview page",
    )

    storyline = StreamField(
        [
            ("text_and_media", TextAndMediaBlock()),
            ("section", StorylineSectionBlock()),
        ],
        block_counts={
            "text_and_media": {"min_num": 1, "max_num": 1},
            "section": {"min_num": 1},
        },
        use_json_field=True,
    )

    serializer_class = "main.pages.StorylinePageSerializer"

    content_panels = BasePage.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("roles", widget=forms.CheckboxSelectMultiple),
                FieldPanel("information_types", widget=forms.CheckboxSelectMultiple),
            ],
            heading="Storyline data",
        ),
        FieldPanel("thumbnail"),
        FieldPanel("description"),
        FieldPanel("scenario"),
        FieldPanel("storyline"),
        FieldPanel("card_color"),
    ]

    parent_page_types = ["main.StorylineOverviewPage"]

    class Meta:
        verbose_name = _("Storyline")
