from django.utils.translation import gettext_lazy as _
from wagtail.blocks import StructBlock, ChoiceBlock

THIRD_TWOTHIRDS = "33_66"
HALF_HALF = "50_50"
TWOTHIRDS_THIRD = "66_33"
GRID_CHOICES = (
    (THIRD_TWOTHIRDS, "33% - 66%"),
    (HALF_HALF, "50% - 50%"),
    (TWOTHIRDS_THIRD, "66% - 33%"),
)

WHITE = "block__bg-white"
GRAY = "block__bg-gray"
PURPLE = "block__bg-purple"
COLOR_CHOICES = (
    (WHITE, "White"),
    (GRAY, "Pale gray"),
    (PURPLE, "Pale purple"),
)

FULL = "bg__full"
LEFT = "bg__left"
SIZE_CHOICES = ((FULL, "Full backgroundcolor"), (LEFT, "Only backgroundcolor in the left block"))


class BackgroundChooserBlock(StructBlock):
    color = ChoiceBlock(choices=COLOR_CHOICES, default=WHITE, required=True)
    size = ChoiceBlock(choices=SIZE_CHOICES, default=FULL, required=True)

    class Meta:
        icon = "edit"
