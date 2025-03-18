from wagtail.blocks import StructBlock, ChoiceBlock


class NextInletBlock(StructBlock):
    """Block to include a piece of content defined in Next.js"""

    inlet = ChoiceBlock(
        choices=[
            ("IJzerboerenStep1", "IJzerboerenStep1"),
            ("IJzerboerenStep2", "IJzerboerenStep2"),
            ("IJzerboerenStep3", "IJzerboerenStep3"),
        ]
    )
