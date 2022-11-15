from django.utils.translation import gettext_lazy as _

from wagtail.core.blocks import StreamBlock, StructBlock, CharBlock, ChoiceBlock
from wagtail.embeds.blocks import EmbedBlock

from main.blocks.rich_text_block import RichtextBlock
from .button import ButtonBlock
from .holon_image_chooser import HolonImageChooserBlock


class HeroBlock(StructBlock):
    """
    Custom block to select include hero with title, text and image
    """

    background_color = ChoiceBlock(
        choices=[
            ("", "Default color"),
            ("block__bg-gray", "Pale gray"),
            ("block__bg-gray", "Pale purple"),
        ],
        required=False,
    )

    title = CharBlock(classname="title", required=True)
    text = RichtextBlock(required=True)
    media = StreamBlock(
        [
            ("image", HolonImageChooserBlock(required=False)),
            ("video", EmbedBlock(required=False)),
        ],
        help_text="Choose an image or paste an embed url",
        max_num=1,
    )
    alt_text = CharBlock(
        help_text=(
            "Fill in this alt-text only when you want to describe the image (for screenreaders and SEO)"
        ),
        required=False,
    )

    button_block = StreamBlock(
        [
            ("buttons", ButtonBlock(required=False))
        ], 
        required=False
    )

    class Meta:
        icon = "title"
