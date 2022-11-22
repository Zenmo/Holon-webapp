from django.utils.translation import gettext_lazy as _
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel

# Create your models here.
class Scenario(models.Model):
    name = models.CharField(max_length=100)
    model_name = models.CharField(max_length=255)
    etm_scenario_id = models.IntegerField()
    config_file = models.ForeignKey(
        "customdocument.CustomDocument",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    timestep_hours = models.DecimalField(decimal_places=2, max_digits=4)
    force_uncached = models.BooleanField(default=False)
    show_progress = models.BooleanField(default=False)
    parallelize = models.BooleanField(default=False)
    log_exceptions = models.BooleanField(default=False)

    panels = [
        FieldPanel("name"),
        FieldPanel("model_name"),
        FieldPanel("etm_scenario_id"),
        FieldPanel("config_file"),
        FieldPanel("timestep_hours"),
        FieldPanel("force_uncached"),
        FieldPanel("show_progress"),
        FieldPanel("parallelize"),
        FieldPanel("log_exceptions"),
    ]

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return self.name
