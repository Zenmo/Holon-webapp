from django.utils.translation import gettext_lazy as _

from wagtail.snippets.models import register_snippet
from wagtail.admin.panels import FieldPanel

from .snippet_base import SnippetBase


@register_snippet
class StorylinePageRoleType(SnippetBase):
    panels = [
        FieldPanel("name"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Roletype")
        verbose_name_plural = _("Rolestypes")
        ordering = ["name"]
