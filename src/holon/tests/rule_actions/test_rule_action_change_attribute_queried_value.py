from django.test import TestCase

from holon.models import *
from holon.rule_engine import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.serializers import InteractiveElementInput


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
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
        BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )

        ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )

        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_CONTINUOUS, scenario=self.scenario
        )
        self.interactive_element_continuous_values = (
            InteractiveElementContinuousValues.objects.create(input=self.interactive_element)
        )

    def test_rule_action_change_attribute_queried_no_filters(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action = RuleActionChangeAttribute.objects.create(
            model_attribute="capacityElectricity_kW",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
        )
        rule_action_conversion = RuleActionConversion.objects.create(
            rule_action_change_attribute=rule_action,
            conversion_between_rules=RuleActionConversionOperationType.MULTIPLY.value,
        )
        data_query_rule = DatamodelQueryRule.objects.create(
            self_conversion=SelfConversionType.COUNT,
            self_conversion_factor=2,
            rule_action_conversion_step=rule_action_conversion,
            model_type=ModelType.ACTOR.value,
        )
        # no filters

        interactive_elements = [
            InteractiveElementInput(
                value="4",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.get_repository_for_model_type(
            "EnergyAsset", "ElectricHeatConversionAsset"
        )
        assert (
            ehc_assets.first().capacityElectricity_kW == 2.0
        )  # 2 (factor) x 1 (query actor count)

    def test_rule_action_change_attribute_queried_no_filters_static_value_sum(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action = RuleActionChangeAttribute.objects.create(
            model_attribute="capacityElectricity_kW",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
        )
        rule_action_conversion = RuleActionConversion.objects.create(
            rule_action_change_attribute=rule_action,
            conversion_between_rules=RuleActionConversionOperationType.MULTIPLY.value,
            conversion_with_static=RuleActionStaticConversionOperationType.SUM.value,
            static_value=10.0,
        )
        data_query_rule = DatamodelQueryRule.objects.create(
            self_conversion=SelfConversionType.COUNT,
            self_conversion_factor=2,
            rule_action_conversion_step=rule_action_conversion,
            model_type=ModelType.ACTOR.value,
        )
        # no filters

        interactive_elements = [
            InteractiveElementInput(
                value="4",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.get_repository_for_model_type(
            "EnergyAsset", "ElectricHeatConversionAsset"
        )
        assert (
            ehc_assets.first().capacityElectricity_kW == 12.0
        )  # 2 (factor) x 1 (query actor count)  + 10 (static value sum)

    def test_rule_action_change_attribute_queried_no_filters_static_value_multiply(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action = RuleActionChangeAttribute.objects.create(
            model_attribute="capacityElectricity_kW",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
        )
        rule_action_conversion = RuleActionConversion.objects.create(
            rule_action_change_attribute=rule_action,
            conversion_between_rules=RuleActionConversionOperationType.MULTIPLY.value,
            conversion_with_static=RuleActionStaticConversionOperationType.MULTIPLY.value,
            static_value=10.0,
        )
        data_query_rule = DatamodelQueryRule.objects.create(
            self_conversion=SelfConversionType.COUNT,
            self_conversion_factor=2,
            rule_action_conversion_step=rule_action_conversion,
            model_type=ModelType.ACTOR.value,
        )
        # no filters

        interactive_elements = [
            InteractiveElementInput(
                value="4",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.get_repository_for_model_type(
            "EnergyAsset", "ElectricHeatConversionAsset"
        )
        assert (
            ehc_assets.first().capacityElectricity_kW == 20.0
        )  # 2 (factor) x 1 (query actor count)  *  10 (static value sum)

    def test_rule_action_change_attribute_queried_with_filters_sum_attributes(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action = RuleActionChangeAttribute.objects.create(
            model_attribute="capacityElectricity_kW",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
        )
        rule_action_conversion = RuleActionConversion.objects.create(
            rule_action_change_attribute=rule_action,
            conversion_between_rules=RuleActionConversionOperationType.MULTIPLY.value,
        )
        data_query_rule = DatamodelQueryRule.objects.create(
            self_conversion=SelfConversionType.SUM,
            attribute_to_sum="capacity_kw",
            self_conversion_factor=1,
            rule_action_conversion_step=rule_action_conversion,
            model_type=ModelType.GRIDCONNECTION.value,
        )
        # no filters

        interactive_elements = [
            InteractiveElementInput(
                value="4",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.get_repository_for_model_type(
            "EnergyAsset", "ElectricHeatConversionAsset"
        )
        assert (
            ehc_assets.first().capacityElectricity_kW == 2250.0
        )  # 1 (factor) x 750 x 3 (query 3 gridconnection sum capacity_kw )

    def test_rule_action_change_attribute_queried_no_filters_sum_attributes(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action = RuleActionChangeAttribute.objects.create(
            model_attribute="capacityElectricity_kW",
            operator=ChangeAttributeOperator.SET,
            rule=rule,
        )
        rule_action_conversion = RuleActionConversion.objects.create(
            rule_action_change_attribute=rule_action,
            conversion_between_rules=RuleActionConversionOperationType.MULTIPLY.value,
        )
        data_query_rule = DatamodelQueryRule.objects.create(
            self_conversion=SelfConversionType.SUM,
            attribute_to_sum="capacity_kw",
            self_conversion_factor=1,
            rule_action_conversion_step=rule_action_conversion,
            model_type=ModelType.GRIDCONNECTION.value,
        )
        AttributeFilter.objects.create(
            rule=data_query_rule,
            model_attribute="id",
            comparator=AttributeFilterComparator.EQUAL,
            value=self.gridconnection_0.id,
        )

        interactive_elements = [
            InteractiveElementInput(
                value="4",
                interactive_element=self.interactive_element,
            )
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.get_repository_for_model_type(
            "EnergyAsset", "ElectricHeatConversionAsset"
        )
        assert (
            ehc_assets.first().capacityElectricity_kW == 750.0
        )  # 1 (factor) x 750 x 3 (query 1 gridconnection sum capacity_kw )
