from django.utils.translation import gettext_lazy as _

from wagtail.core.blocks import (
    StructBlock,
    CharBlock,
    StreamBlock,
    RichTextBlock,
    ChoiceBlock,
    BooleanBlock,
    IntegerBlock,
)


class ThemeSelectorComponent(StructBlock):
    select_theme = ChoiceBlock(
        choices=[("", "White background"), ("primary", "Purple brackground")], required=False
    )


class ThemeSelectorComponent(StructBlock):
    select_theme = ChoiceBlock(
        choices=[("", "White background"), ("primary", "Purple brackground")], required=False
    )


class JumbotronBlock(StructBlock):

    xxx = CharBlock()

    class Meta:
        icon = "tag"
        template = "blocks/jumbotron_block.html"


class TestBlock(StructBlock):

    test = CharBlock()

    class Meta:
        icon = "form"
        template = "blocks/jumbotron_block.html"


class ScenarioBlock(StructBlock):

    title = CharBlock(required=True)
    description = RichTextBlock(required=True)

    solarpanels_default = IntegerBlock(
        min_value=0, required=False, help_text=_("Default amount of solarpanels")
    )
    solarpanels_min = IntegerBlock(
        min_value=0, required=False, help_text=_("Minimum amount of solarpanels")
    )
    solarpanels_max = IntegerBlock(
        min_value=0, required=False, help_text=_("Maximum amount of solarpanels")
    )
    solarpanels_locked = BooleanBlock(
        required=False, default=False, help_text=_("Show locked solarpanel slider")
    )

    windmills_default = IntegerBlock(
        min_value=0, required=False, help_text=_("Default amount of windmills")
    )
    windmills_min = IntegerBlock(
        min_value=0, required=False, help_text=_("Minimum amount of windmills")
    )
    windmills_max = IntegerBlock(
        min_value=0, required=False, help_text=_("Maximum amount of windmills")
    )
    windmills_locked = BooleanBlock(
        required=False, default=False, help_text=_("Show locked windmill slider")
    )

    block_theme = ThemeSelectorComponent()

    class Meta:
        icon = "site"
        template = "blocks/scenario_block.html"


class BaseStreamBlock(StreamBlock):
    required = False

    scenario_block = ScenarioBlock()
    jumbotron_block = JumbotronBlock()
    test123_block = TestBlock()
