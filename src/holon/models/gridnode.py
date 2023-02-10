from django.db import models
from holon.models.actor import Actor

from holon.models.scenario import Scenario
from polymorphic.models import PolymorphicModel


class EnergyType(models.TextChoices):
    electricity = "ELECTRICITY"
    heat = "HEAT"


class GridNode(PolymorphicModel):
    owner_actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    capacity_kw = models.FloatField()
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)


class ElectricGridType(models.TextChoices):
    msls = "MSLS"
    hsms = "HSMS"


class ElectricGridNode(GridNode):
    type = models.CharField(max_length=4, choices=ElectricGridType.choices)
    category = "ELECTRICITY"


class HeatGridType(models.TextChoices):
    mt = "MT"
    ht = "HT"


class HeatGridNode(GridNode):
    type = models.CharField(max_length=2, choices=HeatGridType.choices)
    category = "HEAT"
