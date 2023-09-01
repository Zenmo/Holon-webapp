import operator
from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.serializers import InteractiveElementInput


class AttributeNoiseTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=250.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=500.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )

        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_CONTINUOUS, scenario=self.scenario
        )
        self.interactive_element_continuous_values: InteractiveElementContinuousValues = (
            InteractiveElementContinuousValues.objects.create(input=self.interactive_element)
        )

        self.rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )

    def test_change_attribute_noise_uniform(self):
        """Test the change attribute add operator"""

        # Arrange

        random_range = 50

        rule_action = RuleActionAttributeNoise.objects.create(
            model_attribute="capacity_kw",
            noise_type=NoiseType.UNIFORM,
            min_value=-random_range,
            max_value=random_range,
            rule=self.rule,
        )

        interactive_elements = [
            InteractiveElementInput(
                value="",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        # Assert
        old_capacities = np.array(
            [
                gc.capacity_kw
                for gc in scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        updated_scenario_aggregate: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )
        new_capacities = np.array(
            [
                gc.capacity_kw
                for gc in updated_scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        # assert capacities have changed
        np.testing.assert_array_compare(operator.__ne__, old_capacities, new_capacities)

        # assert capacities have changed within uniform bounds
        np.testing.assert_allclose(old_capacities, new_capacities, atol=random_range)

    def test_change_attribute_noise_triangle(self):
        """Test the change attribute add operator"""

        # Arrange

        random_range = 50

        rule_action = RuleActionAttributeNoise.objects.create(
            model_attribute="capacity_kw",
            noise_type=NoiseType.TRIANGLE,
            min_value=-random_range,
            max_value=random_range,
            mean=random_range / 2,
            rule=self.rule,
        )

        interactive_elements = [
            InteractiveElementInput(
                value="",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        # Assert
        old_capacities = np.array(
            [
                gc.capacity_kw
                for gc in scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        updated_scenario_aggregate: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )
        new_capacities = np.array(
            [
                gc.capacity_kw
                for gc in updated_scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        # assert capacities have changed
        np.testing.assert_array_compare(operator.__ne__, old_capacities, new_capacities)

        # assert capacities have changed within random bounds
        np.testing.assert_allclose(old_capacities, new_capacities, atol=random_range)

    def test_change_attribute_noise_normal(self):
        """Test the change attribute add operator"""

        # Arrange

        rule_action = RuleActionAttributeNoise.objects.create(
            model_attribute="capacity_kw",
            noise_type=NoiseType.NORMAL,
            mean=0,
            sigma=5,
            rule=self.rule,
        )

        interactive_elements = [
            InteractiveElementInput(
                value="",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        # Assert
        old_capacities = np.array(
            [
                gc.capacity_kw
                for gc in scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        updated_scenario_aggregate: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )
        new_capacities = np.array(
            [
                gc.capacity_kw
                for gc in updated_scenario_aggregate.get_repository_for_model_type(
                    GridConnection.__name__
                ).all()
            ]
        )

        # assert capacities have changed
        np.testing.assert_array_compare(operator.__ne__, old_capacities, new_capacities)

        # assert capacities have changed within certain extreme bounds
        random_range = 100
        np.testing.assert_allclose(old_capacities, new_capacities, atol=random_range)
