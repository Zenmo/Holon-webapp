import copy
import json
from pathlib import Path
from typing import TypeVar, Union

from django.db import models
from django.db.models import Model
from django.db import models
from django.db.migrations.operations.models import ModelOptionOperation
from polymorphic.managers import PolymorphicQuerySet
from polymorphic import utils
from django.apps import apps

base_path = Path(__file__).parent.parent / "services" / "jsons"
base_path.mkdir(exist_ok=True, parents=True)


def write_payload_to_jsons(payload_dict: dict, name: str) -> None:
    for key, json_output in payload_dict.items():
        variable_filename = f"{name}_{key}.json"
        fp = base_path / variable_filename
        with open(fp, "w") as outfile:
            json.dump(json_output, outfile, indent=2)


def all_subclasses(cls) -> set[Model]:
    return set(cls.__subclasses__()).union(
        [s for c in cls.__subclasses__() for s in all_subclasses(c)]
    )


def duplicate_model(obj, attrs={}):
    obj.pk = None
    obj.id = None

    clear_base_pointer(obj)

    # modify attributes
    for key, value in attrs.items():
        setattr(obj, key, value)

    obj.save()
    return obj


TModel = TypeVar("TModel", bound=Model)


def duplicate_model_nomutate(source: TModel) -> TModel:
    # shallow copy
    destination = copy.copy(source)
    destination.pk = None
    destination.id = None

    clear_base_pointer(destination)

    return destination


# What I suspect this does:
# Django polymorphic has an internal one-to-one relation to the base table.
# This function clears that relation so that we can save a copied object
# as an independent object and retain the source object.
# see https://stackoverflow.com/a/74999379/19602496
def clear_base_pointer(obj: Model):
    for field in obj._meta.get_fields(include_parents=True):
        if not isinstance(field, models.OneToOneField):
            continue

        # Test this is a pointer to something in our own inheritance tree
        if not isinstance(obj, field.related_model):
            continue

        setattr(obj, field.attname, None)


def reset_obj(obj, attributes: dict = {}):
    """Reset an object"""
    obj.pk = None
    obj.id = None

    # for copying polymorphic models with multiple levels of inheritance
    # https://stackoverflow.com/a/74999379/19602496
    for field in obj._meta.get_fields(include_parents=True):
        if not isinstance(field, models.OneToOneField):
            continue

        # Test this is a pointer to something in our own inheritance tree
        if not isinstance(obj, field.related_model):
            continue

        setattr(obj, field.attname, None)

    # modify attributes
    for key, value in attributes.items():
        setattr(obj, key, value)

    return obj


def bulk_duplicate(queryset: PolymorphicQuerySet, attributes: dict = {}):
    """Duplicate multiple models at once. This invalidates the objects in the original queryset"""

    if not queryset:
        return

    class_types = set([model.__class__ for model in queryset])
    print(class_types)

    class_dict = dict.fromkeys(class_types, [])

    for obj in queryset:
        class_dict[obj.__class__].append(obj)

    print(class_dict)

    for class_type, objs in class_dict.items():
        objs = [reset_obj(obj, attributes) for obj in objs]

        class_type.objects.bulk_create(objs)


class RemoveModelBasesOptions(ModelOptionOperation):
    def __init__(self, name):
        super().__init__(name)

    def deconstruct(self):
        kwargs = {
            "name": self.name,
        }
        return (self.__class__.__qualname__, [], kwargs)

    def state_forwards(self, app_label, state):
        from ..models.filter import Filter

        model_state = state.models[app_label, self.name_lower]
        model_state.bases = (Filter,)
        state.reload_model(app_label, self.name_lower, delay=True)

    def database_forwards(self, app_label, schema_editor, from_state, to_state):
        pass

    def database_backwards(self, app_label, schema_editor, from_state, to_state):
        pass

    def describe(self):
        return "Remove bases from the model %s" % self.name

    @property
    def migration_name_fragment(self):
        return "remove_%s_bases" % self.name_lower


def is_exclude_field(field):
    if field.name.endswith("_ptr"):
        # Exclude iternal polymorphic attributes for CMS
        return True
    if field.name == "polymorphic_ctype":
        # Exclude iternal polymorphic attributes for CMS
        return True
    if field.is_relation and hasattr(field, "field") and field.field.name.endswith("_ptr"):
        # Exclude iternal polymorphic attributes of relations for CMS
        return True
    else:
        return False


def get_relation_model(
    rule: "ScenarioRule", relation_field: str, relation_field_subtype: str
) -> models.Model:
    """Helper function to get model class of selected relation"""
    model_type = rule.model_subtype if rule.model_subtype else rule.model_type
    model = apps.get_model("holon", model_type)

    relation_model_type = (
        relation_field_subtype
        if relation_field_subtype
        else model._meta.get_field(relation_field).related_model.__name__
    )

    return apps.get_model("holon", relation_model_type)


def relation_field_options(rule: "ScenarioRule") -> list[str]:
    model_type = rule.model_type if rule.model_subtype is None else rule.model_subtype
    model = apps.get_model("holon", model_type)

    return [
        field.name
        for field in model()._meta.get_fields()
        if field.is_relation and not is_exclude_field(field)
    ]


def relation_field_subtype_options(rule: "ScenarioRule", relation_field: str) -> list[str]:
    model = apps.get_model("holon", rule.model_type)
    related_model = model()._meta.get_field(relation_field).related_model

    return [subclass.__name__ for subclass in all_subclasses(related_model)]


def is_allowed_relation(field_name: str) -> bool:
    # group and subgroup of Actor have stable id's, so they can be used for filtering
    return field_name == "group" or field_name == "subgroup"


def serialize_add_models(asset_to_add, gridconnection_to_add, contract_to_add) -> tuple[str]:
    """Serialize util function for ruleactionadd hashing"""
    from holon.serializers.datamodel.mapper import (
        EnergyAssetPolymorphicSerializer,
        GridConnectionPolymorphicSerializer,
        ContractPolymorphicSerializer,
    )

    asset_json = (
        json.dumps(EnergyAssetPolymorphicSerializer(asset_to_add).data) if asset_to_add else ""
    )
    gridconnection_json = (
        json.dumps(GridConnectionPolymorphicSerializer(gridconnection_to_add).data)
        if gridconnection_to_add
        else ""
    )
    contract_json = (
        json.dumps(ContractPolymorphicSerializer(contract_to_add).data) if contract_to_add else ""
    )

    return asset_json, gridconnection_json, contract_json


def is_scenario_object_relation_field(field: Union[models.Field, models.ForeignObjectRel]) -> bool:
    """
    Test if a field is a relation field related to the models that are connected to a Scenario.

    Relation field list requirements:
     - be a relation
     - have a delete policy
     - not be a reference to polymorphic parents ( parent_link )
     - be part of the scenario aggregate ( no fields referencing rules )
    """
    from holon.models.scenario_rule import ModelType

    return (
        field.is_relation
        and hasattr(field, "on_delete")
        and field.parent_link == False
        and getattr(utils.get_base_polymorphic_model(field.related_model), "__name__", None)
        in ModelType.values
    )
