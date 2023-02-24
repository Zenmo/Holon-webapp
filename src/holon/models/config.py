from django.db import models
from wagtail.admin.edit_handlers import FieldPanel


from holon.models.scenario import Scenario



class AnylogicCloudConfig(models.Model):
    """ top level model for AnyLogic cloudclient connection configuration """

    api_key = models.CharField(max_length=40)
    url = models.CharField(max_length=100, default="https://engine.holontool.nl") 
    model_name = models.CharField(max_length=100)
    model_version_number = models.IntegerField()
    scenario = models.ForeignKey(Scenario)

    owner_email = models.EmailField() # use this later for sending error emails

    panels = [ 
        FieldPanel(None),
    ]

    class Meta:
        verbose_name = "Anylogic clouldclient configuratie"

    def __str__(self):
        return f"{self.model_name} / version {self.model_version_number}"


class AnylogicCloudInput(models.Model):
    
    anylogic_key = models.CharField(max_length=100)
    anylogic_value = models.JSONField() # unsure

    anylogic_model_configuration = models.ForeignKey(AnylogicCloudConfig, verbose_name=AnylogicCloudConfig.__str__(), on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.anylogic_key}"

class AnylogicCloudOutput(models.Model):
    """ supports configurable mapping from AnyLogic resuls to guaranteed internal keys """

    anylogic_key = models.CharField(max_length=100)
    internal_key = models.CharField(max_length=100)

    anylogic_model_configuration = models.ForeignKey(AnylogicCloudConfig, verbose_name=AnylogicCloudConfig.__str__(), on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{self.internal_key}"

class ETMScalingConfig(models.Model):

    etm_scenario_id = models.IntegerField()

    panels = [
        FieldPanel(None),
    ]

    class Meta:
        verbose_name = "ETM opschalingsconfiguratie"

    def __str__(self):
        pass

class ETMCostConfig(models.Model):

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")
    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = [
        FieldPanel(None),
    ]

    class Meta:
        verbose_name = "Kostenmodule configuratie"

    def __str__(self):
        pass

class CostBenifitConfig(models.Model):

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")
    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = [
        FieldPanel(None),
    ]

    class Meta:
        verbose_name = "Kosten&baten configuratie"

    def __str__(self):
        pass

