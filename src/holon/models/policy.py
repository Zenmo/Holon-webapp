from django.db import models
from polymorphic.models import PolymorphicModel
from django.utils.translation import gettext_lazy as _

from holon.models.scenario import Scenario


class Policy(PolymorphicModel):
    name = models.CharField(max_length=255, blank=True, null=True)
    parameter = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    unit = models.CharField(max_length=255, null=True, blank=True)
    comment = models.TextField()
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)
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
        return f"p{self.id}{' - ' + self.name if self.name else ''}"
