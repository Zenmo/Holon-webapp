from django.utils.translation import gettext_lazy as _
from wagtail.core.blocks import StructBlock, ChoiceBlock

THIRD_TWOTHIRDS = "33_66"
HALF_HALF = "50_50"
TWOTHIRDS_THIRD = "66_33"
GRID_CHOICES = (
    (THIRD_TWOTHIRDS, "33% - 66%"),
    (HALF_HALF, "50% - 50%"),
    (TWOTHIRDS_THIRD, "66% - 33%"),
)


class GridChooserBlock(StructBlock):
    grid = ChoiceBlock(choices=GRID_CHOICES, default=HALF_HALF)

    class Meta:
        icon = "view"
