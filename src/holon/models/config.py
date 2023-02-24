from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _


from holon.models.scenario import Scenario
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey


class AnylogicCloudConfig(ClusterableModel):
    """top level model for AnyLogic cloudclient connection configuration"""

    api_key = models.CharField(max_length=40)
    url = models.URLField(max_length=100, default="https://engine.holontool.nl")
    model_name = models.CharField(max_length=100)
    model_version_number = models.IntegerField(
        help_text=_("Use this field to define the AnyLogic Cloud model version number")
    )
    scenario = ParentalKey(Scenario, related_name="anylogic_config")

    owner_email = models.EmailField(
        help_text=_("This will be used to send the owner emails when things break")
    )  # use this later for sending error emails

    panels = [
        FieldPanel("api_key"),
        FieldPanel("url"),
        FieldPanel("model_name"),
        FieldPanel("model_version_number"),
        FieldPanel("scenario"),
        InlinePanel(
            "anylogic_cloud_output",
            heading="Cloud Output mapping",
            label="Use these features to map the outputs of AnyLogic results to internal keys",
            min_num=1,
        ),
        InlinePanel(
            "anylogic_cloud_input",
            heading="Additional AnyLogic Cloud inputs",
            label="Optionally use this feature to supply additional operational arguments in JSON form",
        ),
    ]

    class Meta:
        verbose_name = "Anylogic cloudclient configuratie"

    def clean(self) -> None:
        # TODO use holon.cloud.client to validate:
        # 1) API access for model
        # 2) Specified model version

        pass

    def __str__(self):
        return f"{self.model_name} / version {self.model_version_number}"


class AnylogicCloudInput(models.Model):
    """supports configurable mapping from AnyLogic resuls to guaranteed internal keys"""

    anylogic_key = models.CharField(max_length=100)
    anylogic_value = models.JSONField()  # unsure if we should allow this

    anylogic_model_configuration = ParentalKey(
        AnylogicCloudConfig, on_delete=models.CASCADE, related_name="anylogic_cloud_input"
    )

    def __str__(self) -> str:
        return f"{self.anylogic_key}"


class AnylogicCloudOutput(models.Model):
    """supports configurable mapping from AnyLogic resuls to guaranteed internal keys"""

    anylogic_key = models.CharField(
        max_length=50, help_text=_("Key as provided in the AnyLogic Cloud response JSON")
    )
    internal_key = models.CharField(
        max_length=50, help_text=_("Key that is used internally to access the data associated with this AnyLogic key")
    )

    anylogic_model_configuration = ParentalKey(
        AnylogicCloudConfig, on_delete=models.CASCADE, related_name="anylogic_cloud_output"
    )

    def __str__(self) -> str:
        return f"{self.internal_key}"


class ETMScalingConfig(models.Model):
    etm_scenario_id = models.IntegerField()
    scenario = ParentalKey(Scenario, related_name="etm_scaling_config")

    panels = []

    class Meta:
        verbose_name = "ETM opschalingsconfiguratie"

    def __str__(self):
        pass


class ETMCostConfig(models.Model):
    scenario = ParentalKey(Scenario, related_name="etm_cost_config")

    panels = []

    class Meta:
        verbose_name = "Kostenmodule configuratie"

    def __str__(self):
        pass


class CostBenifitConfig(models.Model):
    # casus

    panels = []

    class Meta:
        verbose_name = "Kosten&baten configuratie"

    def __str__(self):
        pass
