from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping


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
        self.interactive_element_continuous_values = (
            InteractiveElementContinuousValues.objects.create(input=self.interactive_element)
        )

    def test_rule_action_add_multiple_assets(self):
        """Test the add multiple models under each parent rule action"""

        # Arrange
        default_ehc = ElectricHeatConversionAsset.objects.create(
            name="template_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.0,
            deliveryTemp_degC=0.0,
            capacityElectricity_kW=0.0,
        )

        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        rule_action_add = RuleActionAddMultipleUnderEachParent.objects.create(
            asset_to_add=default_ehc, rule=rule
        )

        interactive_elements = [{"value": "4", "interactive_element": self.interactive_element}]

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
        assert n_ehc_assets == 13  # was 1, add 3 x 4 assets

    def test_rule_action_add_multiple_gridconnection_with_children(self):
        """Test the add rule action for an actor with contracts"""

        # Arrange
        existing_contract_scope = Actor.objects.create(
            category=ActorType.OPERATORGRID, payload=self.scenario
        )
        new_actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER,
        )
        DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=new_actor,
            contractScope=existing_contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )

        gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=new_actor,
            capacity_kw=750.0,
            # payload=self.scenario,
            is_rule_action_template=True,
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

        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.SCENARIO,
        )
        RuleActionAddMultipleUnderEachParent.objects.create(
            gridconnection_to_add=gridconnection_0, rule=rule
        )
        interactive_elements = [{"value": "5", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        assert len(updated_scenario.gridconnection_set.all()) == 8  # was 3
        assert len(updated_scenario.assets) == 6  # was 1
        assert len(updated_scenario.actor_set.all()) == 7  # was 2
        assert len(updated_scenario.contracts) == 5  # was 0
        assert (
            updated_scenario.actor_set.all()[6].contracts.first().contractScope.id
            != existing_contract_scope.id
        )
        assert (
            updated_scenario.actor_set.all()[6].contracts.first().contractScope.original_id
            == existing_contract_scope.id
        )
