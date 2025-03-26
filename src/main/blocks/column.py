from wagtail.blocks import StructBlock, StreamBlock
from main.blocks.rich_text_block import RichTextBlock
from . import TitleBlock, HeaderFullImageBlock
from .next_inlet import NextInletBlock


class ColumnBlock(StructBlock):
    def __init__(self):
        super().__init__(help_text="Generic column which wraps more blocks. Always child of a row.")

    content_items = StreamBlock(
        [
            ("text", RichTextBlock()),
            ("title_block", TitleBlock()),
            ("header_full_image_block", HeaderFullImageBlock()),
            ("next_inlet_block", NextInletBlock()),
        ],
        help_text="Add columns",
        required=True,
    )

    class Meta:  # NOQA
        icon = "expand-right"
        label = "Column"
