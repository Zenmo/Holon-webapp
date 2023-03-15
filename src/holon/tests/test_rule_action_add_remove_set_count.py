from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping
from holon.models.rule_action import RuleActionFactor


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
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
        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_CONTINUOUS, scenario=self.scenario
        )
        InteractiveElementContinuousValues.objects.create(input=self.interactive_element)

    def test_rule_action_add_asset(self):
        """Test the add rule action"""

        # Arrange
        default_ehc = ElectricHeatConversionAsset.objects.create(
            name="template_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.0,
            deliveryTemp_degC=0.0,
            capacityElectricity_kW=0.0,
        )

        rule = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_add = RuleActionAdd.objects.create(asset=default_ehc, rule=rule)

        interactive_elements = [{"value": "2", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_ehc_assets = len(
            [
                asset
                for asset in updated_scenario.assets
                if asset.__class__.__name__ == "ElectricHeatConversionAsset"
            ]
        )
        assert n_ehc_assets == 3  # was 1

    def test_rule_action_remove(self):
        """Test the remove rule action"""

        # Arrange
        rule = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.ENERGYASSET,
            model_subtype="HybridHeatCoversionAsset",
        )
        rule_action_remove = RuleActionRemove.objects.create(rule=rule)

        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_hhc_assets = len(
            [
                asset
                for asset in updated_scenario.assets
                if asset.__class__.__name__ == "HybridHeatCoversionAsset"
            ]
        )
        assert n_hhc_assets == 0  # was 1

    def test_rule_action_set_count(self):
        """Test the add rule action"""

        # Arrange
        default_ehc = ElectricHeatConversionAsset.objects.create(
            name="template_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.0,
            deliveryTemp_degC=0.0,
            capacityElectricity_kW=0.0,
        )

        rule = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_set_count = RuleActionSetCount.objects.create(asset=default_ehc, rule=rule)

        interactive_elements = [{"value": "2", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_ehc_assets = len(
            [
                asset
                for asset in updated_scenario.assets
                if asset.__class__.__name__ == "ElectricHeatConversionAsset"
            ]
        )
        assert n_ehc_assets == 2  # was 1
