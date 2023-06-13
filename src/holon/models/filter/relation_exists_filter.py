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
    relation_field_options,
    relation_field_subtype_options,
)
from holon.models.filter.filter import Filter


class RelationExistsFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="relation_exists_filters"
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't have the specified relation"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
    ]

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        super().clean()

        try:
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

    def filter_repository(
        self, scenario_aggregate: ScenarioAggregate, repository: RepositoryBaseClass
    ) -> RepositoryBaseClass:
        """Apply the relation attribute filter to a repository"""

        # get relation repository
        model = apps.get_model("holon", self.rule.model_type)
        relation_model_type = model()._meta.get_field(self.relation_field).related_model.__name__
        relation_repository = scenario_aggregate.get_repository_for_model_type(relation_model_type)

        # filter by subtype
        if self.relation_field_subtype:
            relation_model_subtype = apps.get_model("holon", self.relation_field_subtype)
            relation_repository = relation_repository.filter_model_subtype(relation_model_subtype)

        # filter repository on which items refer to an item in the filtered relation_repository
        return repository.filter_has_relation(
            self.relation_field, relation_repository, self.invert_filter
        )
