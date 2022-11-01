from django.utils.translation import gettext_lazy as _

from wagtail.core.blocks import (
    StreamBlock, StructBlock, CharBlock, ListBlock,
    ChoiceBlock, RichTextBlock )
from wagtail.images.blocks import ImageChooserBlock as DefaultImageChooserBlock
from wagtail.embeds.blocks import EmbedBlock


class ImageChooserBlock(DefaultImageChooserBlock):
    def get_api_representation(self, value, context=None):
        if value:
            return {
                'id': value.id,
                'title': value.title,
                'img': value.get_rendition('width-2280').attrs_dict,
            }

class ButtonComponent(StructBlock): 

    button_style = ChoiceBlock(choices=[
        ("", 'Default button style'), 
        ('btn-dark', 'dark'), 
        ('btn-light', 'light')
    ], blank=True, required=False)

    button_size = ChoiceBlock(choices=[
        ('', 'Default button size'),
        ('btn-sm', 'small'),
        ('btn-lg', 'large')
    ], blank=True, required=False)

    button_text = CharBlock(required=False)

    button_hyperlink = CharBlock(required=False)

class ImageComponent(StructBlock):
    image = ImageChooserBlock(required=False)
    caption = CharBlock(required=False)
    attribution = CharBlock(required=False)

class MandatoryImageComponent(StructBlock):
    image = ImageChooserBlock(required=True)
    caption = CharBlock(required=False)
    attribution = CharBlock(
      help_text=_("Fill in this alt-text only when you want to describe the image (for screenreaders and SEO)"),
      required=False
    )

class CardComponent(StructBlock):
    head = CharBlock(required=False)
    image_selector = MandatoryImageComponent()

    subtitle = CharBlock(required=False)
    text = CharBlock(required=False)

    button_text = CharBlock(
        help_text=_("The url of the image hyperlink will be used for this button"), required=False)



class CardsBlock(StructBlock):
    """
    Custom block to include cards
    """
    layout = ChoiceBlock(choices=[
        ('', 'Card: Text below image'),
        ('tile', 'Tile: Text over image')
    ], help_text="", required=False)

    className = CharBlock(classname="className", required=False,
                          help_text=("default 2 cards in single row (col-md-6), add tailwind classes to change"))

    cards = ListBlock(CardComponent())

    card_background = ChoiceBlock(choices=[
        ('', 'Default color'),
        ('bg-holon-gray-100', 'Pale gray'),
        ('bg-holon-purple-100', 'Pale purple'),
    ], required=False)

    button = ButtonComponent()

    class Meta:
        icon = "grip"
        template = "blocks/cards_block.html"


class HeroBlock(StructBlock):
    """
    Custom block to select include hero with title, text and image
    """

    block_background = ChoiceBlock(choices=[
        ('', 'Default color'),
        ('bg-holon-gray-100', 'Pale gray'),
        ('bg-holon-purple-100', 'Pale purple'),
       
    ], required=False)

    title = CharBlock(classname="title", required=True)
    text = RichTextBlock(required=True)
    media = StreamBlock(
        [
            ("image", ImageChooserBlock(required=False)),
            ("video", EmbedBlock(required=False)),
        ],
        help_text="Choose an image or paste an embed url",
        max_num=1,
    )
    alt_text = CharBlock(
      help_text=("Fill in this alt-text only when you want to describe the image (for screenreaders and SEO)"),
      required=False
    )
   
    button = ButtonComponent()


    class Meta:
        icon = "title"
        template = "blocks/heading_block.html"

class TextImageBlock(StructBlock):
    """
    Custom block to include text with image
    """
    

    image_selector = MandatoryImageComponent()

    title = CharBlock(required=True)
    size = ChoiceBlock(choices=[
        ('', 'Select header size'),
        ('h2', 'H2'),
        ('h3', 'H3'),
        ('h4', 'H4'),
        ('h5', 'H5')
    ], blank=True, required=False)
    text = RichTextBlock()

    button = ButtonComponent()
    
    class Meta:
        icon = 'image'
        template = 'blocks/text_image_block.html'

class TitleBlock(StructBlock): 
    """
    Custom block to create title blocks
    """
    background = ChoiceBlock(choices=[
        ('', 'Default color'),
        ('bg-holon-gray-100', 'Pale gray'),
        ('bg-holon-purple-100', 'Pale purple'),
    ], required=False)
    
    title = CharBlock(required=True)
    size = ChoiceBlock(choices=[
        ('', 'Select header size'),
        ('h1', 'H1'),
        ('h2', 'H2'),
    ], blank=True, required=False)
    text = RichTextBlock(required=False)

    class Meta:
        icon = 'title'
        template = 'blocks/title_block.html'

class HomepageBlock(StreamBlock):

    required = False
    title_block = TitleBlock()
    hero_block = HeroBlock()
    text_image_block = TextImageBlock()
    card_block = CardsBlock()
    

