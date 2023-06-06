from wagtail.images.blocks import ImageChooserBlock as DefaultImageChooserBlock


class HolonHeaderImageChooserBlock(DefaultImageChooserBlock):
    def get_api_representation(self, value, context=None):
        if value:
            return {
                "id": value.id,
                "title": value.title,
                "img": value.get_rendition("width-1920|jpegquality-100").attrs_dict,
            }
