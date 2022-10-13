from django import forms
from django.utils.translation import gettext_lazy as _
from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.fields import StreamField
from wagtail import blocks
from wagtail.admin.panels import FieldPanel
from wagtail.embeds.blocks import EmbedBlock
from wagtail.images.blocks import ImageChooserBlock

from api.models import Slider

from .base import BasePage

scenarios = [
    ("scenario-1", "Scenario 1"),
    ("scenario-2", "Scenario 2"),
    ("scenario-3", "Scenario 3"),
]

sliders = [
    ("slider-1", "Zonnepanelen"),
    ("slider-2", "Elektrische auto's"),
    ("slider-3", "Windmolens"),
]


class SliderBlock(blocks.StructBlock):
    choises = [(slider.pk, slider.name) for slider in Slider.objects.all()]
    slider = blocks.ChoiceBlock(choices=choises)
    visible = blocks.BooleanBlock(required=False)


class StorylinePage(HeadlessPreviewMixin, BasePage):
    storyline = StreamField(
        [
            (
                "intro",
                blocks.StructBlock(
                    [
                        ("text", blocks.CharBlock()),
                        (
                            "media",
                            blocks.StreamBlock(
                                [
                                    ("image", ImageChooserBlock(required=False)),
                                    ("video", EmbedBlock(required=False)),
                                ],
                                max_num=1,
                            ),
                        ),
                    ]
                ),
            ),
            (
                "section",
                blocks.StructBlock(
                    [
                        ("scenario", blocks.ChoiceBlock(choices=scenarios)),
                        (
                            "content",
                            blocks.StreamBlock(
                                [
                                    ("text", blocks.RichTextBlock()),
                                    ("slider", SliderBlock()),
                                ]
                            ),
                        ),
                    ]
                ),
            ),
        ],
        block_counts={"intro": {"min_num": 1, "max_num": 1}},
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("storyline"),
    ]

    extra_panels = BasePage.extra_panels
    serializer_class = "main.pages.StorylinePageSerializer"

    class Meta:
        verbose_name = _("Storyline")
