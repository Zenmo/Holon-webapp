from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.actor import Actor


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
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    def __str__(self):
        return f"c{self.id} - {self.type.lower()}"
