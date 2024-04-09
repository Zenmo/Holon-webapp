from django.test import TestCase

from holon.models import *
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.services import ETMConnect


class RuleFiltersTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor_group_1 = ActorGroup.objects.create(name="group 1")
        self.actor_group_2 = ActorGroup.objects.create(name="group 2")
        self.actor_1: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, group=self.actor_group_1
        )
        self.actor_2: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, group=self.actor_group_2
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor_1,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.D,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor_1,
            capacity_kw=550.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_3: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor_2,
            capacity_kw=1000.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.B,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_4: DistrictHeatingGridConnection = (
            DistrictHeatingGridConnection.objects.create(
                owner_actor=self.actor_2,
                capacity_kw=550.0,
                payload=self.scenario,
                heating_type=HeatingType.GASBURNER,
                type=DistrictHeatingType.MT,
            )
        )

    def test_sum_kw(self) -> None:
        query_and_convert_config = QueryAndConvertConfig()
        query_and_convert_config.scenario = self.scenario
        query_and_convert_config.module = "upscaling"
        query_and_convert_config.name = "divide capacity by actors"
        query_and_convert_config.etm_scenario_id = 1337
        query_and_convert_config.save()

        # key_value_pair_collection = KeyValuePairCollection()
        # key_value_pair_collection.related_config = query_and_convert_config
        # key_value_pair_collection.save()
        #
        # float_key_value_pair = FloatKeyValuePair()
        # float_key_value_pair.related_key_value_collection = key_value_pair_collection
        # float_key_value_pair.key = "idk"
        # float_key_value_pair.value = 1000.0
        # float_key_value_pair.save()

        etm_query = ETMQuery()
        etm_query.related_config = query_and_convert_config
        etm_query.endpoint = EndPoint.INPUT
        etm_query.data_type = DataType.VALUE
        etm_query.etm_key = "divide_capacity_by_actors"
        etm_query.internal_key = "divide_capacity_by_actors_internal"
        etm_query.save()

        datamodel_conversion_step = DatamodelConversion()
        datamodel_conversion_step.etm_query = etm_query
        datamodel_conversion_step.shadow_key = "multiply_internal"
        datamodel_conversion_step.conversion_value_type = DatamodelConversionValueType.VALUE
        datamodel_conversion_step.conversion = DatamodelConversionOperationType.MULTIPLY
        datamodel_conversion_step.save()

        datamodel_query_rule = DatamodelQueryRule()
        datamodel_query_rule.datamodel_conversion_step = datamodel_conversion_step
        datamodel_query_rule.self_conversion = SelfConversionType.SUM
        datamodel_query_rule.model_type = "GridConnection"
        datamodel_query_rule.attribute_to_sum = "capacity_kw"
        datamodel_query_rule.save()

        datamodel_conversion_step = DatamodelConversion()
        datamodel_conversion_step.etm_query = etm_query
        datamodel_conversion_step.shadow_key = "divide_internal"
        datamodel_conversion_step.conversion_value_type = DatamodelConversionValueType.VALUE
        datamodel_conversion_step.conversion = DatamodelConversionOperationType.DIVIDE
        datamodel_conversion_step.save()

        datamodel_query_rule = DatamodelQueryRule()
        datamodel_query_rule.datamodel_conversion_step = datamodel_conversion_step
        datamodel_query_rule.self_conversion = SelfConversionType.COUNT
        datamodel_query_rule.model_type = "Actor"
        datamodel_query_rule.save()

        qconfigs = ETMConnect.query_configs(
            self.scenario, scenario_aggregate=ScenarioAggregate(self.scenario), anylogic_outcomes={}
        )
        qconfigs = list(qconfigs)

        self.assertEqual(len(qconfigs), 1)

        queries = qconfigs[0].queries
        print(queries)

        expected = {
            "module": "upscaling",
            "name": "divide capacity by actors",
            "api_url": "https://engine.energytransitionmodel.com/api/v3/scenarios/",
            "etm_scenario_id": 1337,
            "config": {
                "divide_capacity_by_actors_internal": {
                    "value": {
                        "type": "input",
                        "data": "value",
                        "etm_key": "divide_capacity_by_actors",
                    },
                    "convert_with": [
                        {
                            "type": "static",
                            "type_actual": "datamodel",
                            "conversion": "multiply",
                            "data": "value",
                            "value": 2850.0,
                            "key": "multiply_internal",
                        },
                        {
                            "type": "static",
                            "type_actual": "datamodel",
                            "conversion": "divide",
                            "data": "value",
                            "value": 2,
                            "key": "divide_internal",
                        },
                    ],
                }
            },
        }

        self.assertEqual(queries, expected)
