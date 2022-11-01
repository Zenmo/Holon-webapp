""" Streamfields """
import re
from wagtail.core import blocks
from wagtail.embeds.blocks import EmbedBlock
from .button import ButtonComponent
from .holon_image_chooser import HolonImageChooserBlock


class TextAndMediaBlock(blocks.StructBlock):
    """Text and Media block"""

    THIRD_TWOTHIRDS = "33_66"
    HALF_HALF = "50_50"
    TWOTHIRDS_THIRD = "66_33"
    GRID_CHOICES = (
        (THIRD_TWOTHIRDS, "33% - 66%"),
        (HALF_HALF, "50% - 50%"),
        (TWOTHIRDS_THIRD, "66% - 33%"),
    )

    background = blocks.ChoiceBlock(choices=[
        ('', 'Default color'),
        ('bg-holon-gray-100', 'Pale gray'),
        ('bg-holon-purple-100', 'Pale purple'),
    ], required=False, default="")

    title = blocks.CharBlock(required=True, help_text="Add your title")
    size = blocks.ChoiceBlock(choices=[
        ('', 'Select header size'),
        ('h2', 'H2'),
        ('h3', 'H3'),
        ('h4', 'H4'),
        ('h5', 'H5')
    ], blank=True, required=False, default="")
    text = blocks.RichTextBlock(required=True, help_text="Add your text", rows=15)
    media = blocks.StreamBlock(
        [
            ("image", HolonImageChooserBlock(required=False)),
            ("video", EmbedBlock(required=False)),
        ],
        help_text="Choose an image or paste an embed url",
        max_num=1,
    )

    alt_text = blocks.CharBlock(
        help_text=(
            "Fill in this alt-text only when you want to describe the image (for screenreaders and SEO)"
        ),
        required=False,
    )

    grid_layout = blocks.ChoiceBlock(
        required=True, choices=GRID_CHOICES, default=THIRD_TWOTHIRDS
    )

    button = ButtonComponent()

    class Meta:  # NOQA
        icon = "image"
        label = "Text and Media"
