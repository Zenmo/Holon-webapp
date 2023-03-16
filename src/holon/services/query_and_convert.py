from holon.models.config import (
    QueryAndConvertConfig,
    KeyValuePairCollection,
    AnyLogicConversion,
    DatamodelConversion,
    StaticConversion,
    ETMConversion,
    ETMQuery,
    FloatKeyValuePair,
)
from holon.models import DatamodelQueryRule, Scenario
from typing import List


class QConfig:
    def __init__(
        self, config_db: QueryAndConvertConfig, anylogic_outcomes: dict, copied_scenario: Scenario
    ) -> None:
        # static references
        self.config_db = config_db
        self.module = config_db.module
        self.name = config_db.name
        self.api_url = config_db.api_url
        self.etm_scenario_id = config_db.etm_scenario_id
        self.anylogic_outcomes = anylogic_outcomes

        # method based setters
        self.vars = config_db
        self.copied_scenario = copied_scenario

    @property
    def vars(self) -> dict:
        try:
            return self._vars
        except AttributeError:
            return dict()

    @vars.setter
    def vars(self, c: QueryAndConvertConfig):
        try:
            key_values: KeyValuePairCollection = (
                c.key_value_pair_collection.get().float_key_value_pair.all()
            )
            self._vars = {o.key: o.value for o in key_values}
        except:
            pass

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
            self._queries["config"].update(
                Query(query=q, config=self, copied_scenario=self.copied_scenario).to_dict()
            )


class Query:
    def __init__(self, query: ETMQuery, config: QConfig, copied_scenario: Scenario) -> None:
        self.internal_key = query.internal_key
        self.data_type = query.data_type
        self.endpoint = query.endpoint
        self.etm_key = query.etm_key
        self.config = config
        self.query_db = query
        self.copied_scenario = copied_scenario

    @property
    def convert_with(self) -> List[dict]:
        query = self.query_db
        # early return if the property was called before
        try:
            return self._convert_with
        except AttributeError:
            self._convert_with = []

        conversions: List[ETMQuery] = [
            *query.static_conversion_step.all(),
            *query.etm_conversion_step.all(),
            *query.datamodel_conversion_step.all(),
            *query.al_conversion_step.all(),
        ]

        for c in conversions:
            if isinstance(c, StaticConversion):
                self._convert_with.append(self.set_static(c))
            elif isinstance(c, ETMConversion):
                self._convert_with.append(self.set_etm(c))
            elif isinstance(c, AnyLogicConversion):
                self._convert_with.append(self.set_anylogic(c))
            elif isinstance(c, DatamodelConversion):
                self._convert_with.append(self.set_datamodel(c))
            else:
                raise NotImplementedError(f"Conversion of type {c.__name__} is not implemented!")

        return self._convert_with

    def set_static(self, c: StaticConversion):
        """tries to get local vars, if not than resort to direct value"""
        if c.value is None:
            value = c.local_variable.value
        else:
            value = c.value

        return {
            "type": "static",  # all non-query conversions are considered static
            "type_actual": "static",
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
        print("set anylogic")

        # TODO: map AnyLogic outputs based on snippets that we can validate!
        try:
            value = self.config.anylogic_outcomes[c.anylogic_key]
        except KeyError:
            # raise KeyError(f"Key '{c.anylogic_key}' cannot be found in AnyLogic outcomes")
            value = None
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
        value = qr.get_filter_aggregation_result(self.copied_scenario)

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
