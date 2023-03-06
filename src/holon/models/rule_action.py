from django.apps import apps
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.query import QuerySet
from django.contrib.postgres.fields import ArrayField
from holon.models.actor import Actor
from holon.models.contract import Contract
from holon.models.gridconnection import GridConnection

from holon.models.asset import ChemicalHeatConversionAsset, ElectricHeatConversionAsset, EnergyAsset, HybridHeatCoversionAsset, TransportHeatConversionAsset, VehicleConversionAsset
from holon.models import util

from polymorphic.models import PolymorphicModel
from polymorphic import utils
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from holon.models.gridnode import GridNode

from holon.models.scenario_rule import ScenarioRule


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
            setattr(filtered_object, self.asset_attribute, mapped_value)
            filtered_object.save()


class RuleActionChangeAttribute(RuleAction):
    """A discrete factor for setting the value of an attribute"""

    class Meta:
        verbose_name = "RuleActionChangeAttribute"


class RuleActionRemove(RuleAction):
    """Remove the filtered items"""

    class Meta:
        verbose_name = "RuleActionRemove"

    def apply_action_to_queryset(self, queryset: QuerySet, filtered_queryset: QuerySet, value: str):
        """Remove the filtered items"""

        filtered_queryset.delete()


class RuleActionAdd(RuleAction):
    """Add a set asset to the filtered items"""

    def __init__(self, *args, **kwargs):
        super(RuleActionAdd, self).__init__(*args, **kwargs)

        self.__validate_and_set_model()


    def __validate_and_set_model(self):
        """ Validate the RuleActionAdd and set self variables """

        # thy shall count to one. Not zero, nor two, one is the number to which thy shalt count
        if (bool(self.asset) + bool(self.gridconnection) + bool(self.contract)) < 1:
            raise ValidationError(f"Assign an object to either the asset, gridconnection or contract field for RuleActionAdd")

        if (bool(self.asset) + bool(self.gridconnection) + bool(self.contract)) > 1:
            raise ValidationError(f"Only one of the child models can be set for RuleActionAdd")

        # choose which model type is filled in and put it in more general self.model_to_add
        if self.asset:
            assert(not (self.gridconnection or self.contract))
            self.model_to_add = self.asset

        elif self.gridconnection:
            assert(not (self.asset or self.contract))
            self.model_to_add = self.gridconnection

        elif self.contract:
            assert(not (self.asset or self.gridconnection))
            self.model_to_add = self.contract

        # get the parent type and foreign key field for the model to add
        self.valid_parent_fk_fieldname_pairs = self.__get_parent_classes_and_field_names(self.model_to_add.__class__)


    def __get_parent_classes_and_field_names(self, model_type: type) -> list[tuple[type, str]]:
        """ 
        Get the class type and field name of the foreign key fields of the child class. 
        For example, returns (GridConnection, 'gridconnection') for EnergyAsset. 
        """

        base_class = utils.get_base_polymorphic_model(model_type)

        if base_class == EnergyAsset:
            return [(GridConnection, "gridconnection")]

        if base_class == GridConnection:
            return [(Actor, "owner_actor")]
        
        if base_class  == Contract:
            return [(Actor, "owner_actor")]
    

    class Meta:
        verbose_name = "RuleActionAdd"

    # one of these should be selected
    asset = models.ForeignKey(EnergyAsset, on_delete=models.SET_NULL, null=True)
    gridconnection = models.ForeignKey(GridConnection, on_delete=models.SET_NULL, null=True)
    contract = models.ForeignKey(Contract, on_delete=models.SET_NULL, null=True)


    def apply_action_to_queryset(
        self, queryset: QuerySet, filtered_queryset: QuerySet, value: str
    ):
        """Add an asset to the first n items in the the filtered objects"""

        n = int(value)
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)
        try:
            parent_fk_field_name = next(parent_fieldname[1] for parent_fieldname in self.valid_parent_fk_fieldname_pairs if parent_type == parent_fieldname[0])
        except:
            raise ValueError(f"Parent type {parent_type} is not a valid parent for selected model type {self.model_to_add.__class__.__name__}. {self.valid_parent_fk_fieldname_pairs}")

        # only take first n objects
        for filtererd_object in filtered_queryset[:n]:
            # add 
            util.duplicate_model(self.model_to_add, {parent_fk_field_name: filtererd_object})


