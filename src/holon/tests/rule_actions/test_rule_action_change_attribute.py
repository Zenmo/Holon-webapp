from django.test import TestCase

from holon.models import *
from holon.rule_engine import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType
from holon.serializers import InteractiveElementInput


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        gridconnection: BuildingGridConnection = BuildingGridConnection.objects.create(
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

    def test_change_attribute_set(self):
        """Test the change attribute set operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.SET, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="250.0",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Asserts

        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 250.0
        )  # was 750.0

    def test_change_attribute_set_static_value(self):
        """Test the change attribute set operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw",
            operator=ChangeAttributeOperator.SET,
            static_value="350.0",
            rule=rule,
        )

        interactive_elements = [
            InteractiveElementInput(
                value="250.0",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 350.0
        )  # was 750.0

    def test_change_attribute_add(self):
        """Test the change attribute add operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.ADD, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="250.0",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 1000.0
        )  # was 750.0

    def test_change_attribute_subtract(self):
        """Test the change attribute subtract operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.SUBTRACT, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="250.0",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 500.0
        )  # was 750.0

    def test_change_attribute_multiply(self):
        """Test the change attribute multiply operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.MULTIPLY, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="2",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 1500.0
        )  # was 750.0

    def test_change_attribute_divide(self):
        """Test the change attribute divide operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.DIVIDE, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="3",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw
            == 250.0
        )  # was 750.0

    def test_change_multiple_attributes(self):
        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="capacity_kw", operator=ChangeAttributeOperator.SET, rule=rule
        )
        rule_action_change_attribute_set = RuleActionChangeAttribute.objects.create(
            model_attribute="insulation_label", operator=ChangeAttributeOperator.SET, rule=rule
        )

        interactive_elements = [
            InteractiveElementInput(
                value="1",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().capacity_kw == 1
        )  # was 750.0
        assert (
            updated_scenario.repositories[ModelType.GRIDCONNECTION.value].first().insulation_label
            == 1
        )  # was 750.0

    def test_change_attribute_allowed_relation_set(self):
        """Test the change attribute set operator"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
        )
        RuleActionChangeAttribute.objects.create(
            model_attribute="group", operator=ChangeAttributeOperator.SET, rule=rule
        )

        actor_group = ActorGroup.objects.create(name="group")
        interactive_elements = [
            InteractiveElementInput(
                value=str(actor_group.id),
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert (
            updated_scenario.repositories[ModelType.ACTOR.value].first().group_id == actor_group.id
        )
        assert (
            updated_scenario.repositories[ModelType.ACTOR.value].first().group.id == actor_group.id
        )

    def test_change_attribute_allowed_relation_unset(self):
        # Arrange
        actor_sub_group = ActorSubGroup.objects.create(name="soepgroep")
        actor = self.scenario.actor_set.all()[0]
        actor.subgroup = actor_sub_group
        actor.save()

        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
        )
        RuleActionChangeAttribute.objects.create(
            model_attribute="subgroup",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
            static_value="Null",
        )

        interactive_elements = [
            InteractiveElementInput(
                value="9000",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        assert (
            scenario_aggregate.repositories[ModelType.ACTOR.value].first().subgroup_id is not None
        )
        assert scenario_aggregate.repositories[ModelType.ACTOR.value].first().subgroup is not None

        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        assert updated_scenario.repositories[ModelType.ACTOR.value].first().subgroup_id is None
        assert updated_scenario.repositories[ModelType.ACTOR.value].first().subgroup is None
