from copy import deepcopy as copy
from typing import List

import etm_service
import sentry_sdk

from holon.models import (
    DatamodelQueryRule,
    Scenario,
    ModelType,
)
from holon.models.config import (
    AnyLogicConversion,
    DatamodelConversion,
    ETMConversion,
    ETMQuery,
    KeyValuePairCollection,
    StaticConversion,
    QueryCovertModuleType,
    QueryAndConvertConfig,
)
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.utils.logging import HolonLogger
from holon.services.costs_table import CostItem
from pipit.sentry import sentry_sdk_trace

qc_logger = HolonLogger("QConfig")

# Configuration to map ETM outputs to Holon KPI's at regional and national level.
# Hardcoded because not bound to change at any point during this project.
UPSCALING_KPI_CONFIGS = {
    "api_url": "https://engine.energytransitionmodel.com/api/v3/scenarios/",
    "config": {
        # Holon KPI
        "sustainability": {
            "value": {
                "type": "query",
                "data": "value",
                "etm_key": "dashboard_renewability"
            },
            "convert_with": [
                {
                    "type": "static",
                    "type_actual": "static",
                    "conversion": "multiply",
                    "data": "value",
                    "value": 100,
                    "key": "fr_to_pct",
                }
            ],
        },
        # Holon KPI
        "self_sufficiency": {
            "value": {
                "type": "query",
                "data": "value",
                "etm_key": "kpi_self_sufficiency_local_production_of_primary_demand",
            }
        },
        # Holon KPI
        "netload": {
            "value": {
                "type": "query",
                "data": "value",
                "etm_key": "kpi_relative_future_load_mv_hv_transformer",
            }
        },
        # Holon KPI
        "costs": {
            "value": {
                "type": "query",
                "data": "value",
                "etm_key": "total_costs"
            }
        },
    },
}


class QConfig:
    def __init__(
        self,
        config_db: QueryAndConvertConfig,
        anylogic_outcomes: dict,
        scenario_aggregate: ScenarioAggregate,
    ) -> None:
        self.config_db = config_db
        self.module = config_db.module
        self.name = config_db.name
        self.api_url = config_db.api_url
        self.etm_scenario_id = config_db.etm_scenario_id
        self.anylogic_outcomes = anylogic_outcomes
        self.scenario_aggregate = scenario_aggregate
        # used in cost-benefit to distribute costs over actors
        self.distribution_keys = {}

    @property
    def vars(self) -> dict:
        c = self.config_db
        try:
            return self._vars
        except AttributeError:
            self._vars = {}
            try:
                key_values: KeyValuePairCollection = (
                    c.key_value_pair_collection.get().float_key_value_pair.all()
                )
                self._vars = {o.key: o.value for o in key_values}
            except:
                return self._vars

    @property
    def queries(self):
        try:
            return self._queries
        except AttributeError:
            self.unpack_queries()
            return self._queries

    def unpack_queries(self):
        self._queries = {
            "module": self.module,
            "name": self.name,
            "api_url": self.api_url,
            "etm_scenario_id": self.etm_scenario_id,
            "config": {},
        }
        for q in self.config_db.etm_query.all():
            self.unpack(q)
        for q in self.config_db.generic_etm_query.all():
            self.unpack(q)

    def unpack(self, q):
        query = Query(query=q, config=self, scenario_aggregate=self.scenario_aggregate)
        self._queries["config"].update(query.to_dict())

        self.distribution_keys.update(
            {
                query.internal_key: query.distribution_key
                if query.distribution_key
                else {"Undefined": 1.0}
            }
        )


