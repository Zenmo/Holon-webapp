from django.utils.translation import gettext_lazy as _

from wagtail.snippets.models import register_snippet
from django.db import models
from wagtail.admin.edit_handlers import MultiFieldPanel, FieldPanel
from wagtail_color_panel.fields import ColorField
from wagtail_color_panel.edit_handlers import NativeColorPanel
from autoslug import AutoSlugField


ICON_CHOICES = (
    ("book", "Book"),
    ("bell", "Bell"),
    ("cog", "Cog"),
    ("folder", "Folder"),
    ("heart", "Heart"),
    ("info", "Info"),
    ("lightning", "Lightning bolt"),
    ("mapmarker", "Map marker"),
    ("rocket", "Rocket"),
    ("star", "Star"),
    ("user", "User"),
)


class StorylinePageFilter(models.Model):
    name = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from="name")

    icon = models.CharField(
        max_length=20,
        choices=ICON_CHOICES,
        default="green",
        blank=True,
        help_text="Icon shown in storyline overview page",
    )

    class Meta:
        abstract = True


@register_snippet
class GraphColors(StorylinePageFilter):
    name = models.CharField(
        max_length=100, help_text="text should be exactly the same as the label of the bar"
    )
    color = ColorField()

    panels = [FieldPanel("name"), NativeColorPanel("color")]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Graph Colors")
        verbose_name_plural = _("Graph Colors")
        ordering = ["name"]
