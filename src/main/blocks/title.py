from wagtail.core.blocks import (
    StructBlock,
    CharBlock,
    ChoiceBlock,
)

from main.blocks.rich_text_block import RichtextBlock


class TitleBlock(StructBlock):
    """
    Custom block to create title blocks
    """

    background_color = ChoiceBlock(
        choices=[
            ("", "Default color"),
            ("block__bg-gray", "Pale gray"),
            ("block__bg-gray", "Pale purple"),
        ],
        required=False,
    )

    title = CharBlock(required=True)
    size = ChoiceBlock(
        choices=[
            ("", "Select header size"),
            ("h1", "H1"),
            ("h2", "H2"),
        ],
        blank=True,
        required=True,
    )
    text = RichtextBlock(required=False)

    class Meta:
        icon = "title"
