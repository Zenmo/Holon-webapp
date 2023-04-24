from typing import Union

from holon.models.rule_actions import RuleAction

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.query import QuerySet

from holon.models import util

from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from polymorphic import utils

from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from wagtail.core.models import Orderable
from holon.models.rule_actions.rule_action_utils import RuleActionUtils
from holon.models.scenario_rule import ScenarioRule
from holon.models.asset import EnergyAsset
from holon.models.contract import Contract
from holon.models.gridconnection import GridConnection

from holon.models.rule_actions.rule_action_utils import RuleActionUtils


class ChoiceListIterator(object):
    def __iter__(self):
        dropdown_list = RuleActionUtils.get_balanceable_subtypes()
        return dropdown_list.__iter__()


class RuleActionBalanceGroup(RuleAction, ClusterableModel):
    """Blans"""

    choice_list = ChoiceListIterator()

    selected_model_type_name = models.CharField(max_length=255, blank=True, choices=choice_list)
    rule = ParentalKey(
        ScenarioRule, on_delete=models.CASCADE, related_name="discrete_factors_balancegroup"
    )

    panels = [
        FieldPanel("selected_model_type_name"),
        InlinePanel(
            "balance_group_model_order",
            heading="Models for balancing in order (Select only one of the three options per model to balance)",
            label="Model to balance",
        ),
    ]

    class Meta:
        verbose_name = "RuleActionBalanceGroup"

    def hash(self):
        balance_model_hashes = ",".join(
            [model.hash() for model in self.balance_group_model_order.all()]
        )
        return f"[A{self.id},{self.selected_model_type_name},{balance_model_hashes}]"

    def get_balance_models_ordered(self) -> list:
        """Get the linked RuleActionModel objects in order from the linking table"""
        return [
            bgao.get_model_to_balance()
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
        template_models_in_order = self.get_balance_models_ordered()
        model_types_in_order = [model.__class__ for model in template_models_in_order]
        model_type_names_in_order = [model_type.__name__ for model_type in model_types_in_order]
        selected_model_type = next(
            model_type
            for model_type in model_types_in_order
            if model_type.__name__ == self.selected_model_type_name
        )

        # validate input=
        self.validate_filtered_queryset(model_type_names_in_order, filtered_queryset, target_count)

        # get parent foreign key field name
        parent_fk_field_name = self.get_parent_fk_fieldname(filtered_queryset, selected_model_type)

        # determine the model type counts (in order)
        model_counts_per_type = [
            self.get_count_for_model_type(model_type, filtered_queryset, parent_fk_field_name)
            for model_type in model_types_in_order
        ]

        # validate whether total model count is equal to size of filtered query
        if sum(model_counts_per_type) != filtered_queryset.count():
            raise ValidationError(
                f"Each filtered object should have exactly one of the models indicated for balancing. Current sum of models present is {sum(model_counts_per_type)}, while the number of filtered objects is {filtered_queryset.count()}"
            )

        # calculate the target counts of each model type as an effect of balancing
        target_count_per_model_type = self.get_target_count_per_model_type(
            model_counts_per_type, model_type_names_in_order, target_count
        )

        # reset model instances from queryset
        self.reset_models_in_queryset(model_types_in_order, filtered_queryset, parent_fk_field_name)

        # add models to filtered queryset according to target count
        self.add_models_according_to_target_count(
            template_models_in_order,
            filtered_queryset,
            target_count_per_model_type,
            parent_fk_field_name,
        )

    def validate_filtered_queryset(
        self,
        model_type_names_in_order: list[str],
        filtered_queryset: QuerySet,
        target_count: int,
    ):
        """Validate the assets in the queryset on asset type, gridconnection_id and count"""

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

        # validate target count (value)
        if target_count > filtered_queryset.count():
            raise ValueError(
                f"target count ({target_count}) for a single model type cannot be larger than the total amount of filtered objects ({filtered_queryset.count()})"
            )

    def get_parent_fk_fieldname(
        self, filtered_queryset: QuerySet, selected_model_type: type
    ) -> str:
        """Get the fieldname of the model that refers to its parent object"""

        base_parent_type = utils.get_base_polymorphic_model(filtered_queryset[0].__class__)

        try:
            parent_fk_field_name = next(
                fk_field_name
                for parent_type, fk_field_name in RuleActionUtils.get_parent_classes_and_field_names(
                    selected_model_type
                )
                if base_parent_type == parent_type
            )
        except:
            raise ValueError(
                f"Type {base_parent_type} in the filter does not match found parent type {RuleActionUtils.get_parent_classes_and_field_names(selected_model_type)} for model type {self.selected_model_type_name}"
            )

        return parent_fk_field_name

    def get_count_for_model_type(
        self, model_type: type, filtered_queryset: QuerySet, parent_fk_field_name: str
    ) -> int:
        """Get the number of occurences of model_type within the filtered objects"""

        model_type_count = 0

        for filtered_object in filtered_queryset:
            child_obj = model_type.objects.filter(**{parent_fk_field_name: filtered_object}).first()
            if child_obj and child_obj.__class__ == model_type:
                model_type_count += 1

        return model_type_count

    def reset_models_in_queryset(
        self,
        model_types_in_order: list[type],
        filtered_queryset: QuerySet,
        parent_fk_field_name: str,
    ):
        """Delete all instances of the model types in the filtered queryset"""

        for model_type in model_types_in_order:
            for filtererd_object in filtered_queryset:
                model_type.objects.filter(**{parent_fk_field_name: filtererd_object}).delete()

    def get_target_count_per_model_type(
        self,
        model_counts_per_type: list[int],
        model_type_names_in_order: list[str],
        target_count: int,
    ) -> list[int]:
        """Calculate the target counts of each model type as an effect of balancing"""

        n_model_types = len(model_type_names_in_order)
        target_diff_per_model_type = [0] * n_model_types

        # get info for selected model type
        selected_index = model_type_names_in_order.index(self.selected_model_type_name)
        count_at_selected = model_counts_per_type[selected_index]
        count_target_diff = target_count - count_at_selected

        # compute target differential per asset type
        if count_target_diff > 0:  # increase amount of selected asset type
            target_diff_per_model_type[
                selected_index
            ] = count_target_diff  # add models of this type

            # balance by removing starting from the bottom of the ordered list and moving up
            remove_index = (
                n_model_types - 1 if selected_index < n_model_types - 1 else n_model_types - 2
            )
            add_remove_sum = count_target_diff
            while add_remove_sum > 0:
                target_diff_per_model_type[remove_index] = -min(
                    add_remove_sum, model_counts_per_type[remove_index]
                )
                add_remove_sum = sum(target_diff_per_model_type)
                remove_index -= 1

        elif count_target_diff < 0:  # decrease amount
            target_diff_per_model_type[
                selected_index
            ] = count_target_diff  # add models of this type

            # balance
            add_index = 1 if selected_index == 0 else (selected_index - 1)
            target_diff_per_model_type[add_index] = -count_target_diff

        # add target differential to model type counts
        return [
            count + diff for count, diff in zip(model_counts_per_type, target_diff_per_model_type)
        ]

    def add_models_according_to_target_count(
        self,
        template_models_in_order: list,
        filtered_queryset: QuerySet,
        target_count_per_model_type: list[int],
        parent_fk_field_name: str,
    ):
        """Add duplicates of the template model to the filtered queryset in accordance with the target count per model type"""

        model_add_count = 0
        current_template_model_i = 0

        for filtererd_object in filtered_queryset:
            while model_add_count == target_count_per_model_type[current_template_model_i]:
                current_template_model_i += 1
                model_add_count = 0

            util.duplicate_model(
                template_models_in_order[current_template_model_i],
                {parent_fk_field_name: filtererd_object},
            )

            model_add_count += 1


class BalanceGroupModelOrder(Orderable):
    """Linking table for RuleActionBalanceGroup and EnergyAsset"""

    balance_group = ParentalKey(RuleActionBalanceGroup, related_name="balance_group_model_order")

    asset_to_balance = models.ForeignKey(
        EnergyAsset,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )
    gridconnection_to_balance = models.ForeignKey(
        GridConnection,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )
    contract_to_balance = models.ForeignKey(
        Contract,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"is_rule_action_template": True},
    )

    content_panels = [
        FieldPanel("asset_to_balance"),
        FieldPanel("gridconnection_to_balance"),
        FieldPanel("contract_to_balance"),
    ]

    def __init__(self, *args, **kwargs):
        super(Orderable, self).__init__(*args, **kwargs)

        self.__set_model()

    def clean(self):
        super().clean()

        self.__validate_model_selection()
        self.__set_model()

    def hash(self):
        asset_json, gridconnection_json, contract_json = util.serialize_add_models(
            self.asset_to_balance, self.gridconnection_to_balance, self.contract_to_balance
        )

        return f"[B{self.id},{asset_json},{gridconnection_json},{contract_json}]"

    def __validate_model_selection(self):
        """Validate only a single model type is selected"""

        # thy shall count to one. Not zero, nor two, one is the number to which thy shalt count
        if (
            bool(self.asset_to_balance)
            + bool(self.gridconnection_to_balance)
            + bool(self.contract_to_balance)
        ) < 1:
            raise ValidationError(
                f"Assign an object to either the asset, gridconnection or contract field for RuleActionAdd"
            )

        if (
            bool(self.asset_to_balance)
            + bool(self.gridconnection_to_balance)
            + bool(self.contract_to_balance)
        ) > 1:
            raise ValidationError(f"Only one of the child models can be set for RuleActionAdd")

    def __set_model(self):
        """Set addition RuleActionAdd attributes according to selected model"""

        # choose which model type is filled in and put it in more general self.model_to_add
        if self.asset_to_balance:
            assert not (self.gridconnection_to_balance or self.contract_to_balance)
            self.model_to_balance = self.asset_to_balance

        elif self.gridconnection_to_balance:
            assert not (self.asset_to_balance or self.contract_to_balance)
            self.model_to_balance = self.gridconnection_to_balance

        elif self.contract_to_balance:
            assert not (self.asset_to_balance or self.gridconnection_to_balance)
            self.model_to_balance = self.contract_to_balance

    def get_model_to_balance(self) -> Union[EnergyAsset, GridConnection, Contract]:
        """Return the model to balance"""
        return self.model_to_balance

    class Meta:
        verbose_name = "BalanceGroupModelOrder"
