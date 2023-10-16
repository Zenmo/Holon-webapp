from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.scenario_root import Scenario


class ActorGroup(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class ActorSubGroup(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name


class ActorType(models.TextChoices):
    OPERATORGRID = "OPERATORGRID"
    GOVHOLON = "GOVHOLON"
    HOLONENERGY = "HOLONENERGY"
    CONNECTIONOWNER = "CONNECTIONOWNER"
    SUPPLIERENERGY = "SUPPLIERENERGY"


class Group(models.TextChoices):
    COMMERCIAL = "COMMERCIAL"
    HOUSEHOLD = "HOUSEHOLD"


class SubGroup(models.TextChoices):
    RICH = "RICH"
    POOR = "POOR"
    REGULAR = "REGULAR"


class Actor(PolymorphicModel):
    category = models.CharField(max_length=255, choices=ActorType.choices)
    payload = models.ForeignKey(
        Scenario, on_delete=models.CASCADE, null=True, blank=True
    )  # can be null for template gridconnections
    group = models.ForeignKey(ActorGroup, on_delete=models.SET_NULL, blank=True, null=True)
    subgroup = models.ForeignKey(ActorSubGroup, on_delete=models.SET_NULL, blank=True, null=True)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    original_id = models.BigIntegerField(
        null=True,
        blank=True,
        help_text=_("This field is used as a reference for cloned models. Don't set it manually"),
    )

    def __str__(self):
        try:
            string = f"{self.type.lower()[:3]}{self.id} ({self.category})"
        except:
            string = f"actor{self.id} ({self.category})"

        return string
