"""Streamfields"""

from wagtail import blocks
from main.blocks.rich_text_block import RichTextBlock
from .grid_chooser import GridChooserBlock
from .background_chooser import BackgroundChooserBlock


class ParagraphBlock(blocks.StructBlock):
    """Paragraph block"""

    grid_layout = GridChooserBlock(
        required=True,
        help_text="Note: Within Wiki pages, 'grid layout' , 'background color' and 'background size' are ignored",
    )

    background = BackgroundChooserBlock()

    text = RichTextBlock(required=True, help_text="Add your text", rows=15)

    class Meta:  # NOQA
        icon = "form"
        label = "Paragraph"
