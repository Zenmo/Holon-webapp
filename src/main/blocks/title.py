from wagtail.blocks import StructBlock, CharBlock, ChoiceBlock, StreamBlock
from .button import ButtonBlock
from main.blocks.rich_text_block import RichTextBlock


class TitleBlock(StructBlock):
    """
    Custom block to create title blocks
    """

    background_color = ChoiceBlock(
        choices=[
            ("", "Default color"),
            ("block__bg-gray", "Pale gray"),
            ("block__bg-purple", "Pale purple"),
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
        default="h2",
    )
    text = RichTextBlock(required=False)

    button_block = StreamBlock([("buttons", ButtonBlock(required=False))], required=False)

    class Meta:
        icon = "title"
