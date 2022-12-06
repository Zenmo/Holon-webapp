from wagtail.core import blocks
from wagtail.embeds.blocks import EmbedBlock

from main.blocks.rich_text_block import RichtextBlock
from .holon_image_chooser import HolonImageChooserBlock
from .background_chooser import BackgroundChooserBlock
from .page_chooser_block import PageChooserBlock
from .cards import CardComponent

COLOR_CHOICES = (
    ("card__bg-gold", "Gold"),
    ("card__bg-blue", "Blue"),
    ("card__bg-gray", "Gray"),
    ("card__bg-purple", "Purple"),
    ("card__bg-pink", "Pink"),
    ("card__bg-orange", "Orange"),
)

class ButtonCardComponent(blocks.StructBlock):
    title = blocks.CharBlock(required=False)
    image_selector = HolonImageChooserBlock()
    card_color = blocks.ChoiceBlock(
        choices=COLOR_CHOICES,
        required=False,
    )
    card_link = PageChooserBlock(
                    required=True,
                    helptext="Add an internal link to the button",
    )

class ButtonsAndMediaBlock(blocks.StructBlock):
    """Buttons and Media block"""
    

    background = BackgroundChooserBlock()

    buttons = blocks.ListBlock(ButtonCardComponent(), required=True, min_num=1, max_num=5)

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

    class Meta:  # NOQA
        icon = "image"
        label = "Buttons and Media"
