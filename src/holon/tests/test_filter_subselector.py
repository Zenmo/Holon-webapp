import random

from django.test import TestCase

from holon.models import *
from holon.rule_engine.scenario_aggregate import ScenarioAggregate


class RuleFilterSubSelectorTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.D,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=550.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_3: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=1000.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.B,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_4: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=1000.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.B,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_5: DistrictHeatingGridConnection = (
            DistrictHeatingGridConnection.objects.create(
                owner_actor=self.actor,
                capacity_kw=550.0,
                payload=self.scenario,
                heating_type=HeatingType.GASBURNER,
                type=DistrictHeatingType.MT,
            )
        )

        self.scenario_aggregate = ScenarioAggregate(self.scenario)

        self.rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

    ### ABSOLUTE MODE ###

    def test_subselector_skip_set_value_absolute(self) -> None:
        # Arange

        Skip.objects.create(rule=self.rule, use_interactive_element_value=False, number_of_items=1)

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[1:])

    def test_subselector_skip_ie_value_absolute(self) -> None:
        # Arange

        Skip.objects.create(rule=self.rule, use_interactive_element_value=True, number_of_items=0)

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(
            full_repository, "2", random.Random(42)
        )

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[2:])

    def test_subselector_take_set_value_absolute(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=False,
            number_of_items=1,
            mode=TakeMode.FIRST,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:1])

    def test_subselector_take_ie_value_absolute(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=True,
            number_of_items=0,
            mode=TakeMode.FIRST,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(
            full_repository, "3", random.Random(42)
        )

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:3])

    def test_subselector_take_random_absolute(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=False,
            number_of_items=2,
            mode=TakeMode.RANDOM,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.len(), 2)

    ### RELATIVE MODE ###

    def test_subselector_skip_set_value_relative(self) -> None:
        # Arange
        Skip.objects.create(
            rule=self.rule,
            use_interactive_element_value=False,
            number_of_items=75,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[3:])

    def test_subselector_skip_ie_value_relative(self) -> None:
        # Arange

        Skip.objects.create(
            rule=self.rule,
            use_interactive_element_value=True,
            number_of_items=0,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(
            full_repository, "50", random.Random(42)
        )

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[2:])

    def test_subselector_take_set_value_relative(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=False,
            number_of_items=75,
            mode=TakeMode.FIRST,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:3])

    def test_subselector_take_ie_value_relative(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=True,
            number_of_items=0,
            mode=TakeMode.FIRST,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(
            full_repository, "25", random.Random(42)
        )

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:1])

    def test_subselector_take_random_relative(self) -> None:
        # Arange

        Take.objects.create(
            rule=self.rule,
            use_interactive_element_value=False,
            number_of_items=50,
            mode=TakeMode.RANDOM,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_repository = self.rule.get_filtered_repository(self.scenario_aggregate)
        filtered_repository = self.rule.subselect_repository(full_repository, "", random.Random(42))

        # Assert
        self.assertEqual(filtered_repository.len(), 2)
