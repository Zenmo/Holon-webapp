from django.utils.translation import gettext_lazy as _
from wagtail.core.blocks import StructBlock, CharBlock, ChoiceBlock


class ButtonComponent(StructBlock):
    button_style = ChoiceBlock(
        choices=[("", "Default button style"), ("btn-dark", "dark"), ("btn-light", "light")],
        blank=True,
        required=False,
        default="btn-dark",
    )

    button_text = CharBlock(required=True)

    button_hyperlink = CharBlock(required=True, helptext="Choose where you want the button to link to")

    button_align = ChoiceBlock(
        choices=[("", "Default button align"), ("btn-left", "left"), ("btn-center", "center")], 
        required=False, 
        default="btn-left",
    )
