from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _

from holon.models.scenario import Scenario
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey


class QueryCovertModuleType(models.TextChoices):
    UPSCALING = "upscaling"
    COST = "cost"
    COSTBENEFIT = "costbenefit"


class QueryAndConvertConfig(ClusterableModel):
    scenario = ParentalKey(Scenario, related_name="query_and_convert_config")
    module = models.CharField(max_length=255, choices=QueryCovertModuleType.choices)
    name = models.CharField(max_length=255, null=False, blank=True)

    api_url = models.URLField(
        default="https://beta-engine.energytransitionmodel.com/api/v3/scenarios/"
    )
    etm_scenario_id = models.IntegerField()

    panels = [
        FieldPanel("name"),
        FieldPanel("api_url"),
        FieldPanel("module"),
        FieldPanel("etm_scenario_id"),
        InlinePanel(
            "etm_query",
            heading="Define your input and query statements here",
            label="ETM query/input statement",
            min_num=1,
        ),
        InlinePanel(
            "key_value_pair_collection",
            heading="Define local key-value pairs here",
            label="Local variables",
            max_num=1,
        ),
    ]

    def __str__(self):
        if self.module == QueryCovertModuleType.UPSCALING:
            return f"ETM opschalingsconfiguratie ({self.name})"
        if self.module == QueryCovertModuleType.COST:
            return f"Kostenmodule configuratie ({self.name})"
        if self.module == QueryCovertModuleType.COSTBENEFIT:
            return f"Kosten&Baten configuratie ({self.name})"

        raise NotImplementedError(f"__str__ is not implemented for {self.module}")
