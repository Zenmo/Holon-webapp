""" Streamfields """
from wagtail.core import blocks
from .holon_header_image_chooser import HolonHeaderImageChooserBlock


class HeaderFullImageBlock(blocks.StructBlock):
    """Header Full Image block"""

    title = blocks.CharBlock(required=True)
    size = blocks.ChoiceBlock(
        choices=[
            ("", "Select header size"),
            ("h1", "H1"),
            ("h2", "H2"),
        ],
        blank=True,
        required=True,
        default="h2",
    )

    image_selector = HolonHeaderImageChooserBlock(required=True)

    alt_text = blocks.CharBlock(
        help_text=(
            "Fill in this alt-text only when you want to describe the image (for screenreaders and SEO)"
        ),
        required=False,
    )

    class Meta:  # NOQA
        icon = "image"
