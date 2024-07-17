from django.utils.translation import gettext_lazy as _
from wagtail.blocks import StructBlock, ChoiceBlock

FIVE_TWELFTHS_SEVEN_TWELFTHS = "5_7"
THIRD_TWOTHIRDS = "33_66"
HALF_HALF = "50_50"
TWOTHIRDS_THIRD = "66_33"
GRID_CHOICES = (
    (FIVE_TWELFTHS_SEVEN_TWELFTHS, "5/12 - 7/12"),
    (THIRD_TWOTHIRDS, "33% - 66%"),
    (HALF_HALF, "50% - 50%"),
    (TWOTHIRDS_THIRD, "66% - 33%"),
)


class GridChooserBlock(StructBlock):
    grid = ChoiceBlock(choices=GRID_CHOICES, default=HALF_HALF)

    class Meta:
        icon = "view"
