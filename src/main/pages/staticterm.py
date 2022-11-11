from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.panels import FieldPanel

from main.pages.static import StaticPage


class StaticTermPage(StaticPage):
    introduction = models.CharField(
        max_length=500, help_text=_("Text used in the highlight on other pages")
    )

    content_panels = [
        FieldPanel(
            "introduction",
        )
    ] + StaticPage.content_panels

    extra_panels = StaticPage.extra_panels
    serializer_class = "main.pages.StaticTermPageSerializer"

    class Meta:
        verbose_name = _("StaticTermPage")
