from django.db import models
from polymorphic.models import PolymorphicModel

from holon.models.scenario import Scenario


class Policy(PolymorphicModel):
    parameter = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    unit = models.CharField(max_length=255, null=True, blank=True)
    comment = models.TextField()
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)
