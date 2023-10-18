from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate
    from holon.rule_engine.repositories.repository_base import RepositoryBaseClass

from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from wagtail.admin.panels import FieldPanel

from holon.models.util import (
    is_exclude_field,
    get_relation_model,
    relation_field_options,
    relation_field_subtype_options,
    all_subclasses,
    is_allowed_relation,
)
from holon.models.filter.filter import Filter


class SecondOrderRelationAttributeFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule",
        on_delete=models.CASCADE,
        related_name="second_order_relation_attribute_filters",
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household
    second_order_relation_field = models.CharField(max_length=255)
    second_order_relation_field_subtype = models.CharField(max_length=255, blank=True)
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't satisfy the model attribute comparison"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
        FieldPanel("second_order_relation_field"),
        FieldPanel("second_order_relation_field_subtype"),
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    class Meta:
        verbose_name = "SecondOrderRelationAttributeFilter"

    def clean(self):
        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.second_order_relation_model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
            if self.relation_field not in relation_field_options(self.rule):
                raise ValidationError("Invalid value relation field")
            if (
                self.relation_field_subtype
                and self.relation_field_subtype
                not in relation_field_subtype_options(self.rule, self.relation_field)
            ):
                raise ValidationError("Invalid value relation field subtype")
            if self.second_order_relation_field not in self.second_order_relation_field_options():
                raise ValidationError("Invalid value second order relation field")
            if (
                self.second_order_relation_field_subtype
                and self.second_order_relation_field_subtype
                not in self.second_order_relation_field_subtype_options()
            ):
                raise ValidationError("Invalid value relation second order relation field subtype")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value},{self.relation_field},{self.relation_field_subtype},{self.invert_filter},{self.second_order_relation_field},{self.second_order_relation_field}]"

    def get_second_order_relation_model(self) -> models.Model:
        """Helper function to get model class of second order selected relation"""
        if self.second_order_relation_field_subtype:
            return apps.get_model("holon", self.second_order_relation_field_subtype)

        relation_model = get_relation_model(
            self.rule, self.relation_field, self.relation_field_subtype
        )
        second_order_relation_model = relation_model._meta.get_field(
            self.second_order_relation_field
        ).related_model

        return second_order_relation_model

    def second_order_relation_model_attribute_options(self) -> list[str]:
        """Return list of fields that can be used for filtering"""
        relation_model = self.get_second_order_relation_model()

        return _get_model_filter_attribute_fields(relation_model)

    def second_order_relation_field_options(self) -> list[str]:
        model = get_relation_model(self.rule, self.relation_field, self.relation_field_subtype)

        return [
            field.name
            for field in model()._meta.get_fields()
            if field.is_relation and not is_exclude_field(field)
        ]

    def second_order_relation_field_subtype_options(self) -> list[str]:
        related_model = get_relation_model(
            self.rule, self.relation_field, self.relation_field_subtype
        )
        second_related_model = related_model._meta.get_field(
            self.second_order_relation_field
        ).related_model

        return [subclass.__name__ for subclass in all_subclasses(second_related_model)]

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the relation attribute filter to a repository"""

        model_attribute = self.model_attribute
        if is_allowed_relation(model_attribute):
            # Add id to attribute so it can be updated with an id compared to a model instance
            model_attribute += "_id"

        # get relation repository
        first_order_relation_repository = scenario_aggregate.get_repository_for_relation_field(
            self.rule.model_type,
            self.relation_field,
            model_subtype_name=self.relation_field_subtype,
        )

        # get second-order relation repository
        second_order_relation_repository = scenario_aggregate.get_repository_for_relation_field(
            first_order_relation_repository.base_model_type.__name__,
            self.second_order_relation_field,
            model_subtype_name=self.second_order_relation_field_subtype,
        )

        # filter second_order_relation_repository on attribute
        second_order_relation_repository = second_order_relation_repository.filter_attribute_value(
            model_attribute, self.comparator, self.value
        )

        # filter first-order relation repository on which items refer to an item in the filtered relation_repository
        first_order_relation_repository = first_order_relation_repository.filter_has_relation(
            self.second_order_relation_field, second_order_relation_repository
        )

        # filter repository on which items refer to an item in the filtered relation_repository
        return repository.filter_has_relation(
            self.relation_field, first_order_relation_repository, self.invert_filter
        )


def _get_model_filter_attribute_fields(model: models.Model) -> list[str]:
    """Return list of fields that can be used for filtering"""
    return [
        # include _id fields so that you can have a third-order filter based on id.
        field.name + "_id" if field.is_relation else field.name
        for field in model._meta.get_fields()
        if _valid_filter_attribute_field(field)
    ]


def _valid_filter_attribute_field(field: models.Field) -> bool:
    """Return if field is valid for a filter attribute rule"""
    if is_exclude_field(field):
        return False

    if not field.is_relation:
        return True

    if field.one_to_one or field.many_to_one:
        return True

    return False
