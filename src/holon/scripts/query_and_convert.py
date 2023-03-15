from holon.models.scenario import Scenario
from holon.models.config import (
    QueryAndConvertConfig,
    KeyValuePairCollection,
    FloatKeyValuePair,
    AnyLogicConversion,
    DatamodelConversion,
    StaticConversion,
    ETMConversion,
    ETMQuery,
)
from typing import List
from dataclasses import dataclass


class QConfig:
    def __init__(self, config_db: QueryAndConvertConfig, anylogic_outcomes: dict) -> None:
        # static references
        self.config_db = config_db
        self.anylogic_outcomes = anylogic_outcomes

        # method based setters
        self.vars = config_db

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
        self._queries = []
        for q in self.config_db.etm_query.all():
            self._queries.append(Query(q, self))


class Query:
    def __init__(self, query: ETMQuery, config: QConfig) -> None:
        self.internal_key = query.internal_key
        self.data_type = query.data_type
        self.endpoint = query.endpoint
        self.etm_key = query.etm_key
        self.config = config

    @property
    def convert_with(self) -> List[dict]:
        try:
            return self._convert_with
        except AttributeError:
            return list()

    @convert_with.setter
    def convert_with(self, query: ETMQuery) -> None:
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

    def set_static(self, c: StaticConversion):
        """tries to get local vars, if not than resort to direct value"""
        try:
            value = self.config.vars[c.local_variable]
        except KeyError:
            value = c.value

        return {
            "type": "static",
            "key": c.shadow_key,
            "value": value,
            "conversion": c.conversion,
        }

    def set_etm(self, c: ETMConversion):
        return {
            "type": "etm",
            "key": c.shadow_key,
            "etm_key": c.etm_key,
            "value_type": c.conversion_value_type,
            "conversion": c.conversion,
        }

    def set_anylogic(self, c: AnyLogicConversion):
        try:
            value = self.config.anylogic_outcomes[c.anylogic_key]
        except KeyError:
            # raise KeyError(f"Key '{c.anylogic_key}' cannot be found in AnyLogic outcomes")
            value = None
        return {
            "type": "anylogic",
            "key": c.shadow_key,
            "value_type": c.conversion_value_type,
            "conversion": c.conversion,
            "value": value,
        }

    def set_datamodel(self, c: DatamodelConversion):
        return c


def run():
    from holon.services import CloudClient

    scenario = Scenario.objects.get(id=1)
    configs: list[QueryAndConvertConfig] = scenario.query_and_convert_config.all()

    cc = CloudClient(scenario)
    cc.run()
    cc.outputs

    for c in configs:
        qc = QConfig(c, anylogic_outcomes=cc.outputs)
        print(qc.queries)
