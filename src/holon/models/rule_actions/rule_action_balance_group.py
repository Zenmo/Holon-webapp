from holon.models.rule_actions import RuleAction

from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models.query import QuerySet
from holon.models.gridconnection import GridConnection

from holon.models.asset import EnergyAsset
from holon.models import util

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from polymorphic.models import PolymorphicModel
from polymorphic import utils

from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.core.models import Orderable
from holon.models.rule_actions.rule_action_model import RuleActionModel
from holon.models.scenario_rule import ScenarioRule

from holon.models.rule_actions.rule_action_utils import RuleActionUtils



class RuleActionBalanceGroup(RuleAction, ClusterableModel):
    """Blans"""

    selected_model_type_name = models.CharField(max_length=255, blank=True) # TODO Should be selection of RuleActionModel subtypes in frontend - TAVM
    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_balancegroup"
    )

    panels = RuleAction.panels + [
        FieldPanel("selected_asset_type"),
        InlinePanel("balance_group_model_order", label="Assets for balancing in order"),
    ]

    class Meta:
        verbose_name = "RuleActionBalanceGroup"


    def get_ruleaction_models_ordered(self) -> list[RuleActionModel]:
        """Get the linked RuleActionModel objects in order from the linking table"""
        return [
            bgao.model_to_balance
            for bgao in BalanceGroupModelOrder.objects.filter(balance_group=self).order_by(
                "sort_order"
            )
        ]


    def apply_action_to_queryset(self, filtered_queryset: QuerySet, value: str):
        """
        Balance a set of models by removing and adding models such that a target count for the selected model
        is reached, while the total number of models stays the same.
        """

        target_count = int(value)
        ordered_models = self.get_ruleaction_models_ordered()
        model_types_in_order = [model.__class__ for model in ordered_models]
        selected_model_type = next(model_type for model_type in model_types_in_order if model_type.__name__ == self.selected_model_type_name)

        # validate input # TODO
        self.validate_filtered_queryset(
            model_types_in_order, filtered_queryset, target_count
        )

        # get parent foreign key field name
        parent_fk_field_name = self.get_parent_fk_fieldname(filtered_queryset, selected_model_type)

        # determine the model type counts (in order)
        model_type_count = self.get_model_count_per_type(model_types_in_order, filtered_queryset, parent_fk_field_name)
        
        # [
        #     len([
        #         filtered_object
        #         for filtered_object in filtered_queryset
        #         if filtered_object.__class__.__name__ == model_type
        #     ])
        #     for model_type in model_types_in_order
        # ]

        # # get filtered assets aggregated by asset type, in the order of self.asset_order
        # filtered_model_lists_in_order = [
        #     [
        #         filtered_object
        #         for filtered_object in filtered_queryset
        #         if filtered_object.__class__.__name__ == asset_name
        #     ]
        #     for asset_name in model_types_in_order
        # ]

        # # calculate how many of each asset type should be removed/added
        # target_change_per_asset_type = self.get_count_change_per_model_type(
        #     model_types_in_order, filtered_model_lists_in_order, target_count
        # )

        # # apply removal/adding
        # for template_model, target_change, filtered_assets in zip(
        #     ordered_models, target_change_per_asset_type, filtered_model_lists_in_order
        # ):
        #     if target_change > 0:
        #         self.add_assets(gridconnection, template_model, target_change)

        #     if target_change < 0:
        #         self.remove_assets(filtered_assets[:-target_change])


    def get_parent_fk_fieldname(self, filtered_queryset: QuerySet, selected_model_type) -> str:
        """ Get the fieldname of the model that refers to its parent object """

        base_parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)
        
        try:
            parent_fk_field_name = next(
                fk_field_name
                for parent_type, fk_field_name in RuleActionUtils.get_parent_classes_and_field_names(selected_model_type)
                if base_parent_type == parent_type
            )
        except:
            raise ValueError(
                f"Type {base_parent_type} in the filter does not match found parent type {RuleActionUtils.get_parent_classes_and_field_names(selected_model_type)} for model type {self.selected_model_type_name}"
            )
        
        return parent_fk_field_name


    def get_model_count_per_type(self, model_types_in_order: list[str], filtered_queryset: QuerySet, selected_model_type, parent_fk_field_name:str) -> list[int]:

        model_count_per_type = [0] * len(model_types_in_order)

        # only take first n objects
        for filtererd_object in filtered_queryset:


 
            if not self.model_to_add.__class__.objects.filter(
                **{parent_fk_field_name: filtererd_object}
            ).exists():
                if objects_added < n:
                    # add model_to_add to filtered object
                    util.duplicate_model(
                        self.model_to_add, {parent_fk_field_name: filtererd_object}
                    )
                    objects_added += 1

            # `set_count` mode, delete the objects of the model class under the filtered objects
            elif reset_models_before_add:
                self.model_to_add.__class__.objects.filter(
                    **{parent_fk_field_name: filtererd_object}
                ).delete()


        pass


    def validate_filtered_queryset(
        self,
        model_types_in_order: list[RuleActionModel],
        filtered_queryset: QuerySet,
        target_count: int,
    ):
        """Validate the assets in the queryset on asset type, gridconnection_id and count"""

        model_type_names_in_order = [model_type.__name__ for model_type in model_types_in_order]

        # validated selected_asset_type is in asset_order
        if not self.selected_model_type_name in model_type_names_in_order:
            raise ValidationError(
                f"Model type selected for balancing ({self.selected_model_type_name}) not in ordered model list"
            )

        # check for duplicate asset types
        if len(model_type_names_in_order) > len(set(model_type_names_in_order)):
            raise ValidationError(
                f"Duplicate model types not allowed. Given model types: {model_type_names_in_order}"
            )

        # validate whether model types in filtered_queryset are in the ordered list
        models_not_in_model_order_list = [
            model
            for model in filtered_queryset
            if not model.__class__.__name__ in model_type_names_in_order
        ]
        if models_not_in_model_order_list:
            raise ValueError(
                f"All filtered models should be present in the asset order. The violating assets are: {models_not_in_model_order_list}"
            )

        # validate target count (value)
        if target_count > len(filtered_queryset):
            raise ValueError(
                f"target count ({target_count}) cannot be larger than the total amount of assets ({len(filtered_queryset)})"
            )


    def get_count_change_per_model_type(
        self,
        asset_types_in_order: list[str],
        filtered_assets_in_order: list[list[EnergyAsset]],
        target_count: int,
    ) -> list[int]:
        """Calculate per model type in the ordered list how many should be removed or added"""

        n_asset_types = len(asset_types_in_order)
        target_diff_per_asset_type = [0] * n_asset_types

        # get info for selected asset type
        selected_index = asset_types_in_order.index(self.selected_asset_type)
        count_at_selected = len(filtered_assets_in_order[selected_index])
        count_target_diff = target_count - count_at_selected

        # compute target differential per asset type
        if count_target_diff > 0:  # increase amount of selected asset type
            target_diff_per_asset_type[
                selected_index
            ] = count_target_diff  # add assets of this type

            # balance by removing starting from the bottom of the ordered list and moving up
            remove_index = (
                n_asset_types - 1 if selected_index < n_asset_types - 1 else n_asset_types - 2
            )
            add_remove_sum = count_target_diff
            while add_remove_sum > 0:
                target_diff_per_asset_type[remove_index] = -min(
                    add_remove_sum, len(filtered_assets_in_order[remove_index])
                )
                add_remove_sum = sum(target_diff_per_asset_type)
                remove_index -= 1

        elif count_target_diff < 0:  # decrease amount
            target_diff_per_asset_type[
                selected_index
            ] = count_target_diff  # add assets of this type

            # balance
            add_index = 1 if selected_index == 0 else (selected_index - 1)
            target_diff_per_asset_type[add_index] = -count_target_diff

        return target_diff_per_asset_type


    def balance_models(self, filtered_queryset: QuerySet, value: str):
        """Add an asset to the first n items in the the filtered objects"""

        # parse value
        n = int(value)
        if n < 0:
            raise ValueError(f"Value to add cannot be smaller than 0. Given value: {n}")

        # get parent type and foreign key field name
        parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)
        try:
            parent_fk_field_name = next(
                parent_fieldname[1]
                for parent_fieldname in self.valid_parent_fk_fieldname_pairs
                if parent_type == parent_fieldname[0]
            )
        except:
            raise ValueError(
                f"Parent type {parent_type} is not a valid parent for selected model type {self.model_to_add.__class__.__name__}. {self.valid_parent_fk_fieldname_pairs}"
            )

        objects_added = 0

        # only take first n objects
        for filtererd_object in filtered_queryset:

            if not self.model_to_add.__class__.objects.filter(
                **{parent_fk_field_name: filtererd_object}
            ).exists():
                if objects_added < n:
                    # add model_to_add to filtered object
                    util.duplicate_model(
                        self.model_to_add, {parent_fk_field_name: filtererd_object}
                    )
                    objects_added += 1

            # `set_count` mode, delete the objects of the model class under the filtered objects
            elif reset_models_before_add:
                self.model_to_add.__class__.objects.filter(
                    **{parent_fk_field_name: filtererd_object}
                ).delete()




    def add_assets(self, gridconnection: GridConnection, template_asset: EnergyAsset, n: int):
        """Duplicate a template asset n times with gridconnection_id as their parent"""

        for _ in range(n):
            util.duplicate_model(template_asset, {"gridconnection": gridconnection})

    def remove_assets(self, assets: list[EnergyAsset]):
        """Delete a set of assets"""

        for asset in assets:
            EnergyAsset.objects.filter(id=asset.id).delete()


class BalanceGroupModelOrder(Orderable):
    """Linking table for RuleActionBalanceGroup and EnergyAsset"""

    balance_group = ParentalKey(RuleActionBalanceGroup, related_name="balance_group_model_order")
    model_to_balance = models.ForeignKey(RuleActionModel, on_delete=models.CASCADE)

    content_panels = [FieldPanel("model_to_balance")]

    class Meta:
        verbose_name = "BalanceGroupModelOrder"
