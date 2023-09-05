from django.test import TestCase

from holon.models import *
from holon.models import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.filter.attribute_filter_comparator import AttributeFilterComparator
from holon.models.scenario_rule import ModelType
from holon.serializers import InteractiveElementInput


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
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 8  # was 3

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
        ehc_assets = updated_scenario.repositories[
            ModelType.ENERGYASSET.value
        ].filter_model_subtype(ElectricHeatConversionAsset)
        assert ehc_assets.len() == 1  # was 1

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
        # check if a contract was added
        assert updated_scenario.repositories[ModelType.CONTRACT.value].len() == 3

        # check if the cloned actor without contract now has a contract
        cloned_actor = updated_scenario.repositories[ModelType.ACTOR.value].get(
            actor_without_contract.id
        )
        cloned_actor_contracts = updated_scenario.repositories[
            ModelType.CONTRACT.value
        ].filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor.id)
        assert cloned_actor_contracts.len() == 1

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        cloned_contract_scope = updated_scenario.repositories[ModelType.ACTOR.value].get(
            contract_scope.id
        )

        added_contract = cloned_actor_contracts.first()

        assert added_contract.contractScope == cloned_contract_scope
        assert added_contract.contractScope.id == contract_scope.id

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
        AttributeFilter.objects.create(
            rule=rule,
            model_attribute="category",
            comparator=AttributeFilterComparator.EQUAL,
            value="CONNECTIONOWNER",
        )
        RuleActionAdd.objects.create(contract_to_add=default_contract, rule=rule)

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
        # check if a contract was added
        assert updated_scenario.repositories[ModelType.CONTRACT.value].len() == 2

        # check if the cloned actor without contract now has a contract
        cloned_actor_0 = updated_scenario.repositories[ModelType.ACTOR.value].get(
            actor_without_contract_0.id
        )
        cloned_actor_1 = updated_scenario.repositories[ModelType.ACTOR.value].get(
            actor_without_contract_1.id
        )
        assert (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_0.id)
            .len()
            == 1
        )
        assert (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_1.id)
            .len()
            == 1
        )

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        added_contract_0 = (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_0.id)
            .first()
        )
        added_contract_1 = (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_1.id)
            .first()
        )

        cloned_contract_scope = updated_scenario.repositories[ModelType.ACTOR.value].get(
            contract_scope.id
        )
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
        AttributeFilter.objects.create(
            rule=add_rule,
            model_attribute="category",
            comparator=AttributeFilterComparator.EQUAL,
            value="CONNECTIONOWNER",
        )
        RuleActionAdd.objects.create(contract_to_add=default_contract, rule=add_rule)

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
        # check if a contract was added
        assert updated_scenario.repositories[ModelType.CONTRACT.value].len() == 2

        # check if the cloned actor without contract now has a contract
        cloned_actor_0 = updated_scenario.repositories[ModelType.ACTOR.value].get(
            actor_with_contract_0.id
        )
        cloned_actor_1 = updated_scenario.repositories[ModelType.ACTOR.value].get(
            actor_with_contract_1.id
        )
        assert (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_0.id)
            .len()
            == 1
        )
        assert (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_1.id)
            .len()
            == 1
        )

        # check if the cloned contract's contractScope is updated to the cloned contractScope
        added_contract_0 = (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_0.id)
            .first()
        )
        added_contract_1 = (
            updated_scenario.repositories[ModelType.CONTRACT.value]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, cloned_actor_1.id)
            .first()
        )

        cloned_contract_scope = updated_scenario.repositories[ModelType.ACTOR.value].get(
            contract_scope.id
        )
        assert added_contract_0.contractScope == cloned_contract_scope
        assert added_contract_1.contractScope == cloned_contract_scope

    def test_rule_action_add_gridconnection_with_children(self):
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
        RuleActionAdd.objects.create(gridconnection_to_add=gridconnection_0, rule=rule)
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
        assert updated_scenario.repositories[ModelType.GRIDCONNECTION].len() == 1  # was 0
        added_gridconnection = updated_scenario.repositories[ModelType.GRIDCONNECTION].first()
        assert (
            updated_scenario.repositories[ModelType.ENERGYASSET]
            .filter_attribute_value(
                "gridconnection_id", AttributeFilterComparator.EQUAL, added_gridconnection.id
            )
            .len()
            == 1
        )  # was 0
        assert updated_scenario.repositories[ModelType.ACTOR].len() == 2  # was 1
        added_actor = updated_scenario.repositories[ModelType.ACTOR].all()[1]
        assert (
            updated_scenario.repositories[ModelType.CONTRACT]
            .filter_attribute_value("actor_id", AttributeFilterComparator.EQUAL, added_actor.id)
            .len()
            == 1
        )  # was 0
