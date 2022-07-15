from django.db import models
from jsonfield import JSONField


class Calculation(models.Model):
    """
    Model describing a rating
    """

    neighbourhood1 = JSONField
    neighbourhood2 = JSONField
    heatholon = models.BooleanField()
    windholon = models.BooleanField()

    def __str__(self):
        return "A calculation model interface"
