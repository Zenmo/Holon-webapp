from django.utils.translation import gettext_lazy as _

from wagtail.blocks import (
    StructBlock,
    CharBlock,
    ChoiceBlock,
    ListBlock,
    StreamBlock,
    URLBlock,
)
from .button import ButtonBlock
from .holon_image_chooser import HolonImageChooserBlock
from .page_chooser_block import PageChooserBlock

COLOR_CHOICES = (
    ("card__bg-gold", "Gold"),
    ("card__bg-blue", "Blue"),
    ("card__bg-gray", "Gray"),
    ("card__bg-purple", "Purple"),
    ("card__bg-pink", "Pink"),
    ("card__bg-orange", "Orange"),
    ("card__bg-resourcefully-green", "Resourcefully Green"),
)


class CardComponent(StructBlock):
    title = CharBlock(required=False)
    image_selector = HolonImageChooserBlock()
    description = CharBlock(required=False, max_length=255)
    card_color = ChoiceBlock(
        choices=COLOR_CHOICES,
        required=False,
    )
    item_link = StreamBlock(
        [
            (
                "intern",
                PageChooserBlock(
                    required=False,
                    helptext="Choose if you want the card to link to a page internally",
                ),
            ),
            (
                "extern",
                URLBlock(required=False, helptext="Fill in if the card should link externally"),
            ),
        ],
        help_text="Optional: add an internal or external link to the card",
        max_num=1,
        required=False,
    )


class CardsBlock(StructBlock):
    """
    Custom block to include cards
    """

    cards = ListBlock(CardComponent())

    button_block = StreamBlock([("buttons", ButtonBlock(required=False))], required=False)

    class Meta:
        icon = "grip"
