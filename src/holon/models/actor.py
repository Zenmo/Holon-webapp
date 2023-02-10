from django.db import models

from holon.models.scenario import Scenario
from polymorphic.models import PolymorphicModel


class ActorType(models.TextChoices):
    GRIDOPERATOR = "GRIDOPERATOR"
    ADMINISTRATIVEHOLON = "ADMINISTRATIVEHOLON"
    ENERGYHOLON = "ENERGYHOLON"
    CONNECTIONOWNER = "CONNECTIONOWNER"
    ENERGYSUPPLIER = "ENERGYSUPPLIER"


class SubType(models.TextChoices):
    COMMERCIAL = "commercial"


class Actor(PolymorphicModel):
    category = models.CharField(max_length=255, choices=ActorType.choices)
    type = models.CharField(max_length=255, choices=SubType.choices, null=True, blank=True)
    parent_actor = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)


class NonFirmActor(Actor):
    nfATO_capacity_kw = models.FloatField()
    nfATO_starttime = models.FloatField()
    nfATO_endtime = models.FloatField()
