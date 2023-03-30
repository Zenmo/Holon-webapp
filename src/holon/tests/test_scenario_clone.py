from django.test import TestCase
from holon.models.actor import Actor
from holon.models.asset import EnergyAsset
from holon.models.gridconnection import GridConnection
from holon.models.gridnode import GridNode
from holon.models.policy import Policy
from holon.models.scenario import Scenario
from holon.models.contract import Contract


class MyTest(TestCase):
    fixtures = ["holon/tests/fixtures/merged-datamodel-ehub-config-fixture.json"]

    def __get_scenario_models(self, scenario: Scenario) -> tuple:
        """Get all underlying models of a scenario and return as a tuple"""

        actors = list(scenario.actor_set.all())
        contracts = list(Contract.objects.filter(actor__payload_id=scenario.id))
        gridnodes = list(scenario.gridnode_set.all())
        gridconnections = list(scenario.gridconnection_set.all())
        assets = list(scenario.assets.all())
        policies = list(scenario.policy_set.all())

        return (actors, contracts, gridnodes, gridconnections, assets, policies)

    def __get_all_models(self) -> tuple:
        """Get all underlying models of a scenario and return as a tuple"""

        actors = list(Actor.objects.all())
        contracts = list(Contract.objects.all())
        gridnodes = list(GridNode.objects.all())
        gridconnections = list(GridConnection.objects.all())
        assets = list(EnergyAsset.objects.all())
        policies = list(Policy.objects.all())

        return (actors, contracts, gridnodes, gridconnections, assets, policies)

    def __assert_equal_model_tuples(self, models_a: tuple, models_b: tuple):
        """Test if the querysets in two scenario model tuples are equal"""

        for i in range(6):
            self.assertEqual(len(models_a[i]), len(models_b[i]))
            self.assertEqual(models_a[i], models_b[i])

    def __assert_not_equal_model_tuples(self, models_a: tuple, models_b: tuple):
        """Test if the querysets in two scenario model tuples are equal"""

        for i in range(6):
            self.assertNotEqual(models_a[i], models_b[i])

    def __assert_equal_model_tuples_and_different_pks(self, models_a: tuple, models_b: tuple):
        """Test if the querysets in two scenario model tuples are equal"""

        for i in range(6):
            self.assertEqual(len(models_a[i]), len(models_b[i]))

            pks_a = [model.pk for model in models_a[i]]
            pks_b = [model.pk for model in models_b[i]]
            types_a = [model.__class__.__name__ for model in models_a[i]]
            types_b = [model.__class__.__name__ for model in models_b[i]]

            for pk_a in pks_a:
                self.assertNotIn(pk_a, pks_b)

            self.assertCountEqual(types_a, types_b)

    def test_scenario_clone_reference(self):
        """Test if the scenario attributes are cloned correctly"""
        scenario = Scenario.objects.get(pk=1)
        cloned_scenario = scenario.clone()
        scenario = Scenario.objects.get(pk=1)

        self.assertEqual(scenario.cloned_from, None)
        self.assertEqual(cloned_scenario.cloned_from, scenario)

    def test_scenario_clone_original_unaffected(self):
        """Test if the original scenario is unaffected by a clone"""
        # get scenario models
        scenario = Scenario.objects.get(pk=1)
        scenario_models_before = self.__get_scenario_models(scenario)

        # clone
        scenario.clone()

        # get scenario models again
        scenario = Scenario.objects.get(pk=1)
        scenario_models_after = self.__get_scenario_models(scenario)

        # assert scenario models are still the same
        self.__assert_equal_model_tuples(scenario_models_before, scenario_models_after)

    def test_scenario_clone_attributes(self):
        """Test if the scenario attributes are cloned correctly"""
        scenario = Scenario.objects.get(pk=1)
        cloned_scenario = scenario.clone()
        scenario = Scenario.objects.get(pk=1)

        self.assertNotEqual(scenario.pk, cloned_scenario.pk)
        self.assertEqual(scenario.name, cloned_scenario.name)
        self.assertEqual(scenario.version, cloned_scenario.version)
        self.assertEqual(scenario.comment, cloned_scenario.comment)

    def test_scenario_clone_models(self):
        """Test if underlying models are cloned correctly"""
        scenario = Scenario.objects.get(pk=1)
        cloned_scenario = scenario.clone()
        scenario = Scenario.objects.get(pk=1)

        # check underlying model counts
        scenario_models = self.__get_scenario_models(scenario)
        cloned_scenario_models = self.__get_scenario_models(cloned_scenario)
        all_models = self.__get_all_models()

        self.__assert_not_equal_model_tuples(scenario_models, cloned_scenario_models)
        self.__assert_not_equal_model_tuples(scenario_models, all_models)
        self.__assert_not_equal_model_tuples(cloned_scenario_models, all_models)

        self.__assert_equal_model_tuples_and_different_pks(scenario_models, cloned_scenario_models)
