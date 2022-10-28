from django.db import models

# Create your models here.


class ScenarioTag(models.Model):
    name = models.CharField(max_length=255)
    model_name = models.CharField(max_length=255)
    config_file = models.ForeignKey(
        "customdocument.CustomDocument",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    timestep_hours = models.DecimalField(decimal_places=2, max_digits=4)
    force_uncached = models.BooleanField()
    show_progress = models.BooleanField()
    parallelize = models.BooleanField()
    log_exceptions = models.BooleanField()

    class Meta:
        verbose_name = "Scenario tags"

    def __str__(self):
        return self.name
