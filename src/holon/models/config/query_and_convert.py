from django.db import models
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

from holon.models.scenario import Scenario
from main.blocks.rich_text_block import RichtextBlock


class QueryCovertModuleType(models.TextChoices):
    UPSCALING = "upscaling"
    UPSCALING_REGIONAL = "upscaling-regional"
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

    interactive_upscaling_comment = models.TextField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_(
            "Use this field to explain the query in the front-end. This field is rendered next to the KPI selection radio (that toggles between local, intermediate and national level)"
        ),
    )
    generic_etm_query = models.ManyToManyField(
        "holon.GenericETMQuery",
        blank=True,
        help_text=_("Use this field to relate this module configuration to a generic ETM query."),
    )

    panels = [
        FieldPanel("name"),
        FieldPanel("api_url"),
        FieldPanel("module"),
        FieldPanel("etm_scenario_id"),
        FieldPanel("interactive_upscaling_comment"),
        FieldPanel("generic_etm_query"),
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
            return f"ETM nationale opschalingsconfiguratie ({self.name})"
        if self.module == QueryCovertModuleType.UPSCALING_REGIONAL:
            return f"ETM regionale opschalingsconfiguratie ({self.name})"
        if self.module == QueryCovertModuleType.COST:
            return f"Kostenmodule configuratie ({self.name})"
        if self.module == QueryCovertModuleType.COSTBENEFIT:
            return f"Kosten&Baten configuratie ({self.name})"

        raise NotImplementedError(f"__str__ is not implemented for {self.module}")
