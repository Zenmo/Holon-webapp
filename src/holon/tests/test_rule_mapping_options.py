from django.test import TestCase

from holon.models import *
from holon.rule_engine import rule_mapping
from holon.models.rule_actions import RuleActionFactor
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType
from holon.serializers import InteractiveElementInput


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_SINGLESELECT, scenario=self.scenario
        )
        self.interactive_element_option_1 = InteractiveElementOptions.objects.create(
            input=self.interactive_element,
            option="0",
        )
        self.interactive_element_option_2 = InteractiveElementOptions.objects.create(
            input=self.interactive_element,
            option="50",
        )
        self.interactive_element_option_3 = InteractiveElementOptions.objects.create(
            input=self.interactive_element,
            option="100",
        )

        rule_option_1 = ScenarioRule.objects.create(
            interactive_element_option=self.interactive_element_option_1,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        self.factor_option_1 = RuleActionFactor.objects.create(
            model_attribute="capacity_kw", min_value=5, max_value=55, rule=rule_option_1
        )
        rule_option_3 = ScenarioRule.objects.create(
            interactive_element_option=self.interactive_element_option_3,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        self.factor_option_3 = RuleActionFactor.objects.create(
            model_attribute="tempSetpointNight_degC", min_value=5, max_value=55, rule=rule_option_3
        )

    def test_rule_mapping_single_select_option_1(self) -> None:
        # Arange
        interactive_elements = [
            InteractiveElementInput(
                value=str(self.interactive_element_option_1.option),
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        updated_gridconnection = updated_scenario.repositories[
            ModelType.GRIDCONNECTION.value
        ].first()
        self.assertEqual(updated_gridconnection.capacity_kw, self.factor_option_1.min_value)
        self.assertEqual(
            updated_gridconnection.tempSetpointNight_degC,
            self.gridconnection.tempSetpointNight_degC,
        )

    def test_rule_mapping_single_select_option_3(self) -> None:
        # Arange
        interactive_elements = [
            InteractiveElementInput(
                value=str(self.interactive_element_option_3.option),
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )
        # Assert
        updated_gridconnection = updated_scenario.repositories[
            ModelType.GRIDCONNECTION.value
        ].first()
        self.assertEqual(updated_gridconnection.capacity_kw, self.gridconnection.capacity_kw)
        self.assertEqual(
            updated_gridconnection.tempSetpointNight_degC, self.factor_option_3.max_value
        )

    def test_rule_mapping_single_select_multiselect(self) -> None:
        # Arange
        interactive_elements = [
            InteractiveElementInput(
                value=f"{self.interactive_element_option_1.option},{self.interactive_element_option_3.option}",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        updated_gridconnection = updated_scenario.repositories[
            ModelType.GRIDCONNECTION.value
        ].first()
        self.assertEqual(updated_gridconnection.capacity_kw, self.factor_option_1.min_value)
        self.assertEqual(
            updated_gridconnection.tempSetpointNight_degC, self.factor_option_3.max_value
        )
