from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping
from holon.models.rule_actions.rule_action_factor import RuleActionFactor


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
        ChemicalHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_gas_burner",
            type=ConversionAssetType.GAS_BURNER,
            eta_r=0.95,
            deliveryTemp_degc=90.0,
            capacityHeat_kW=60.0,
        )
        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_CONTINUOUS, scenario=self.scenario
        )
        self.interactive_element_continuous_values = (
            InteractiveElementContinuousValues.objects.create(input=self.interactive_element)
        )

    def test_rule_mapping_gridconnection(self) -> None:
        # Arange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.GRIDCONNECTION,
            model_subtype="BuildingGridConnection",
        )
        factor = RuleActionFactor.objects.create(
            model_attribute="capacity_kw", min_value=5, max_value=55, rule=rule
        )
        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        updated_gridconnection = updated_scenario.gridconnection_set.all()[0]
        self.assertEqual(updated_gridconnection.capacity_kw, factor.min_value)

    def test_rule_mapping_assets(self) -> None:
        # Arange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ChemicalHeatConversionAsset",
        )
        factor = RuleActionFactor.objects.create(
            model_attribute="deliveryTemp_degc", min_value=5, max_value=55, rule=rule
        )
        interactive_elements = [{"value": "0", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        updated_asset = updated_scenario.assets[0]
        self.assertEqual(updated_asset.deliveryTemp_degc, factor.min_value)
