from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        DeliveryContract.objects.create(
            name="delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=actor,
            contractScope=actor,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )
        ConnectionContract.objects.create(
            name="connection_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=actor,
            contractScope=actor,
            connectionContractType=ConnectionContractType.DEFAULT,
            nfATO_capacity_kW=1,
            nfATO_starttime_h=1,
            nfATO_endtime_h=1,
        )
        gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
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
            gridconnection=gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )
        ElectricHeatConversionAsset.objects.create(
            gridconnection=gridconnection_1,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )
        EnergyAsset.objects.create(gridconnection=gridconnection_2, name="asset 2")
        ConsumptionAsset.objects.create(
            gridconnection=gridconnection_2, name="asset 2", type="ELECTRICITY_DEMAND"
        )
        ElectricHeatConversionAsset.objects.create(
            gridconnection=gridconnection_2,
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

    def test_rule_action_remove_all(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.REMOVE_ALL
        )

        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 0  # was 3

    def test_rule_action_remove_none(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.REMOVE_N
        )

        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 3  # was 3

    def test_rule_action_remove_n(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.REMOVE_N
        )

        interactive_elements = [{"value": "1", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 2  # was 3

    def test_rule_action_keep_n(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.KEEP_N
        )

        interactive_elements = [{"value": "1", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 1  # was 3

    def test_rule_action_keep_all(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ElectricHeatConversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.KEEP_N
        )

        interactive_elements = [{"value": "3", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 3  # was 3

    # TODO vanaf hier omschrijven naar nieuwe rule engine - TAVM
    def test_rule_action_remove_all_gridconnections(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.REMOVE_ALL
        )

        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert updated_scenario.repositories[ModelType.GRIDCONNECTION].len() == 0
        assert updated_scenario.repositories[ModelType.ENERGYASSET].len() == 0
        assert updated_scenario.repositories[ModelType.ACTOR].len() == 1

    def test_rule_action_remove_all_actors(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
        )
        rule_action_remove = RuleActionRemove.objects.create(
            rule=rule, remove_mode=RemoveMode.REMOVE_ALL
        )

        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        assert updated_scenario.repositories[ModelType.ACTOR].len() == 0
        assert updated_scenario.repositories[ModelType.GRIDCONNECTION].len() == 0
        assert updated_scenario.repositories[ModelType.ENERGYASSET].len() == 0
