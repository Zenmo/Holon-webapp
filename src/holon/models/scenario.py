from django.db import models


class Scenario(models.Model):
    name = models.CharField(max_length=255)
    etm_scenario_id = models.IntegerField()

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return self.name
