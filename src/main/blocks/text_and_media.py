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

    def get_api_representation(self, value, context=None):
        """Recursively call get_api_representation on children and return as a plain dict"""
        dict_list = []
        if value:
            for item in value["media"]:
                temp_dict = {
                    "text": value["text"].source,
                    "media": [{"value": item.value.file.url, "id": item.id, "type": "image"}],
                    "grid_layout": value["grid_layout"],
                }
                dict_list.append(temp_dict)
        return dict_list[0]

    class Meta:  # NOQA
        icon = "edit"
        label = "Text and Media"
