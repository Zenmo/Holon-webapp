from django.utils.translation import gettext_lazy as _
from wagtail.core.blocks import StructBlock, CharBlock, ChoiceBlock


class ButtonComponent(StructBlock):
    button_style = ChoiceBlock(
        choices=[("", "Default button style"), ("btn-dark", "dark"), ("btn-light", "light")],
        blank=True,
        required=False,
    )

    button_text = CharBlock(required=False)

    button_hyperlink = CharBlock(required=False)
