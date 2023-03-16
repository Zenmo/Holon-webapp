from django.db.models import Q
from django.db.models.query import QuerySet
from django.apps import apps

from holon.models.filter import Filter
from holon.models.scenario_rule import ModelType
from django.core.exceptions import ValidationError
from holon.models.util import all_subclasses


from django.db import models
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel, MultiFieldPanel
from holon.models import DatamodelConversion


class SelfConversionType(models.TextChoices):
    """Applied to the resulting set of objects attribute values before conversion"""

    SUM = "SUM"  # sum the selected attribute of the query result
    COUNT = "COUNT"  # sum the selected attribute of the query result


class DatamodelQueryRule(ClusterableModel):
    """A rule that finds a selection of objects and returns the count or attribute sum based on configuration of filters"""

    self_conversion = models.CharField(max_length=255, choices=SelfConversionType.choices)
    datamodel_conversion_step = ParentalKey(
        DatamodelConversion, related_name="datamodel_query_rule"
    )

    model_type = models.CharField(
        max_length=255, choices=ModelType.choices
    )  # bijv gridconnection of asset
    model_subtype = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv industry terrain of photovoltaic

    attribute_to_sum = models.CharField(
        max_length=255, null=True, blank=True
    )  # bijv capacityEletricity_kW

    panels = [
        MultiFieldPanel(
            heading="Model type and subtype",
            children=[
                FieldPanel("model_type"),
                FieldPanel("model_subtype"),
                FieldPanel("attribute_to_sum"),
            ],
        ),
        FieldPanel(self_conversion),
        MultiFieldPanel(
            heading="Filters",
            children=[
                InlinePanel(
                    "attribute_filters",
                    heading="Continuous attribute filters",
                    label="Continuous attribute filters",
                ),
                InlinePanel(
                    "discrete_attribute_filters",
                    heading="Discrete attribute filters",
                    label="Discrete attribute filters",
                ),
                InlinePanel(
                    "relation_attribute_filters",
                    heading="Relation attribute filters",
                    label="Relation attribute filters",
                ),
            ],
        ),
    ]

    class Meta:
        verbose_name = "DatamodelQueryRule"

    def clean(self):
        # TODO: check als je sumt dat je dan wel een attribuut heb
        super().clean()

        if (
            self.model_subtype is not None
            and self.model_subtype != ""
            and self.model_subtype not in self.model_subtype_options()
        ):
            raise ValidationError("Invalid value model_subtype")

    def model_subtype_options(self):
        model_type_class = apps.get_model("holon", self.model_type)
        return [subclass.__name__ for subclass in all_subclasses(model_type_class)]

    def get_filters(self):
        return (
            list(self.attribute_filters.all())
            + list(self.relation_attribute_filters.all())
            + list(self.discrete_attribute_filters.all())
        )


class FilterAggregation:
    """Collection of functions for aggregating on filter results"""

    def get_filters_object_count(filters: list[Filter]) -> int:
        """Get the number of objects in the combined filter resutls"""
        filtered_queryset = FilterAggregation.get_queryset_from_filters(filters)
        return filtered_queryset.count()

    def get_filters_attribute_sum(filters: list[Filter], attribute_name: str) -> float:
        """Return the sum of a specific attribute of all objects in a queryset"""

        filtered_queryset = FilterAggregation.get_queryset_from_filters(filters)

        attr_sum = 0

        for filtered_object in filtered_queryset:
            try:
                value = getattr(filtered_object, attribute_name)
                attr_sum += value
            except Exception as e:
                print(f"Something went wrong, let's act as if nothing happend and keep going ({e})")

        return attr_sum

        # TODO on what model are we filtering? And do we want models within a specific scenario, or all models in the database? - TAVM

    def get_queryset_from_filters(
        filters: list[Filter],
    ) -> QuerySet:
        """Get a queryset from a list of filters"""
        queryset_filter = Q()

        # filter: Filter
        for filter in filters:
            queryset_filter &= filter.get_q()

        return base_queryset.filter(queryset_filter)
