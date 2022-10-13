from curses import meta
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel


# Create your models here.


class Slider(models.Model):
    name = models.CharField(max_length=100)

    panels = [
        FieldPanel("name"),
    ]

    class Meta:
        verbose_name = "Slider"
