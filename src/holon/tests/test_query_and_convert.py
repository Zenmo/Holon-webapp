from django.test import TestCase
from holon.models.config import QueryAndConvertConfig
from holon.models.scenario import Scenario
from holon.services.query_and_convert import QConfig, Query


class QueryAndConvertTestClass(TestCase):
    fixtures = ["holon/tests/fixtures/merged-datamodel-ehub-config-fixture.json"]

    def test_query_set_datamodel(self):
        """Test wether the value and distribution keys of a datamodel query are set up correctly"""
        config = QueryAndConvertConfig.objects.get(pk=2)
        scenario = Scenario.objects.get(pk=1)
        datamodel_query = config.etm_query.get(pk=3)

        qconfig = QConfig(config, {}, scenario)

        query = Query(datamodel_query, qconfig, scenario)

        assert not query.distribution_key

        query.set_datamodel()

        assert query.distribution_key
