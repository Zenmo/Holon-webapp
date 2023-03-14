from django.utils.translation import gettext_lazy as _
from django.db import models
from django import forms
from autoslug import AutoSlugField

from modelcluster.fields import ParentalManyToManyField
from wagtail_headless_preview.models import HeadlessPreviewMixin

from wagtail.fields import StreamField
from wagtail.admin.edit_handlers import MultiFieldPanel, FieldPanel
from .base import BasePage
from .base_card import BaseCard
from ..blocks import (
    TextAndMediaBlock,
    StorylineSectionBlock,
    HeroBlock,
    TitleBlock,
    CardsBlock,
    HeaderFullImageBlock,
)

from main.snippets.storyline_page_role_type import StorylinePageRoleType
from main.snippets.storyline_page_information_type import StorylinePageInformationType

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

    storyline = StreamField(
        [
            ("header_full_image_block", HeaderFullImageBlock()),
            ("text_and_media", TextAndMediaBlock()),
            ("section", StorylineSectionBlock()),
            ("heroblock", HeroBlock()),
            ("title_block", TitleBlock()),
            ("card_block", CardsBlock()),
        ],
        block_counts={
            "header_full_image_block": {"min_num": 1},
            "section": {"min_num": 1},
        },
        use_json_field=True,
    )

    content_panels = BaseCard.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("roles", widget=forms.CheckboxSelectMultiple),
                FieldPanel("information_types", widget=forms.CheckboxSelectMultiple),
            ],
            heading="Page data",
        ),
        FieldPanel("storyline"),
    ]

    extra_panels = BasePage.extra_panels

    class Meta:
        abstract = True
