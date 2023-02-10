from django.db import models
from holon.models.actor import Actor

from holon.models.scenario import Scenario
from polymorphic.models import PolymorphicModel


class EnergyType(models.TextChoices):
    ELECTRICITY = "ELECTRICITY"
    HEAT = "HEAT"


class GridNode(PolymorphicModel):
    owner_actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    capacity_kw = models.FloatField()
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)


class ElectricGridType(models.TextChoices):
    MSLS = "MSLS"
    HSMS = "HSMS"


class ElectricGridNode(GridNode):
    type = models.CharField(max_length=4, choices=ElectricGridType.choices)
    category = "ELECTRICITY"


class HeatGridType(models.TextChoices):
    MT = "MT"
    HT = "HT"


class HeatGridNode(GridNode):
    type = models.CharField(max_length=2, choices=HeatGridType.choices)
    category = "HEAT"
