from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail.fields import StreamBlock
from wagtail.core import blocks

from api.models import InteractiveInput
from .holon_image_chooser import HolonImageChooserBlock

from .feedbackmodals import FeedbackModalInteractiveInputCondition


class HolarchyFeedbackImage(blocks.StructBlock):

    image_selector = HolonImageChooserBlock()

    conditions = StreamBlock(
        [
            ("interactive_input_condition", FeedbackModalInteractiveInputCondition()),
        ],
        block_counts={},
        use_json_field=True,
        help_text="Feedback will only be shown when ALL conditions of a modal are true",
    )

    class Meta:
        help_text = "Only the first image that meets all conditions will be show. You can change the order by hovering the three dots ... "
