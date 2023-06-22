from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from holon.rule_engine.scenario_aggregate import ScenarioAggregate

from typing import Union
from django.db import models
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

from holon.models.config.etm_query import ETMQuery


class RuleActionConversionOperationType(models.TextChoices):
    MULTIPLY = "multiply"
    SUM = "sum"


class RuleActionStaticConversionOperationType(models.TextChoices):
    MULTIPLY = "multiply"
    SUM = "sum"


class RuleActionConversion(ClusterableModel):
    rule_action_change_attribute = ParentalKey(
        "holon.RuleActionChangeAttribute", related_name="rule_action_conversion_step"
    )

    static_value = models.FloatField(null=True, blank=True)
    conversion_with_static = models.CharField(
        max_length=255, choices=RuleActionConversionOperationType.choices, null=True, blank=True
    )

    conversion_between_rules = models.CharField(
        max_length=255, choices=RuleActionConversionOperationType.choices
    )

    panels = [
        FieldPanel("conversion_between_rules"),
        InlinePanel(
            "rule_action_datamodel_query_rule",
            label="Datamodel Query Rule",
            heading="Datamodel Query Rule",
        ),
        FieldPanel("conversion_with_static"),
        FieldPanel("static_value"),
    ]

    def get_value(
        self,
        scenario_aggregate: ScenarioAggregate,
    ) -> Union[int, float]:
        """Get value returned from datamodel queries and static value"""
        datamodel_queries_result = self.get_filter_aggregation_result(scenario_aggregate)

        if self.static_value is None:
            return datamodel_queries_result

        if self.conversion_with_static == RuleActionStaticConversionOperationType.MULTIPLY.value:
            return datamodel_queries_result * self.static_value
        if self.conversion_with_static == RuleActionStaticConversionOperationType.SUM.value:
            return datamodel_queries_result + self.static_value

        raise NotImplementedError(
            f'Conversion mode "{self.conversion_with_static}" not implemented'
        )

    def get_filter_aggregation_result(
        self,
        scenario_aggregate: ScenarioAggregate,
    ) -> Union[int, float]:
        """Get the filter aggregation result based on the datamodel query rule's conversion type"""

        if self.conversion_between_rules == RuleActionConversionOperationType.MULTIPLY.value:
            query_rule_value = 1
        elif self.conversion_between_rules == RuleActionConversionOperationType.SUM.value:
            query_rule_value = 0
        else:
            raise NotImplementedError(f'Conversion mode "{self.conversion}" not implemented')

        for query_rule in self.rule_action_datamodel_query_rule.all():
            if self.conversion_between_rules == RuleActionConversionOperationType.MULTIPLY.value:
                query_rule_value *= query_rule.get_filter_aggregation_result(scenario_aggregate)
            if self.conversion_between_rules == RuleActionConversionOperationType.SUM.value:
                query_rule_value += query_rule.get_filter_aggregation_result(scenario_aggregate)

        return query_rule_value
