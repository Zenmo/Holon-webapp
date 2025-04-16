from wagtail.blocks import StructBlock, StreamBlock

from main.blocks.column import ColumnBlock


class RowBlock(StructBlock):
    def __init__(self):
        super().__init__(
            help_text="Minimal generic row block which can have multiple columns. Column width settings not implemented yet"
        )

    columns = StreamBlock(
        [
            ("column_block", ColumnBlock()),
        ],
        help_text="Add columns",
        required=True,
    )

    class Meta:  # NOQA
        icon = "expand-right"
        label = "Row"
