from django.db import models
from holon.models.asset import EnergyAsset
from holon.models.contract import Contract
from holon.models.gridconnection import GridConnection
from holon.models.actor import Actor
from holon.models.gridnode import GridNode
from django.apps import apps
from django.forms import ModelForm

from polymorphic import utils
from holon.models.scenario_rule import ScenarioRule
from holon.models.util import all_subclasses


class RuleActionUtils:
    """Collection to select a class that is addable/balanceable in a RuleAction"""

    def get_parent_classes_and_field_names(model_type: type) -> list[tuple[type, str]]:
        """
        Get the class type(s) and field name(s) of the foreign key fields of the class type.
        """

        base_class = utils.get_base_polymorphic_model(model_type)

        if base_class == EnergyAsset:
            return [(GridConnection, "gridconnection"), (GridNode, "gridnode")]

        if base_class == GridConnection:
            return [(Actor, "owner_actor")]

        if base_class == Contract:
            return [(Actor, "owner_actor")]

    def get_balanceable_subtypes() -> list[str]:
        """Get all possible subclass types for the balanceable models"""

        base_classes = [EnergyAsset, GridConnection, Contract]
        choices = []

        for base_class in base_classes:
            model = apps.get_model("holon", base_class.__name__)
            choices = choices + [
                (subclass.__name__, subclass.__name__) for subclass in all_subclasses(model)
            ]

        return choices

    def get_model_attributes_options(rule: ScenarioRule) -> list[str]:
        """Get the possible asset attributes for a certain model type"""

        model_type = rule.model_type if rule.model_subtype is None else rule.model_subtype
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]
