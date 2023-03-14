from django.apps import apps

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models.query import QuerySet

from polymorphic.models import PolymorphicModel

from wagtail.admin.edit_handlers import FieldPanel

# Don't forget to register new actions in get_actions() of ScenarioRule


class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    class Meta:
        verbose_name = "RuleAction"
        # abstract = True

    def clean(self):
        super().clean()

        try:
            if not (
                self.asset_attribute == "asset_attribute_not_supplied"
                or self.asset_attribute in self.asset_attributes_options()
            ):
                raise ValidationError("Invalid value asset_attribute")
        except ObjectDoesNotExist:
            return

    def asset_attributes_options(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """Apply a rule action to an object in the queryset"""
        pass
