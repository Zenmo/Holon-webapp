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
        self.gridconnection_4: DistrictHeatingGridConnection = (
            DistrictHeatingGridConnection.objects.create(
                owner_actor=self.actor,
                capacity_kw=550.0,
                payload=self.scenario,
                heating_type=HeatingType.GASBURNER,
                type=DistrictHeatingType.MT,
            )
        )

    def test_subselector_skip_set_value_absolute(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=False, number_of_items=1)

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        full_repository = rule.get_filtered_repository(scenario_aggregate)
        filtered_repository = rule.subselect_repository(full_repository, "")

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[1:])

    def test_subselector_skip_ie_value_absolute(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=True, number_of_items=0)

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        full_repository = rule.get_filtered_repository(scenario_aggregate)
        filtered_repository = rule.subselect_repository(full_repository, "2")

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[2:])

    def test_subselector_take_set_value_absolute(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule, use_interactive_element_value=False, number_of_items=1, mode=TakeMode.FIRST
        )

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        full_repository = rule.get_filtered_repository(scenario_aggregate)
        filtered_repository = rule.subselect_repository(full_repository, "")

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:1])

    def test_subselector_take_ie_value_absolute(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule, use_interactive_element_value=True, number_of_items=0, mode=TakeMode.FIRST
        )

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        full_repository = rule.get_filtered_repository(scenario_aggregate)
        filtered_repository = rule.subselect_repository(full_repository, "3")

        # Assert
        self.assertEqual(filtered_repository.all(), full_repository.all()[:3])

    def test_subselector_take_random_absolute(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule, use_interactive_element_value=False, number_of_items=3, mode=TakeMode.RANDOM
        )

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        full_repository = rule.get_filtered_repository(scenario_aggregate)
        filtered_repository = rule.subselect_repository(full_repository, "")

        # Assert
        self.assertEqual(filtered_repository.len(), 3)

    # TODO vanaf hier omschrijven naar nieuwe rule engine - TAVM
    def test_subselector_skip_set_value_relative(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(
            rule=rule,
            use_interactive_element_value=False,
            number_of_items=75,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "")

        # Assert
        self.assertEqual(list(queryset), list(full_queryset[3:]))

    def test_subselector_skip_ie_value_relative(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(
            rule=rule,
            use_interactive_element_value=True,
            number_of_items=0,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "50")

        # Assert
        self.assertEqual(list(queryset), list(full_queryset[2:]))

    def test_subselector_take_set_value_relative(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule,
            use_interactive_element_value=False,
            number_of_items=75,
            mode=TakeMode.FIRST,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "")

        # Assert
        self.assertEqual(list(queryset), list(full_queryset[:3]))

    def test_subselector_take_ie_value_relative(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule,
            use_interactive_element_value=True,
            number_of_items=0,
            mode=TakeMode.FIRST,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "25")

        # Assert
        self.assertEqual(list(queryset), list(full_queryset[:1]))

    def test_subselector_take_random_relative(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Take.objects.create(
            rule=rule,
            use_interactive_element_value=False,
            number_of_items=50,
            mode=TakeMode.RANDOM,
            amount_type=AmountType.RELATIVE.value,
        )

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "")

        # Assert
        self.assertEqual(len(queryset), 2)
