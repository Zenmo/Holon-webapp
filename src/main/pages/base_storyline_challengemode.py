from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms
from autoslug import AutoSlugField

from modelcluster.fields import ParentalManyToManyField
from wagtail.blocks import StreamBlock, CharBlock
from wagtail_headless_preview.models import HeadlessPreviewMixin

from wagtail.fields import StreamField
from wagtail.admin.panels import MultiFieldPanel, FieldPanel
from .base import BasePage
from .base_card import BaseCard
from ..blocks import (
    TextAndMediaBlock,
    StorylineSectionBlock,
    HeroBlock,
    TitleBlock,
    CardsBlock,
    HeaderFullImageBlock,
    PageChooserBlock,
)

from main.snippets.storyline_page_role_type import StorylinePageRoleType
from main.snippets.storyline_page_information_type import StorylinePageInformationType
from ..blocks.step_indicator import StepIndicator

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


COLOR_CHOICES = (
    ("card__bg-gold", "Gold"),
    ("card__bg-blue", "Blue"),
    ("card__bg-gray", "Gray"),
    ("card__bg-purple", "Purple"),
    ("card__bg-pink", "Pink"),
    ("card__bg-orange", "Orange"),
)


class BaseStorylineChallengeMode(HeadlessPreviewMixin, BaseCard):
    """A default Storyline / Challenge Mode parent page"""

    roles = ParentalManyToManyField(StorylinePageRoleType, blank=True)
    information_types = ParentalManyToManyField(StorylinePageInformationType, blank=True)

    wiki_links = StreamField(
        [
            (
                "cost_benefit",
                PageChooserBlock(
                    "main.WikiPage",
                    required=False,
                    helptext="Link to wiki from cost benefit page",
                ),
            ),
            (
                "holarchy",
                PageChooserBlock(
                    "main.WikiPage",
                    required=False,
                    helptext="Link to wiki from holarchy page",
                ),
            ),
        ],
        use_json_field=True,
        blank=True,
        null=True,
        max_num=2,
    )

    storyline = StreamField(
        [
            ("header_full_image_block", HeaderFullImageBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("section", StorylineSectionBlock()),
            ("hero_block", HeroBlock()),
            ("title_block", TitleBlock()),
            ("card_block", CardsBlock()),
            (
                "step_indicator",
                StepIndicator(
                    [
                        ("section", StorylineSectionBlock()),
                    ]
                ),
            ),
        ],
        use_json_field=True,
        null=True,
        blank=True,
    )

    content_panels = BaseCard.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("roles", widget=forms.CheckboxSelectMultiple),
                FieldPanel("information_types", widget=forms.CheckboxSelectMultiple),
            ],
            heading="Page data",
        ),
        FieldPanel("wiki_links"),
        FieldPanel("storyline"),
    ]

    extra_panels = BasePage.extra_panels

    class Meta:
        abstract = True
