from django.db import models

from holon.models.payload import Payload
from polymorphic.models import PolymorphicModel


class Policy(PolymorphicModel):
    parameter = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    unit = models.CharField(max_length=255, null=True, blank=True)
    comment = models.TextField()
    payload = models.ForeignKey(Payload, on_delete=models.CASCADE, related_name="gridconnections")
