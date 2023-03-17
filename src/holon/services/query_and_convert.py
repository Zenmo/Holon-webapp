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


def pprint(msg: str):
    print(f"[QConfig]: {msg}")


class QConfig:
    def __init__(
        self, config_db: QueryAndConvertConfig, anylogic_outcomes: dict, copied_scenario: Scenario
    ) -> None:
        self.config_db = config_db
        self.module = config_db.module
        self.name = config_db.name
        self.api_url = config_db.api_url
        self.etm_scenario_id = config_db.etm_scenario_id
        self.anylogic_outcomes = anylogic_outcomes
        self.copied_scenario = copied_scenario

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
        self.anylogic_outcomes = config.anylogic_outcomes

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
                pprint(
                    f"Couldn't find the specified key '{c.anylogic_key}' in any of the AnyLogic results (resort to convert with 1)"
                )
        except:
            pprint(
                f"Found the key '{c.anylogic_key}' but the result does not parse to a float (resort to convert with 1)"
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