class RuleActionBalanceGroup(RuleAction):
    """Blans"""

    # asset_order = models.ManyToManyField(EnergyAsset, through="BalanceGroupAssetOrder")
    selected_asset_type = models.CharField(max_length=255, blank=True)

    def clean(self):
        super().clean()

        asset_types = [asset.__class__.__name__ for asset in self.get_assets_ordered()]

        # validated selected_asset_type is in asset_order
        if not self.selected_asset_type in asset_types:
            raise ValidationError(f"Asset type selected for balancing ({self.selected_asset_type}) not in ordered asset list")

        if len(asset_types) > len(set(asset_types)):
            raise ValidationError(f"Duplicate asset types not allowed: {asset_types}")


    class Meta:
        verbose_name = "RuleActionBalanceGroup"

    def get_assets_ordered(self):
        """ Get the linked assets in order from the linking table """
        return [bgao.asset for bgao in BalanceGroupAssetOrder.objects.filter(balance_group=self).order_by('order')] 

    def apply_action_to_queryset(self, queryset: QuerySet, filtered_queryset: QuerySet, value: str):
        """
        Balance a set of assets by removing and adding assets such that a target count for the selected asset 
        is reached, but the total number of assets stays the same.
        """
        
        self.ordered_assets = self.get_assets_ordered()

        target_count = int(value)
        gridconnection = filtered_queryset[0].gridconnection

        asset_types_in_order = [asset.__class__.__name__ for asset in self.ordered_assets]

        # validate input
        self.validate_filtered_queryset(asset_types_in_order, filtered_queryset, gridconnection, target_count)

        # get filtered assets aggregated by asset type, in the order of self.asset_order
        filtered_assets_in_order = [
            [
                filtered_object for filtered_object in filtered_queryset if filtered_object.__class__.__name__ == asset_name
            ] 
            for asset_name in asset_types_in_order
        ]

        # calculate how many of each asset type should be removed/added
        target_diff_per_asset_type = self.get_target_diff_per_asset_type(asset_types_in_order, filtered_assets_in_order, target_count) 

        # apply removal/adding
        for template_asset, target_diff, filtered_assets in zip(self.ordered_assets, target_diff_per_asset_type, filtered_assets_in_order):
            if target_diff > 0:
                util.add_assets_from_template(gridconnection, template_asset, target_diff)

            if target_diff < 0:
                self.remove_assets(filtered_assets[:-target_diff])


    def validate_filtered_queryset(self, asset_types_in_order: list[str], filtered_queryset: QuerySet, gridconnection: GridConnection, target_count: int):
        """ Validate the assets in the queryset on asset type, gridconnection_id and count """

        # validate whether asset types in filtered_queryset are in the ordered list
        assets_not_in_asset_order_list = [ asset for asset in filtered_queryset if not asset.__class__.__name__ in asset_types_in_order]
        if assets_not_in_asset_order_list:
            raise ValueError(f"All filtered assets should be present in the asset order. The violating assets are: {assets_not_in_asset_order_list}")

        # validate if filtered asset types all have same parent (gridconnection)
        deviating_gridconnection_id_list = [filtered_object.gridconnection.id for filtered_object in filtered_queryset if filtered_object.gridconnection.id != gridconnection.id]
        if deviating_gridconnection_id_list:
            raise ValueError(f"All filtered assets should have the same GridConnection. Found GridConnection ids {[gridconnection.id]+deviating_gridconnection_id_list}.")
        
        # validate target count (value)
        if target_count > len(filtered_queryset):
            raise ValueError(f"target count ({target_count}) cannot be larger than the total amount of assets ({len(filtered_queryset)})")


    def get_target_diff_per_asset_type(self, asset_types_in_order: list[str], filtered_assets_in_order: list[list[EnergyAsset]], target_count: int) -> list[int]:
        """ Calculate per asset type in the ordered list how many should be removed or added """

        n_asset_types = len(asset_types_in_order)
        target_diff_per_asset_type = [0] * n_asset_types

        # get info for selected asset type
        selected_index = asset_types_in_order.index(self.selected_asset_type)
        count_at_selected = len(filtered_assets_in_order[selected_index])
        count_target_diff = target_count - count_at_selected

        # compute target differential per asset type
        if count_target_diff > 0: # increase amount of selected asset type
            target_diff_per_asset_type[selected_index] = count_target_diff # add assets of this type

            # balance by removing starting from the bottom of the ordered list and moving up
            remove_index = n_asset_types-1 if selected_index < n_asset_types-1 else n_asset_types-2
            add_remove_sum = count_target_diff
            while add_remove_sum > 0:
                target_diff_per_asset_type[remove_index] = -min(add_remove_sum, len(filtered_assets_in_order[remove_index]))
                add_remove_sum = sum(target_diff_per_asset_type)
                remove_index -= 1 
                
        elif count_target_diff < 0: # decrease amount
            target_diff_per_asset_type[selected_index] = count_target_diff # add assets of this type

            # balance
            add_index = 1 if selected_index == 0 else (selected_index-1)
            target_diff_per_asset_type[add_index] = -count_target_diff
        
        return target_diff_per_asset_type
        
    def remove_assets(self, assets: list[EnergyAsset]):
        """ Delete a set of assets """

        for asset in assets:
            asset.delete()



class BalanceGroupAssetOrder(models.Model):
    """ Linking table for RuleActionBalanceGroup and EnergyAsset """

    balance_group = models.ForeignKey(RuleActionBalanceGroup, on_delete=models.CASCADE)
    asset = models.ForeignKey(EnergyAsset, on_delete=models.CASCADE)
    order = models.IntegerField()

    class Meta:
        verbose_name = "BalanceGroupAssetOrder"
        ordering = ['order']