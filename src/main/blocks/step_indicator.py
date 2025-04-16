from django.utils.translation import gettext_lazy as _
from wagtail.blocks import StreamBlock, CharBlock
from django.utils.translation import gettext_lazy as _
from wagtail.contrib.table_block.blocks import TableBlock

from .anylogic_embed import AnyLogicEmbed
from ..blocks import TitleBlock, ParagraphBlock, CardsBlock, TextAndMediaBlock, HeaderFullImageBlock
from ..blocks.next_inlet import NextInletBlock
from ..pages import new_table_options


class StepIndicator(StreamBlock):
    def __init__(self, local_blocks=[], **kwargs):
        super().__init__(
            [
                ("step_anchor", StepAnchor()),
                ("title_block", TitleBlock()),
                ("header_full_image_block", HeaderFullImageBlock()),
                ("text_image_block", TextAndMediaBlock()),
                ("paragraph_block", ParagraphBlock()),
                (
                    "table_block",
                    TableBlock(
                        table_options=new_table_options,
                        required=True,
                        help_text=("Add extra columns and rows with right mouse click"),
                    ),
                ),
                ("card_block", CardsBlock()),
                ("next_inlet_block", NextInletBlock()),
                ("anylogic_embed", AnyLogicEmbed()),
            ]
            + local_blocks,
            help_text=_(
                "Scrollable steps to indicate progress in the storyline. "
                "Add a Step Anchor to create a new step."
            ),
            use_json_field=True,
            icon="list-ol",
            **kwargs
        )


class StepAnchor(CharBlock):
    """StapAnchor adds a step to a StepIndicator"""

    def __init__(self):
        super().__init__(
            required=False,
            help_text=_("Optional text to show in the step indicator."),
            icon="tag",
        )
