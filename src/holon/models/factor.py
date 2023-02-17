from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

from holon.models.scenario_rule import ScenarioRule


# Create your models here.
class Factor(models.Model):

    # asset = models.ForeignKey("holon.asset", on_delete=models.CASCADE, related_name="+")
    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")

    # grid_connection = models.ForeignKey(
    #     "holon.gridconnection", on_delete=models.CASCADE, related_name="+"
    # )

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    rule = models.ForeignKey(ScenarioRule, on_delete=models.CASCADE, related_name="factors")

    panels = [
        FieldPanel("asset_attribute"),
        FieldPanel("min_value"),
        FieldPanel("max_value"),
    ]

    class Meta:
        verbose_name = "Factors"

    # def __str__(self):
    #     if self.asset is not None and self.grid_connection is not None:
    #         return self.asset.type + "-" + self.grid_connection.type
    #     else:
    #         return self

    def clean(self):
        super().clean()

        if not (
            self.asset_attribute == "asset_attribute_not_supplied"
            or self.asset_attribute in self.asset_attributes_values()
        ):
            raise ValidationError("Invalid value asset_attribute")

    def asset_attributes_values(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]
