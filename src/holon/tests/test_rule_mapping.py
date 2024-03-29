from django.test import TestCase

from holon.models import *
from holon.rule_engine import rule_mapping
from holon.models.rule_actions.rule_action_factor import RuleActionFactor
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
        ChemicalHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_gas_burner",
            type=ConversionAssetType.GAS_BURNER,
            eta_r=0.95,
            deliveryTemp_degC=90.0,
            capacityHeat_kW=60.0,
        )
        contract: DeliveryContract = DeliveryContract.objects.create(
            deliveryContractType=DeliveryContractType.FIXED,
            contractScope=actor,
            energyCarrier=EnergyCarrier.ELECTRICITY,
            annualFee_eur=100.0,
            actor=actor,
            deliveryPrice_eurpkWh=0.0,
            feedinPrice_eurpkWh=0.0,
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
        interactive_elements = [
            InteractiveElementInput(value="0", interactive_element=self.interactive_element)
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
        self.assertEqual(updated_gridconnection.capacity_kw, factor.min_value)

    def test_rule_mapping_assets(self) -> None:
        # Arange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ENERGYASSET,
            model_subtype="ChemicalHeatConversionAsset",
        )
        factor = RuleActionFactor.objects.create(
            model_attribute="deliveryTemp_degC", min_value=5, max_value=55, rule=rule
        )
        interactive_elements = [
            InteractiveElementInput(value="0", interactive_element=self.interactive_element)
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        updated_asset = updated_scenario.repositories[ModelType.ENERGYASSET.value].first()
        self.assertEqual(updated_asset.deliveryTemp_degC, factor.min_value)

    def test_rule_mapping_contracts(self) -> None:
        # Arange
        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.CONTRACT,
            model_subtype="DeliveryContract",
        )
        factor = RuleActionFactor.objects.create(
            model_attribute="annualFee_eur", min_value=5, max_value=55, rule=rule
        )
        interactive_elements = [
            InteractiveElementInput(value="0", interactive_element=self.interactive_element)
        ]

        # Act
        scenario_aggregate = ScenarioAggregate(self.scenario)
        updated_scenario: ScenarioAggregate = rule_mapping.apply_rules(
            scenario_aggregate, interactive_elements
        )

        # Assert
        updated_contract = updated_scenario.repositories[ModelType.CONTRACT.value].first()
        self.assertEqual(updated_contract.annualFee_eur, factor.min_value)
