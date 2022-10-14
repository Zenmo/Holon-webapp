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

class BackgroundSelectorComponent(StructBlock):
    select_background = ChoiceBlock(choices=[
        ('', 'Default color'),
        ('bg-purple-100', 'prime color'),
        ('bg-violet-500', 'soft color'),
       
    ], required=False)


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
                          help_text=("default 2 cards in single row (col-md-6), add bootstrap classes to change"))

    cards = ListBlock(CardComponent())

    class Meta:
        icon = "grip"
        template = "blocks/cards_block.html"


class HeroBlock(StructBlock):
    """
    Custom block to select include hero with title, text and image
    """

    block_background = BackgroundSelectorComponent()

    title = CharBlock(classname="title", required=True)
    text = RichTextBlock(required=True)
    image_selector = MandatoryImageComponent()


    class Meta:
        icon = "title"
        template = "blocks/heading_block.html"

class TextImageBlock(StructBlock):
    """
    Custom block to include text with image
    """
    block_background = BackgroundSelectorComponent()

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

    class Meta:
        icon = 'image'
        template = 'blocks/image_block.html'

class TitleBlock(StructBlock): 
    """
    Custom block to create title blocks
    """
    block_background = BackgroundSelectorComponent(required=False)
    title = CharBlock(required=True)
    size = ChoiceBlock(choices=[
        ('', 'Select header size'),
        ('h2', 'H2'),
        ('h3', 'H3'),
        ('h4', 'H4'),
        ('h5', 'H5')
    ], blank=True, required=False)
    text = RichTextBlock(required=False)

class TextVideoBlock(StructBlock): 
    block_background = BackgroundSelectorComponent(required=False)
    title = CharBlock(required=True)
    size = ChoiceBlock(choices=[
        ('', 'Select header size'),
        ('h2', 'H2'),
        ('h3', 'H3'),
        ('h4', 'H4'),
        ('h5', 'H5')
    ], blank=True, required=False)
    text = RichTextBlock(required=False)

    embed_video = EmbedBlock(max_width=800, max_height=400)

class BaseStreamBlock(StreamBlock):

    required = False
    title_block = TitleBlock()
    hero_block = HeroBlock()
    text_image_block = TextImageBlock()
    card_block = CardsBlock()
    text_video_block = TextVideoBlock()
    
   