from wagtail import blocks
from wagtail.fields import StreamField

from main.blocks import StorylineSectionBlock


class StepIndicator(blocks.StructBlock):
    steps = StreamField(
        [
            ("section", StorylineSectionBlock()),
        ],
        block_counts={
            "section": {"min_num": 1},
        },
        use_json_field=True,
        null=True,
        blank=True,
    )
