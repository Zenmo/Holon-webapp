from wagtail.blocks import StructBlock, ChoiceBlock


class NextInletBlock(StructBlock):
    """Block to include a piece of content defined in Next.js"""

    def __init__(self):
        super().__init__(help_text="Block to include a piece of content defined in Next.js")

    inlet = ChoiceBlock(
        choices=[
            ("IJzerboerenStep1", "IJzerboerenStep1"),
            ("IJzerboerenStep2", "IJzerboerenStep2"),
            ("IJzerboerenStep3", "IJzerboerenStep3"),
            ("IronPowderProcessSankey", "IronPowderProcessSankey"),
            ("HattemEmbed", "HattemEmbed"),
        ]
    )
