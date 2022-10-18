""" Streamfields """
import re
from wagtail.core import blocks
from wagtail.embeds.blocks import EmbedBlock
from wagtail.embeds.embeds import get_embed
from wagtail.images.blocks import ImageChooserBlock
from wagtail.embeds.exceptions import EmbedException


class TextAndMediaBlock(blocks.StructBlock):
    """Text and Media block"""

    QUARTER_THREEQUARTERS = "25_75"
    HALF_HALF = "50_50"
    THREEQUARTERS_QUARTER = "75_25"
    GRID_CHOICES = (
        (QUARTER_THREEQUARTERS, "25% - 75%"),
        (HALF_HALF, "50% - 50%"),
        (THREEQUARTERS_QUARTER, "75% - 25%"),
    )

    text = blocks.RichTextBlock(required=True, help_text="Add your text", rows=15)
    media = blocks.StreamBlock(
        [
            ("image", ImageChooserBlock(required=False)),
            ("video", EmbedBlock(required=False)),
        ],
        help_text="Choose an image or paste an embed url",
        max_num=1,
    )
    grid_layout = blocks.ChoiceBlock(
        required=True, choices=GRID_CHOICES, default=THREEQUARTERS_QUARTER
    )

    class Meta:  # NOQA
        icon = "edit"
        label = "Text and Media"
