from django.db import models
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


class SnippetBase(models.Model):
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
