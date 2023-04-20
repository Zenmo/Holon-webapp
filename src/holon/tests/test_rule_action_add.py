from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")

        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.CHOICE_CONTINUOUS, scenario=self.scenario
        )
        self.interactive_element_continuous_values = (
            InteractiveElementContinuousValues.objects.create(input=self.interactive_element)
        )

    def test_rule_action_add_asset(self):
        """Test the add rule action for an asset"""

        self.actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        BuildingGridConnection.objects.create(
            owner_actor=self.actor,
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
        ElectricHeatConversionAsset.objects.create(
            gridconnection=gridconnection_2,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )

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
        rule_action_add = RuleActionAdd.objects.create(asset_to_add=default_ehc, rule=rule)

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
        assert n_ehc_assets == 8  # was 3

    def test_rule_action_add_asset_empty_filter(self):
        """Test the add rule action when a filter is empty"""

        self.actor: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        BuildingGridConnection.objects.create(
            owner_actor=self.actor,
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
            model_subtype="ProductionGridConnection",
        )
        rule_action_add = RuleActionAdd.objects.create(asset_to_add=default_ehc, rule=rule)

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
        assert n_ehc_assets == 1  # was 1

    def test_rule_action_add_contract(self):
        """Test the add rule action for a contract and check if contractscope is connected correctly"""

        actor_without_contract: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        # Arrange
        holder_actor = Actor.objects.create(
            category=ActorType.SUPPLIERENERGY, payload=self.scenario
        )

        contract_scope = Actor.objects.create(
            category=ActorType.OPERATORGRID, payload=self.scenario
        )

        default_contract = DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=holder_actor,
            contractScope=contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )

        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
            model_subtype="",
        )
        RelationExistsFilter.objects.create(
            rule=rule, invert_filter=True, relation_field="contracts"
        )
        RuleActionAdd.objects.create(contract_to_add=default_contract, rule=rule)

        interactive_elements = [{"value": "1", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        # check if a contract was added
        assert len(updated_scenario.contracts) == 3

        # check if the cloned actor without contract now has a contract
        cloned_actor = updated_scenario.actor_set.get(original_id=actor_without_contract.id)
        assert len(cloned_actor.contracts.all()) == 1

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        cloned_contract_scope = updated_scenario.actor_set.get(original_id=contract_scope.id)
        added_contract = cloned_actor.contracts.first()

        assert added_contract.contractScope == cloned_contract_scope
        assert added_contract.contractScope.original_id == contract_scope.id

    def test_rule_action_add_contract_multiple(self):
        """Test the add rule action for multiple contracts and check if contractscope is connected correctly"""

        actor_without_contract_0: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        actor_without_contract_1: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        # Arrange
        holder_actor = Actor.objects.create(
            category=ActorType.SUPPLIERENERGY, payload=self.scenario
        )

        contract_scope = Actor.objects.create(
            category=ActorType.OPERATORGRID, payload=self.scenario
        )

        default_contract = DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            # actor=holder_actor,
            contractScope=contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )

        rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
            model_subtype="",
        )
        RelationExistsFilter.objects.create(
            rule=rule, invert_filter=True, relation_field="contracts"
        )
        RuleActionAdd.objects.create(contract_to_add=default_contract, rule=rule)

        interactive_elements = [{"value": "2", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        # check if a contract was added
        assert len(updated_scenario.contracts) == 2

        # check if the cloned actor without contract now has a contract
        cloned_actor_0 = updated_scenario.actor_set.get(original_id=actor_without_contract_0.id)
        cloned_actor_1 = updated_scenario.actor_set.get(original_id=actor_without_contract_1.id)
        assert len(cloned_actor_0.contracts.all()) == 1
        assert len(cloned_actor_1.contracts.all()) == 1

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        added_contract_0 = cloned_actor_0.contracts.first()
        added_contract_1 = cloned_actor_1.contracts.first()

        cloned_contract_scope = updated_scenario.actor_set.get(original_id=contract_scope.id)
        assert added_contract_0.contractScope == cloned_contract_scope
        assert added_contract_1.contractScope == cloned_contract_scope

    def test_rule_action_add_contract_multiple_and_remove_beforehand(self):
        """Test the add rule action of multiple contracts preceded by a remove"""

        # Arrange
        actor_with_contract_0: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        actor_with_contract_1: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )

        Actor.objects.create(category=ActorType.SUPPLIERENERGY, payload=self.scenario)

        contract_scope = Actor.objects.create(
            category=ActorType.OPERATORGRID, payload=self.scenario
        )

        DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=actor_with_contract_0,
            contractScope=contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )
        DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            actor=actor_with_contract_1,
            contractScope=contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )

        default_contract = DeliveryContract.objects.create(
            name="template_delivery_contract",
            energyCarrier=EnergyCarrier.ELECTRICITY,
            # actor=holder_actor,
            contractScope=contract_scope,
            deliveryContractType=DeliveryContractType.FIXED,
            deliveryPrice_eurpkWh=1,
            feedinPrice_eurpkWh=1,
        )

        remove_rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.CONTRACT,
            model_subtype="",
        )
        RuleActionRemove.objects.create(rule=remove_rule, remove_mode=RemoveMode.REMOVE_ALL)

        add_rule = ScenarioRule.objects.create(
            interactive_element_continuous_values=self.interactive_element_continuous_values,
            model_type=ModelType.ACTOR,
            model_subtype="",
        )
        RelationExistsFilter.objects.create(
            rule=add_rule, invert_filter=True, relation_field="contracts"
        )
        RuleActionAdd.objects.create(contract_to_add=default_contract, rule=add_rule)

        interactive_elements = [{"value": "2", "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        # check if a contract was added
        assert len(updated_scenario.contracts) == 2

        # check if the cloned actor without contract now has a contract
        cloned_actor_0 = updated_scenario.actor_set.get(original_id=actor_with_contract_0.id)
        cloned_actor_1 = updated_scenario.actor_set.get(original_id=actor_with_contract_1.id)
        assert len(cloned_actor_0.contracts.all()) == 1
        assert len(cloned_actor_1.contracts.all()) == 1

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        added_contract_0 = cloned_actor_0.contracts.first()
        added_contract_1 = cloned_actor_1.contracts.first()

        cloned_contract_scope = updated_scenario.actor_set.get(original_id=contract_scope.id)
        assert added_contract_0.contractScope == cloned_contract_scope
        assert added_contract_1.contractScope == cloned_contract_scope
