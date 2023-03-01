from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.scenario import Scenario


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
    group = models.CharField(max_length=255, choices=Group.choices, null=True, blank=True)
    subgroup = models.CharField(max_length=255, choices=SubGroup.choices, null=True, blank=True)
    parent_actor = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    def __str__(self):
        try:
            string = f"{self.type.lower()[:3]}{self.id} ({self.category})"
        except:
            string = f"actor{self.id} ({self.category})"

        return string


class NonFirmActor(Actor):
    nfATO_capacity_kw = models.FloatField()
    nfATO_starttime = models.FloatField()
    nfATO_endtime = models.FloatField()
