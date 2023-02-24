from django.db import models


class Scenario(models.Model):
    name = models.CharField(max_length=255)
    version = models.IntegerField()
    comment = models.TextField(blank=True)

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return f"{self.name} - versie {self.version}"
