from django.utils.translation import gettext_lazy as _
from django.db import models

from wagtail_headless_preview.models import HeadlessPreviewMixin
from wagtail.admin.edit_handlers import FieldPanel
from wagtail.fields import StreamField
from .base import BasePage

COLOR_CHOICES = (
    ("card__bg-gold", "Gold"),
    ("card__bg-blue", "Blue"),
    ("card__bg-gray", "Gray"),
    ("card__bg-purple", "Purple"),
    ("card__bg-pink", "Pink"),
    ("card__bg-orange", "Orange"),
)


class BaseCard(BasePage):
    thumbnail = models.ForeignKey(
        "customimage.CustomImage",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    @property
    def thumbnail_rendition_url(self):
        url = None
        if self.thumbnail is not None:
            url = self.thumbnail.get_rendition("fill-750x380|jpegquality-80")
        return url

    description = models.TextField(null=True, blank=True, help_text="Description of this entity")

    card_color = models.CharField(
        max_length=20,
        choices=COLOR_CHOICES,
        default="card__bg-blue",
        blank=True,
        help_text="Background color in the overview pages",
    )

    content_panels = BasePage.content_panels + [
        FieldPanel("thumbnail"),
        FieldPanel("description"),
        FieldPanel("card_color"),
    ]

    class Meta:
        abstract = True
