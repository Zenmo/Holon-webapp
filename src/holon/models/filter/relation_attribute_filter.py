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
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.util import (
    is_exclude_field,
    get_relation_model,
    relation_field_options,
    relation_field_subtype_options,
    is_allowed_relation,
)

from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.filter.filter import Filter


class RelationAttributeFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="relation_attribute_filters"
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't satisfy the model attribute comparison"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        super().clean()

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.relation_model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
            if self.relation_field not in relation_field_options(self.rule):
                raise ValidationError("Invalid value relation_field")
            if (
                self.relation_field_subtype
                and self.relation_field_subtype
                not in relation_field_subtype_options(self.rule, self.relation_field)
            ):
                raise ValidationError("Invalid value relation_field_subtype")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value},{self.relation_field},{self.relation_field_subtype},{self.invert_filter}]"

    def relation_model_attribute_options(self) -> list[str]:
        relation_model = get_relation_model(
            self.rule, self.relation_field, self.relation_field_subtype
        )

        return [
            field.name
            for field in relation_model._meta.get_fields()
            if is_allowed_relation(field.name)
            or (not field.is_relation and not is_exclude_field(field))
        ]

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the relation attribute filter to a repository"""

        # get relation repository
        relation_repository = scenario_aggregate.get_repository_for_relation_field(
            self.rule.model_type,
            self.relation_field,
            model_subtype_name=self.relation_field_subtype,
        )

        # filter relation_repository on attribute
        relation_repository = relation_repository.filter_attribute_value(
            self.model_attribute, self.comparator, self.value
        )

        # filter repository on which items refer to an item in the filtered relation_repository
        return repository.filter_has_relation(
            self.relation_field, relation_repository, self.invert_filter
        )
