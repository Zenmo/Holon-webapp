import logging

from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

from holon.models.scenario_rule import ScenarioRule


# Create your models here.
class Factor(PolymorphicModel):
    """Abstract base class for factors"""

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")
    rule = models.ForeignKey(ScenarioRule, on_delete=models.CASCADE)

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    def clean(self):
        super().clean()

        if not (
            self.asset_attribute == "asset_attribute_not_supplied"
            or self.asset_attribute in self.asset_attributes_options()
        ):
            raise ValidationError("Invalid value asset_attribute")

    def asset_attributes_options(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

    def map_factor_value(self, value: str):
        """Process an input value with the factors parameters and return a new value"""
        pass


# class DiscreteFactor(Factor):
#     """A discrete factor for setting the value of an attribute"""

#     class Meta:
#         verbose_name = "DiscreteFactor"

#     def map_factor_value(self, value: str):
#         """Return the factors own value"""
#         return value


# class ContinuousFactor(Factor):
#     """A continuous factor for scaling an input value between a certain range"""

#     min_value = models.IntegerField()
#     max_value = models.IntegerField()

#     class Meta:
#         verbose_name = "ContinuousFactor"

#     def map_factor_value(self, value: str):
#         """Rescale a value to the min and max values of this factor"""

#         try:
#             value_flt = float(value)
#         except:
#             logging.warning(
#                 f"Value '{value}' could not be parsed to a float, setting to default value to 0.0"
#             )
#             value_flt = 0.0

#         return (self.max_value - self.min_value) * (value_flt / 100) + self.min_value
