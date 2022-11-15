from django.utils.translation import gettext_lazy as _
from wagtail.core.blocks import StructBlock, CharBlock, ChoiceBlock, StreamBlock, URLBlock
from .PageChooserBlock import PageChooserBlock



class ButtonComponent(StructBlock):
    button_style = ChoiceBlock(
        choices=[("", "Default button style"), ("dark", "dark"), ("light", "light")],
        blank=True,
        required=False,
        default="dark",
    )

    button_text = CharBlock(required=True)

    button_link = StreamBlock(
        [ 
            ("intern", PageChooserBlock(required=False, helptext="Choose if you want the button to link to a page internally")), 
            ("extern", URLBlock(required=False, helptext="Fill in if the button should link externally"))
        ], 
        help_text="Where do you want the button to link to", 
        max_num=1,
    )

class ButtonBlock(StructBlock): 
    buttons_align = ChoiceBlock(
        choices=[("btn-left", "left"), ("btn-center", "center")], 
        required=False, 
        default="btn-left",
    )

    buttons = StreamBlock(
        [
            ("button", ButtonComponent(required=True)),
        ],
        help_text="Add a button",
        min_num=1,
    ) 


