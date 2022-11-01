from django.utils.translation import gettext_lazy as _

from wagtail.core.blocks import StructBlock, CharBlock, ChoiceBlock, ListBlock
from .button import ButtonComponent
from .holon_image_chooser import HolonImageChooserBlock


class CardComponent(StructBlock):
    head = CharBlock(required=False)
    image_selector = HolonImageChooserBlock()

    subtitle = CharBlock(required=False)
    text = CharBlock(required=False)

    button_text = CharBlock(
        help_text=_("The url of the image hyperlink will be used for this button"), required=False
    )


class CardsBlock(StructBlock):
    """
    Custom block to include cards
    """

    layout = ChoiceBlock(
        choices=[("", "Card: Text below image"), ("tile", "Tile: Text over image")],
        help_text="",
        required=False,
    )

    className = CharBlock(
        classname="className",
        required=False,
        help_text=("default 2 cards in single row (col-md-6), add tailwind classes to change"),
    )

    cards = ListBlock(CardComponent())

    card_background = ChoiceBlock(
        choices=[
            ("", "Default color"),
            ("bg-holon-gray-100", "Pale gray"),
            ("bg-holon-purple-100", "Pale purple"),
        ],
        required=False,
    )

    button = ButtonComponent()

    class Meta:
        icon = "grip"
