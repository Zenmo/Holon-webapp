from django.utils.translation import gettext_lazy as _

from wagtail.core.blocks import StreamBlock, StructBlock, CharBlock, ChoiceBlock
from wagtail.embeds.blocks import EmbedBlock

from main.blocks.rich_text_block import RichtextBlock
from .button import ButtonBlock
from wagtail.images.blocks import ImageChooserBlock as DefaultImageChooserBlock


class LegendaImageChooserBlock(DefaultImageChooserBlock):
    def get_api_representation(self, value, context=None):
        if value:
            return {
                "id": value.id,
                "title": value.title,
                "img": value.get_rendition("width-20").attrs_dict,
            }


class LegendItem(StructBlock):
    """
    Custom block to create a legend item
    """

    label = CharBlock(required=True)
    image_selector = LegendaImageChooserBlock(required=True)
    type = ChoiceBlock(
        choices=[("line", "Line"), ("color", "Color")],
        blank=True,
        required=False,
        default="color",
    )


class LegendItemsBlock(StructBlock):
    legend_items = StreamBlock(
        [
            ("item", LegendItem(required=True)),
        ],
        help_text="Add Legend items",
        use_json_field=True,
    )