class ETMConnect:
    @staticmethod
    @sentry_sdk_trace
    def connect_from_scenario(
        original_scenario: Scenario,
        scenario_aggregate: ScenarioAggregate,
        anylogic_outcomes: dict,
    ) -> tuple[str, dict]:
        """Returns a tuple (outcome name, outcome) for each available etm config found in the scenario"""
        for config in ETMConnect.query_configs(
            original_scenario, scenario_aggregate, anylogic_outcomes
        ):
            if config.module == QueryCovertModuleType.COST.value:
                yield ETMConnect.costs(config)
            if config.module == QueryCovertModuleType.COSTBENEFIT.value:
                yield ETMConnect.costs(config)
            if (
                config.module == QueryCovertModuleType.UPSCALING.value
                or config.module == QueryCovertModuleType.UPSCALING_REGIONAL.value
            ):
                yield ETMConnect.upscaling(config)

    @staticmethod
    def query_configs(
        original_scenario: Scenario, scenario_aggregate: ScenarioAggregate, anylogic_outcomes: dict
    ):
        return (
            QConfig(c, anylogic_outcomes=anylogic_outcomes, scenario_aggregate=scenario_aggregate)
            for c in original_scenario.query_and_convert_config.prefetch_related(
                "key_value_pair_collection__float_key_value_pair"
            )
            .prefetch_related("etm_query__static_conversion_step")
            .prefetch_related("etm_query__etm_conversion_step")
            .prefetch_related("etm_query__datamodel_conversion_step__datamodel_query_rule")
            .prefetch_related("etm_query__al_conversion_step")
            .all()
        )

    @staticmethod
    @sentry_sdk_trace
    def costs(config: QConfig):
        cost_components = etm_service.retrieve_results(config.etm_scenario_id, config.queries)

        ETMConnect.log_costs(config.etm_scenario_id, config, cost_components)

        if config.module == QueryCovertModuleType.COST.value:
            return (QueryCovertModuleType.COST, sum(cost_components.values()))

        # Calculate depreciation costs for each actor
        if config.module == QueryCovertModuleType.COSTBENEFIT.value:
            return (
                QueryCovertModuleType.COSTBENEFIT,
                [
                    {actor: val * cost_components[key] for actor, val in actors.items()}
                    for key, actors in config.distribution_keys.items()
                ],
            )

    @staticmethod
    def log_costs(etm_scenario_id: int, config, cost_components: dict):
        span = sentry_sdk.Hub.current.scope.span
        if span is not None and span.sampled is True:
            span.set_data("new_scenario_id", etm_scenario_id)
            for key, value in config.queries.items():
                span.set_data("etm_query_" + key, value)

            for key, value in cost_components.items():
                span.set_data("etm_output_cost_" + key, value)

    @staticmethod
    @sentry_sdk_trace
    def upscaling(config: QConfig):
        new_scenario_id = etm_service.scale_copy_and_send(config.etm_scenario_id, config.queries)

        kpis = etm_service.retrieve_results(new_scenario_id, copy(UPSCALING_KPI_CONFIGS))

        ETMConnect.log_upscaling(config.etm_scenario_id, new_scenario_id, config, kpis)

        return config.module, kpis

    @staticmethod
    def log_upscaling(source_scenario_id: int, new_scenario_id: int, config, kpis: dict):
        span = sentry_sdk.Hub.current.scope.span
        if span is not None and span.sampled is True:
            span.set_data("etm_source_scenario_id", source_scenario_id)
            span.set_data("etm_new_scenario_id", new_scenario_id)
            for key, value in config.queries.items():
                span.set_data("etm_query_" + key, value)

            for key, value in kpis.items():
                span.set_data("etm_output_kpi_" + key, value)


