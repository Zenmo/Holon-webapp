from wagtail.core import blocks
from wagtail.core.rich_text import expand_db_html


class RichtextBlock(blocks.RichTextBlock):
    def get_api_representation(self, value, context=None):
        representation = super().get_api_representation(value, context)
        return expand_db_html(representation)
