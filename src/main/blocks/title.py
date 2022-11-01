from wagtail.core.blocks import (
    StructBlock,
    CharBlock,
    ChoiceBlock,
    RichTextBlock,
)


class TitleBlock(StructBlock):
    """
    Custom block to create title blocks
    """

    background = ChoiceBlock(
        choices=[
            ("", "Default color"),
            ("bg-holon-gray-100", "Pale gray"),
            ("bg-holon-purple-100", "Pale purple"),
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
        required=False,
    )
    text = RichTextBlock(required=False)

    class Meta:
        icon = "title"
