from typing import Any
from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from polymorphic.models import PolymorphicModel
from django.db.models.query import QuerySet
from django.contrib.postgres.fields import ArrayField
from holon.models.gridconnection import GridConnection

from holon.models.scenario_rule import ScenarioRule
from holon.models.asset import EnergyAsset
from holon.models import util

import logging

# Create your models here.
class RuleAction(PolymorphicModel):
    """Abstract base class for factors"""

    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")
    rule = models.ForeignKey(ScenarioRule, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "RuleAction"
        # abstract = True

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

    def apply_action_to_queryset(
        self, queryset: QuerySet, filtered_queryset: QuerySet, value: str
    ):
        """Apply a rule action to an object in the queryset"""
        pass


class RuleActionFactor(RuleAction):
    """A continuous factor for scaling an input value between a certain range"""

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    class Meta:
        verbose_name = "RuleActionFactor"

    def apply_action_to_queryset(
        self, queryset: QuerySet, filtered_queryset: QuerySet, value: str
    ):
        """
        Apply rescaling of an atribute of filtered_object according to value.
        May throw ValueError if value cannot be parsed to float.
        """

        # rescale value according to min/max
        value_flt = float(value)
        mapped_value = (self.max_value - self.min_value) * (value_flt / 100.0) + self.min_value

        for filtered_object in filtered_queryset:

            # Find index from filtered element in prefetched queryset
            queryset_index = next(idx for idx, x in enumerate(queryset) if x.id == filtered_object.id)

            # Update object in prefetched scenario
            setattr(queryset[queryset_index], self.asset_attribute, mapped_value)


class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    class Meta:
        verbose_name = "RuleActionChangeAttribute"


class RuleActionAddRemove(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    class Meta:
        verbose_name = "RuleActionAddRemove"


class RuleActionBalanceGroup(RuleAction):
    """Blans"""

    asset_order = ArrayField(ArrayField(models.CharField(max_length=255, blank=True)))
    selected_asset = models.CharField(max_length=255, blank=True)

    def clean(self):
        super().clean()

        asset_classnames = [asset_class.__name__ for asset_class in util.all_subclasses(EnergyAsset)]
        invalid_assetnames = [ asset for asset in self.asset_order if not asset in asset_classnames ]

        if invalid_assetnames:
            raise ValidationError(f"The following asset names are not recognized: {invalid_assetnames}")

    class Meta:
        verbose_name = "RuleActionBalanceGroup"


    def apply_action_to_queryset(self, queryset: QuerySet, filtered_queryset: QuerySet, value: str):
        """
        Balance the count of a set of assets
        """
        
        target_count = int(value)

        # validate asset types in filtered_queryset
        assets_not_in_asset_order_list = [ asset for asset in filtered_queryset if not asset.__class__.__name__ in self.asset_order]
        if assets_not_in_asset_order_list:
            raise ValueError(f"The following asset names were in the filtered results, but not present in the asset order: {assets_not_in_asset_order_list}")

        # validate if filtered asset types all have same parent (gridconnection)
        gridconnection_id_set = set([filtered_object.gridconnection.id for filtered_object in filtered_queryset])
        if len(gridconnection_id_set) > 1:
            raise ValueError("All filtered assets should have the same gridconnection")
        
        gridconnection_id = gridconnection_id_set.pop()

        # get filtered assets aggregated by asset type, in the order of self.asset_order
        filtered_assets_in_order = [
            object_list for object_list in
            [
                [
                    filtered_object for filtered_object in filtered_queryset if filtered_object.__class__.__name__ == asset_name
                ] 
                for asset_name in self.asset_order
            ]
            if len(object_list) > 0
        ]
        
        # filtered asset names in balancegroup order and number of filtered asset types
        filtered_assets_in_order_types = [filtered_asset[0].__class__.__name__ for filtered_asset in filtered_assets_in_order]
        n_filtered_asset_types = len(filtered_assets_in_order_types)

        # validate target count (value)
        total_n_assets = sum([len(asset_list) for asset_list in filtered_assets_in_order])
        if target_count > total_n_assets:
            raise ValueError(f"target count cannot be larger than the total amount of assets")

        # apply balancing
        change_index = filtered_assets_in_order_types.index(self.selected_asset)
        count_at_selection = len(filtered_assets_in_order[change_index])

        count_diff = target_count - count_at_selection

        if count_diff > 0: # increase amount
            assets_to_add = [filtered_assets_in_order[change_index][0]] * (count_diff) # duplicate first item n times
            self.queryset_add_assets(gridconnection_id, queryset, assets_to_add)

            remove_index = n_filtered_asset_types-2 if change_index < n_filtered_asset_types-1 else n_filtered_asset_types-1
            assets_to_remove = []
            while len(assets_to_remove) < count_diff:
                remainder = count_diff - len(assets_to_remove)
                assets_to_remove += filtered_assets_in_order[remove_index][:remainder]
                remove_index -= 1
                # remove at index, if remove place becomse < 0 cascade upwards (remove index--)

            self.queryset_remove_assets(gridconnection_id, queryset, assets_to_remove)

        elif count_diff < 0: # decrease amount
            assets_to_remove = filtered_assets_in_order[change_index][:-count_diff]
            self.queryset_remove_assets(gridconnection_id, queryset, assets_to_remove)

            if change_index == 0: # add missing to filtered_assets_in_order[change_index+1]
                assets_to_add = [filtered_assets_in_order[change_index+1][0]] * (-count_diff) # duplicate first item n times
                self.queryset_add_assets(gridconnection_id, queryset, assets_to_add)

            else: # add missing to filtered_assets_in_order[change_index-1]
                assets_to_add = [filtered_assets_in_order[change_index-1][0]] * (-count_diff) # duplicate first item n times
                self.queryset_add_assets(gridconnection_id, queryset, assets_to_add)


    def queryset_add_assets(self, gridconnection_id: int, queryset: QuerySet, assets: list[EnergyAsset]):
        """ Add a set of assets to a gridconnection in the queryset """

        gc_queryset_index = next(idx for idx, x in enumerate(queryset) if x.id == gridconnection_id)

        for asset in assets:
            # asset.id = 0
            queryset[gc_queryset_index].energyasset_set.add(asset)


    def queryset_remove_assets(self, gridconnection_id: int, queryset: QuerySet, assets: list[EnergyAsset]):
        """ "Remove" a set of assets from a gridconnection in the queryset """

        gc_queryset_index = next(idx for idx, x in enumerate(queryset) if x.id == gridconnection_id)

        for asset in assets:
            # asset.id = 0
            queryset[gc_queryset_index].energyasset_set.remove(asset)
