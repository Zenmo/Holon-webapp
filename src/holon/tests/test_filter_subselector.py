from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping


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

    def test_subselector_skip_set_value(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=False, number_of_items=1)

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "")

        # Assert
        self.assertEqual(queryset, full_queryset[1:])

    def test_subselector_skip_ie_value(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=True, number_of_items=0)

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "2")

        # Assert
        self.assertEqual(queryset, full_queryset[2:])

    def test_subselector_take_set_value(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=False, number_of_items=1)

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "")

        # Assert
        self.assertEqual(queryset, full_queryset[:0])

    def test_subselector_take_ie_value(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=True, number_of_items=0)

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "3")

        # Assert
        self.assertEqual(queryset, full_queryset[:2])

    def test_subselector_take_random(self) -> None:
        # Arange

        rule: ScenarioRule = ScenarioRule.objects.create(
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

        Skip.objects.create(rule=rule, use_interactive_element_value=False, number_of_items=3)

        # Act
        full_queryset = rule.get_queryset(self.scenario)
        queryset = rule.apply_filter_subselections(full_queryset, "3")

        # Assert
        self.assertEqual(len(queryset), 3)
