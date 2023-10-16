from holon.models.scenario.asset import EnergyAsset
from holon.models.scenario.contract import Contract
from holon.models.scenario.gridconnection import GridConnection
from holon.models.scenario.actor import Actor
from holon.models.scenario.gridnode import GridNode
from holon.models.scenario import Scenario
from django.apps import apps

from polymorphic import utils
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
            return [(Actor, "owner_actor"), (Scenario, "payload")]

        if base_class == Contract:
            return [(Actor, "actor")]

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

    def get_base_polymorphic_model(ChildModel, allow_abstract=False):
        """
        First the first concrete model in the inheritance chain that inherited from the PolymorphicModel.
        """
        model = utils.get_base_polymorphic_model(ChildModel)

        if model is None:
            # Return normal class if not polymorphic
            return ChildModel
        return model

    def get_gridconnection_children(
        gridconnection: GridConnection,
    ) -> tuple[list[EnergyAsset], Actor, list[Contract]]:
        """Retrieve all related children of the given gridconnection"""
        assets = gridconnection.energyasset_set.get_real_instances()
        actor = gridconnection.owner_actor
        actor_contracts = actor.contracts.get_real_instances() if actor else []

        return assets, actor, actor_contracts
