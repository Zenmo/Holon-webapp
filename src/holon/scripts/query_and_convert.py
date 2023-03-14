from holon.models.scenario import Scenario
from holon.models.config import QueryAndConvertConfig, KeyValuePairCollection, FloatKeyValuePair, ETMQuery
from django.db import models

models.prefetch_related_objects


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


def run():
    scenario = Scenario.objects.get(id=1)
    configs: list[QueryAndConvertConfig] = scenario.query_and_convert_config.all()

    for c in configs:
        qc = QConfig(c)

        for query in c.etm_query.all():
            query: ETMQuery = query
            
            query.internal_key
            query.data_type
            query.endpoint
            query.etm_key


