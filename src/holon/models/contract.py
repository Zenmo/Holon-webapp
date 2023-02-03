from django.db import models

from holon.models.actor import Actor
from polymorphic.models import PolymorphicModel


class ContractType(models.TextChoices):
    DEFAULT = "DEFAULT"
    FIXED = "FIXED"
    VARIABLE = "VARIABLE"
    DYNANMICDAYAHEAD = "DYNANMICDAYAHEAD"
    GOPACS = "GOPACS"
    NONFIRM = "NONFIRM"
    NODALPRICING = "NODALPRICING"


class ContractScope(models.TextChoices):
    ENERGYSUPPLIER = "ENERGYSUPPLIER"
    GRIDOPERATOR = "GRIDOPERATOR"
    ENERGYHOLON = "ENERGYHOLON"
    ADMINISTRATIVEHOLON = "ADMINISTRATIVEHOLON"


class Contract(PolymorphicModel):
    type = models.CharField(max_length=255, choices=ContractType.choices)
    contract_scope = models.CharField(max_length=255, choices=ContractScope.choices)
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE, related_name="contracts")
