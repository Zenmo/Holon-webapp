from django.db import models
from polymorphic.models import PolymorphicModel
from django.utils.translation import gettext_lazy as _

from holon.models.actor import Actor
from holon.models.scenario import Scenario


class EnergyType(models.TextChoices):
    ELECTRICITY = "ELECTRICITY"
    HEAT = "HEAT"


class GridNode(PolymorphicModel):
    owner_actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    capacity_kw = models.FloatField()
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )


class ElectricGridType(models.TextChoices):
    MSLS = "MSLS"
    HSMS = "HSMS"


class ElectricGridNode(GridNode):
    type = models.CharField(max_length=4, choices=ElectricGridType.choices)
    category = "ELECTRICITY"

    def __str__(self):
        return f"E{self.id}"


class HeatGridType(models.TextChoices):
    MT = "MT"
    HT = "HT"
    LT = "LT"


class HeatGridNode(GridNode):
    type = models.CharField(max_length=2, choices=HeatGridType.choices)
    category = "HEAT"

    def __str__(self):
        return f"H{self.id} ({self.type})"
