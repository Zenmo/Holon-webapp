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


class QConfig:
    def __init__(self, config_db: QueryAndConvertConfig) -> None:
        # static references
        self.config_db = config_db

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


class Query:
    def __init__(self, query: ETMQuery) -> None:
        self.internal_key = query.internal_key
        self.data_type = query.data_type
        self.endpoint = query.endpoint
        self.etm_key = query.etm_key

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

    def set_static(self, conversion: StaticConversion):
        return conversion

    def set_etm(self, conversion: ETMConversion):
        return conversion

    def set_anylogic(self, conversion: AnyLogicConversion):
        return conversion

    def set_datamodel(self, conversion: DatamodelConversion):
        return conversion


def run():
    scenario = Scenario.objects.get(id=1)
    configs: list[QueryAndConvertConfig] = scenario.query_and_convert_config.all()

    for c in configs:
        qc = QConfig(c)

        for query in c.etm_query.all():
            query: ETMQuery = query

            print()