class Query:
    def __init__(
        self, query: ETMQuery, config: QConfig, scenario_aggregate: ScenarioAggregate
    ) -> None:
        self.internal_key = query.internal_key
        self.data_type = query.data_type
        self.endpoint = query.endpoint
        self.etm_key = query.etm_key
        self.config = config
        self.query_db = query
        self.scenario_aggregate = scenario_aggregate
        self.anylogic_outcomes = config.anylogic_outcomes
        # WHEN FILLED: self.distribution_keys = {group1: val1, group2: val2, ...}
        self.distribution_key = {}

    @property
    def convert_with(self) -> List[dict]:
        query = self.query_db
        # early return if the property was called before
        try:
            return self._convert_with
        except AttributeError:
            self._convert_with = []

        for c in query.static_conversion_step.all():
            self._convert_with.append(self.set_static(c))

        for c in query.etm_conversion_step.all():
            self._convert_with.append(self.set_etm(c))

        for c in query.datamodel_conversion_step.all():
            self._convert_with.append(self.set_datamodel(c))

        for c in query.al_conversion_step.all():
            self._convert_with.append(self.set_anylogic(c))

        return self._convert_with

    def set_static(self, c: StaticConversion):
        """tries to get local vars, if not than resort to direct value"""
        if c.value is None:
            value = c.local_variable.value
            type_actual = "static - local variable"
        else:
            value = c.value
            type_actual = "static - static"

        return {
            "type": "static",  # all non-query conversions are considered static
            "type_actual": type_actual,
            "conversion": c.conversion,
            "data": "value",  # NOT implemented in module!
            "value": value,
            "key": c.shadow_key,
        }

    def set_etm(self, c: ETMConversion):
        return {
            "type": "query",
            # "key": c.shadow_key,
            "etm_key": c.etm_key,
            "value_type": c.conversion_value_type,
            "conversion": c.conversion,
        }

    def set_anylogic(self, c: AnyLogicConversion):
        # TODO: map AnyLogic outputs based on snippets that we can validate!
        value = 1
        for subdict in self.anylogic_outcomes.values():
            try:
                value = subdict[0][
                    c.anylogic_key
                ]  # TODO why is this like this? Seems like jackson artefact
            except KeyError:
                pass

        try:
            value = float(value)
            if value == 1:
                qc_logger.log_print(
                    f"Couldn't find the specified key '{c.anylogic_key}' in any of the AnyLogic results (resort to convert with 1)"
                )
        except:
            # try to get the values from the dict, to check if dict
            try:
                value = list(value.values())[:8760]
            except AttributeError:
                qc_logger.log_print(
                    f"Found the key '{c.anylogic_key}' but the result does not parse to a float or a array (resort to convert with 1)"
                )
                value = 1

        return {
            "type": "static",  # all non-query conversions are considered static
            "type_actual": "anylogic",
            "conversion": c.conversion,  # NOT implemented in module!
            "data": c.conversion_value_type,  # NOT implemented in module!
            "value": value,
            "key": c.shadow_key,
        }

    def set_datamodel(self, c: DatamodelConversion):
        """"""
        qr: DatamodelQueryRule = c.datamodel_query_rule.get()
        value = qr.get_filter_aggregation_result(self.scenario_aggregate)

        if self.config.config_db.module == QueryCovertModuleType.COSTBENEFIT:
            actor_repository = self.scenario_aggregate.get_repository_for_model_type(
                ModelType.ACTOR
            )
            actor_group_repository = self.scenario_aggregate.get_repository_for_model_type(
                ModelType.ACTOR_GROUP
            )
            actor_sub_group_repository = self.scenario_aggregate.get_repository_for_model_type(
                ModelType.ACTOR_SUB_GROUP
            )

            unique_sub_group_ids = actor_repository.get_distinct_attribute_values(
                ["group_id", "subgroup_id"]
            )
            unique_sub_groups = {
                (
                    actor_group_repository.get(d["group_id"])
                    if d["group_id"] is not None
                    else None,
                    actor_sub_group_repository.get(d["subgroup_id"])
                    if d["subgroup_id"] is not None
                    else None,
                )
                for d in unique_sub_group_ids
            }

            for group_tuple in unique_sub_groups:
                g_value = qr.get_filter_aggregation_result(
                    scenario_aggregate=self.scenario_aggregate,
                    group_to_filter=group_tuple[0],
                    subgroup_to_filter=group_tuple[1],
                )
                keyname = CostItem.group_key_name(group_tuple[0], group_tuple[1])
                self.distribution_key.update({keyname: g_value / value if value != 0 else 0})

            # TODO: aren't we double counting now? some guys already got some in their subgroup?
            unique_group_ids = actor_repository.get_distinct_attribute_values(["group_id"])
            unique_groups = [
                actor_group_repository.get(d["group_id"]) if d["group_id"] is not None else None
                for d in unique_group_ids
            ]

            for group in unique_groups:
                g_value = qr.get_filter_aggregation_result(
                    scenario_aggregate=self.scenario_aggregate, group_to_filter=group
                )
                keyname = CostItem.group_key_name(group)
                self.distribution_key.update({keyname: g_value / value if value != 0 else 0})

        return {
            "type": "static",  # all non-query conversions are considered static
            "type_actual": "datamodel",
            "conversion": c.conversion,  # NOT implemented in module!
            "data": c.conversion_value_type,  # NOT implemented in module!
            "value": value,
            "key": c.shadow_key,
        }

    def to_dict(self):
        """Return a dict of this Query instance"""
        return {
            self.internal_key: {
                "value": {
                    "type": self.endpoint,  # as expected by module
                    "data": self.data_type,  # as expected by module
                    "etm_key": self.etm_key,  # as expected by module
                },
                "convert_with": self.convert_with,  # NOT as expected by module! (because array)
            }
        }
