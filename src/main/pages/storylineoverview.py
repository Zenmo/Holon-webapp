from django.utils.translation import gettext_lazy as _

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.panels import FieldPanel
from wagtail.fields import StreamField

from .base import BasePage
from ..blocks import TitleBlock, HeroBlock, CardsBlock, TextAndMediaBlock, StorylineSectionBlock


class StorylineOverviewPage(HeadlessPreviewMixin, BasePage):
    intro = StreamField(
        [
            ("title_block", TitleBlock()),
            ("hero_block", HeroBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("card_block", CardsBlock()),
        ],
        verbose_name="Page intro (above the storylines)",
        blank=True,
        null=True,
        use_json_field=True,
    )

    footer = StreamField(
        [
            ("title_block", TitleBlock()),
            ("text_image_block", TextAndMediaBlock()),
            ("card_block", CardsBlock()),
        ],
        verbose_name="Page footer (below the storylines)",
        blank=True,
        null=True,
        use_json_field=True,
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("intro"),
        FieldPanel("footer"),
    ]

    serializer_class = "main.pages.StorylineOverviewPageSerializer"

    parent_page_types = ["main.HomePage"]
    subpage_types = [
        "main.StorylinePage",  # appname.ModelName
        "main.ChallengeModePage",  # appname.ModelName
    ]

    extra_panels = BasePage.extra_panels

    class Meta:
        verbose_name = _("StorylineOverview")
