# from __future__ import annotations
# from typing import TYPE_CHECKING

from holon.models.scenario import Scenario
from holon.rule_engine.repositories import (
    ActorRepository,
    EnergyAssetRepository,
    ContractRepository,
    GridConnectionRepository,
    GridNodeRepository,
    PolicyRepository,
)
from django.apps import apps
from django.db import models
from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator

from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from holon.models.scenario_rule import ModelType
from polymorphic import utils
from polymorphic.models import PolymorphicModel
from holon.models.util import is_scenario_object_relation_field


class ScenarioAggregate:
    """Aggregate containing scenario and related models in memory"""

    def __init__(self, scenario: Scenario):
        self.scenario = scenario

        self.repositories: dict[str, RepositoryBaseClass] = {
            ModelType.ACTOR.value: ActorRepository.from_scenario(self.scenario),
            ModelType.ENERGYASSET.value: EnergyAssetRepository.from_scenario(self.scenario),
            ModelType.CONTRACT.value: ContractRepository.from_scenario(self.scenario),
            ModelType.POLICY.value: PolicyRepository.from_scenario(self.scenario),
            ModelType.GRIDCONNECTION.value: GridConnectionRepository.from_scenario(self.scenario),
            ModelType.GRIDNODE.value: GridNodeRepository.from_scenario(self.scenario),
        }

    def get_repository_for_model_type(
        self, model_type_name: str, model_subtype_name: str = ""
    ) -> RepositoryBaseClass:
        """Get the correct repository based on the model type name"""

        if not model_type_name in self.repositories:
            raise Exception(f"ScenarioAggregate: Not implemented model type name {model_type_name}")

        cloned_repository = self.repositories[model_type_name].clone()

        if model_subtype_name and model_subtype_name != model_type_name:
            model_subtype = apps.get_model("holon", model_subtype_name)
            cloned_repository = cloned_repository.filter_model_subtype(model_subtype)

        return cloned_repository

    def get_repository_for_relation_field(
        self, model_type_name: str, relation_field_name: str, model_subtype_name: str = ""
    ) -> RepositoryBaseClass:
        """Get the correct repository based on the relation field of a model type"""

        model = apps.get_model("holon", model_type_name)
        relation_model_class = model()._meta.get_field(relation_field_name).related_model
        relation_model_base_name = utils.get_base_polymorphic_model(relation_model_class).__name__

        return self.get_repository_for_model_type(relation_model_base_name, model_subtype_name)

    def add_object(
        self, object: PolymorphicModel, base_model_type="", additional_attributes: dict = {}
    ):
        """Add an object to self in the correct repository"""

        if not base_model_type:
            base_model_type = utils.get_base_polymorphic_model(object.__class__).__name__

        for key, value in additional_attributes.items():
            setattr(object, key, value)

        self.repositories[base_model_type].add(object)

    def remove_object(self, object: PolymorphicModel, base_model_type=""):
        """Remove object from self including related models according to deletion policy"""

        if not base_model_type:
            base_model_type = utils.get_base_polymorphic_model(object.__class__).__name__

        relation_fields = [
            field
            for field in object.__class__._meta.get_fields()
            if is_scenario_object_relation_field(field)
        ]

        for field in relation_fields:
            related_model_repository = self.get_repository_for_relation_field(
                base_model_type, field.name
            )
            relation_field_attribute = field.field.name + "_id"
            related_objects = related_model_repository.filter_attribute_value(
                relation_field_attribute, AttributeFilterComparator.EQUAL.value, object.id
            ).all()

            for related_object in related_objects:
                if field.on_delete == models.CASCADE:
                    self.remove_object(
                        self, related_object, related_model_repository.base_model_type.__name__
                    )
                elif field.on_delete == models.SET_NULL:
                    setattr(related_object, relation_field_attribute, None)
                    self.repositories[related_model_repository.base_model_type.__name__].update(
                        related_object
                    )
                elif field.on_delete == models.PROTECT:
                    raise models.ProtectedError(
                        f"Cannot remove object, because {relation_field_attribute} is protected",
                        related_object,
                    )
                elif field.on_delete == models.RESTRICT:
                    raise models.RestrictedError(
                        f"Cannot remove object, because {relation_field_attribute} is restricted",
                        related_object,
                    )
                elif field.on_delete == models.DO_NOTHING:
                    pass
                else:
                    raise NotImplementedError(
                        f"No functionality implemented for on_delete {field.on_delete}"
                    )

        self.repositories[base_model_type].remove(object.id)

        return self

    def serialize_to_json(self) -> dict:
        """Serialize scenario to json with embedded relations"""
        from holon.serializers import ScenarioV2Serializer

        scenario_tree = self.__to_tree()
        # TODO rename after rule engine update
        json_data = ScenarioV2Serializer(scenario_tree).data

        return json_data

    def __to_tree(self):
        """Convert scenario to a tree structure"""
        tree = self.scenario

        actor_lookup = self.repositories[ModelType.ACTOR.value].dict()
        gridnode_lookup = self.repositories[ModelType.GRIDNODE.value].dict()

        contracts = self.repositories[ModelType.CONTRACT.value].all()
        for contract in contracts:
            contract.contractScope = actor_lookup[contract.contractScope_id]

        tree.actors = self.repositories[ModelType.ACTOR.value].all()
        for actor in tree.actors:
            actor.contract_list = [
                contract for contract in contracts if contract.actor_id == actor.id
            ]

        tree.gridnodes = self.repositories[ModelType.GRIDNODE.value].all()
        for gridnode in tree.gridnodes:
            if gridnode.owner_actor_id:
                gridnode.owner_actor = actor_lookup[gridnode.owner_actor_id]
            if gridnode.parent_id:
                gridnode.parent = gridnode_lookup[gridnode.parent_id]

            gridnode.energyasset_list = [
                asset
                for asset in self.repositories[ModelType.ENERGYASSET.value].all()
                if asset.gridnode_id == gridnode.id
            ]

        tree.gridconnections = self.repositories[ModelType.GRIDCONNECTION.value].all()
        for gridconnection in tree.gridconnections:
            if gridconnection.owner_actor_id:
                gridconnection.owner_actor = actor_lookup[gridconnection.owner_actor_id]
            if gridconnection.parent_heat_id:
                gridconnection.parent_heat = gridnode_lookup[gridconnection.parent_heat_id]
            if gridconnection.parent_electric:
                gridconnection.parent_electric = gridnode_lookup[gridconnection.parent_electric_id]

            gridconnection.energyasset_list = [
                asset
                for asset in self.repositories[ModelType.ENERGYASSET.value].all()
                if asset.gridconnection_id == gridconnection.id
            ]

        tree.policies = self.repositories[ModelType.POLICY.value].all()

        return tree
