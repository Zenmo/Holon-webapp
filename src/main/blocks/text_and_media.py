"""Streamfields"""

import wagtail.blocks as blocks
from wagtail.embeds.blocks import EmbedBlock
from main.blocks.rich_text_block import RichtextBlock
from .holon_image_chooser import HolonImageChooserBlock
from .button import ButtonBlock
from .grid_chooser import GridChooserBlock
from .background_chooser import BackgroundChooserBlock


class TextAndMediaBlock(blocks.StructBlock):
    """Text and Media block"""

    grid_layout = GridChooserBlock(required=True)

    column_order = blocks.ChoiceBlock(
        choices=[
            ("", "Default (Text left, Media right)"),
            ("invert", "Invert columns (Media left, Text right)"),
        ],
        blank=True,
        required=False,
        default="",
    )

    background = BackgroundChooserBlock()

    text = RichtextBlock(required=True, help_text="Add your text", rows=15)

    media = blocks.StreamBlock(
        [
            ("image", HolonImageChooserBlock(required=False)),
            ("video", EmbedBlock(required=False, help_text="Youtube url of vimeo url")),
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

    button_block = blocks.StreamBlock([("buttons", ButtonBlock(required=False))], required=False)

    class Meta:  # NOQA
        icon = "image"
        label = "Text and Media"
