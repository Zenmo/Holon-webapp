from django.db import models
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _


class Scenario(ClusterableModel):
    name = models.CharField(max_length=255)
    version = models.IntegerField()
    comment = models.TextField(blank=True)

    panels = [
        FieldPanel("name"),
        FieldPanel("version"),
        FieldPanel("comment"),
        InlinePanel(
            "anylogic_config",
            heading="Anylogic cloudclient configuration",
            label="Anylogic cloudclient configuration",
            max_num=1,
        ),
        InlinePanel(
            "etm_scaling_config",
            heading="ETM scaling module configuration",
            label="ETM scaling module configuration",
            max_num=1,
        ),
        InlinePanel(
            "etm_cost_config",
            heading="ETM cost module configuration",
            label="ETM cost module configuration",
            max_num=1,
        ),
    ]

    class Meta:
        verbose_name = "Scenario"

    def __str__(self):
        return f"{self.name} - versie {self.version}"
