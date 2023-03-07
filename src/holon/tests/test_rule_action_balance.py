from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping
from holon.models.rule_action import RuleActionFactor


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test", etm_scenario_id=1)
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
        ChemicalHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_gas_burner",
            type=ConversionAssetType.GAS_BURNER,
            eta_r=0.95,
            deliveryTemp_degc=90.0,
            capacityHeat_kW=60.0,
        )
        ChemicalHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_gas_burner",
            type=ConversionAssetType.GAS_BURNER,
            eta_r=0.95,
            deliveryTemp_degc=90.0,
            capacityHeat_kW=60.0,
        )
        ElectricHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degc=70.0,
            capacityElectricity_kW=30.0,
        )
        ElectricHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degc=70.0,
            capacityElectricity_kW=30.0,
        )
        HybridHeatCoversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_hybrid_heat_pump",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.95,
            deliveryTemp_degc=80.0,
            capacityHeat_kW=30.0,
            ambientTempType=20.0
        )
        TransportHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_hybrid_heat_pump",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.95,
            deliveryTemp_degc=80.0,
            capacityElectricity_kW=30.0,
            ambientTempType=""
        )
        TransportHeatConversionAsset.objects.create(
            gridconnection=gridconnection,
            name="building_hybrid_heat_pump",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.95,
            deliveryTemp_degc=80.0,
            capacityElectricity_kW=30.0,
            ambientTempType=""
        )
        self.interactive_element: InteractiveElement = InteractiveElement.objects.create(
            name="Input 1", type=ChoiceType.continuous
        )
        InteractiveElementContinuousValues.objects.create(input=self.interactive_element)

        # Asset order
        default_ehc = ElectricHeatConversionAsset.objects.create(
            name="template_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.,
            deliveryTemp_degc=0.0,
            capacityElectricity_kW=0.0,
        )
        default_hhc = HybridHeatCoversionAsset.objects.create(
            name="template_hybrid_heat_pump",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.,
            deliveryTemp_degc=0.0,
            capacityHeat_kW=0.0,
            ambientTempType=0.0
        )
        default_chc = ChemicalHeatConversionAsset.objects.create(
            name="template_gas_burner",
            type=ConversionAssetType.GAS_BURNER,
            eta_r=0.,
            deliveryTemp_degc=0.0,
            capacityHeat_kW=0.0,
        )
        default_thc = TransportHeatConversionAsset.objects.create(
            name="template_hybrid_heat_pump",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.,
            deliveryTemp_degc=0.0,
            capacityElectricity_kW=0.0,
            ambientTempType=""
        )
        
        rule = ScenarioRule.objects.create(
            interactive_element=self.interactive_element,
            model_type=ModelType.ENERGYASSET
        )
        self.balance_group = RuleActionBalanceGroup.objects.create(
            rule=rule
        )

        BalanceGroupAssetOrder.objects.create(
            balance_group=self.balance_group,
            asset=default_chc,
            sort_order=0
        )
        BalanceGroupAssetOrder.objects.create(
            balance_group=self.balance_group,
            asset=default_ehc,
            sort_order=1
        )
        BalanceGroupAssetOrder.objects.create(
            balance_group=self.balance_group,
            asset=default_hhc,
            sort_order=2
        )
        BalanceGroupAssetOrder.objects.create(
            balance_group=self.balance_group,
            asset=default_thc,
            sort_order=4
        )

    # TODO
    # test values of new assets 

    def test_rule_mapping_balancegroup_increase_upper(self):
        """ Test the application of a RuleActionBalanceGroup when increasing the amount of the selected asset at the top of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'ChemicalHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 4, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 4)   # was 3
        assert(n_ehc_assets == 2)   # was 2
        assert(n_hhc_assets == 1)   # was 1
        assert(n_thc_assets == 1)   # was 2


    def test_rule_mapping_balancegroup_increase_middle(self):
        """ Test the application of a RuleActionBalanceGroup when increasing the amount of the selected asset in the middle of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'HybridHeatCoversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 2, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 3)   # was 3
        assert(n_ehc_assets == 2)   # was 2
        assert(n_hhc_assets == 2)   # was 1
        assert(n_thc_assets == 1)   # was 2


    def test_rule_mapping_balancegroup_increase_bottom(self):
        """ Test the application of a RuleActionBalanceGroup when increasing the amount of the selected asset at the bottom of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'TransportHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 3, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 3)   # was 3
        assert(n_ehc_assets == 2)   # was 2
        assert(n_hhc_assets == 0)   # was 1
        assert(n_thc_assets == 3)   # was 2



    def test_rule_mapping_balancegroup_decrease_upper(self):
        """ Test the application of a RuleActionBalanceGroup when decreasing the amount of the target asset at the top of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'ChemicalHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 1, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 1)   # was 3
        assert(n_ehc_assets == 4)   # was 2
        assert(n_hhc_assets == 1)   # was 1
        assert(n_thc_assets == 2)   # was 2


    def test_rule_mapping_balancegroup_decrease_middle(self):
        """ Test the application of a RuleActionBalanceGroup when decreasing the amount of the target assetin the middle of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'ElectricHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 0, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 5)   # was 3
        assert(n_ehc_assets == 0)   # was 2
        assert(n_hhc_assets == 1)   # was 1
        assert(n_thc_assets == 2)   # was 2


    def test_rule_mapping_balancegroup_decrease_bottom(self):
        """ Test the application of a RuleActionBalanceGroup when decreasing the amount of the target asset at the bottom of the ordered list """

        # Arrange
        self.balance_group.selected_asset_type = 'TransportHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 1, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 3)   # was 3
        assert(n_ehc_assets == 2)   # was 2
        assert(n_hhc_assets == 2)   # was 1
        assert(n_thc_assets == 1)   # was 2


    def test_rule_mapping_balancegroup_overflow(self):
        """ Test the application of a RuleActionBalanceGroup when increasing the amount of the selected asset in the middle of the ordered list such that multiple assets get decreased in count """

        # Arrange
        self.balance_group.selected_asset_type = 'ElectricHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 5, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 3)   # was 3
        assert(n_ehc_assets == 5)   # was 2
        assert(n_hhc_assets == 0)   # was 1
        assert(n_thc_assets == 0)   # was 2


    def test_rule_mapping_balancegroup_new_asset(self):
        """ Test the application of a RuleActionBalanceGroup when increasing the amount of the selected asset in the middle of the ordered list such that multiple assets get decreased in count """

        # Arrange
        default_vc = VehicleConversionAsset.objects.create(
            name="template_vehicle_conversion",
            type=ConversionAssetType.HEAT_DELIVERY_SET,
            eta_r=0.0,
            energyConsumption_kWhpkm = 0.0,
            vehicleScaling = 0.0       
        )
        
        BalanceGroupAssetOrder.objects.create(
            balance_group=self.balance_group,
            asset=default_vc,
            sort_order=3
        )

        self.balance_group.selected_asset_type = 'TransportHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 0, "interactive_element": self.interactive_element}]

        # Act
        updated_scenario = rule_mapping.get_scenario_and_apply_rules(
            self.scenario.id, interactive_elements
        )

        # Assert
        n_chc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ChemicalHeatConversionAsset'])
        n_ehc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'ElectricHeatConversionAsset'])
        n_hhc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'HybridHeatCoversionAsset'])
        n_vc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'VehicleConversionAsset'])
        n_thc_assets = len([asset for asset in updated_scenario.assets if asset.__class__.__name__ == 'TransportHeatConversionAsset'])

        assert(n_chc_assets == 3)   # was 3
        assert(n_ehc_assets == 2)   # was 2
        assert(n_hhc_assets == 1)   # was 1
        assert(n_vc_assets == 2)    # was 0
        assert(n_thc_assets == 0)   # was 2


    def test_rule_mapping_validation_target_count(self):
        """ Verify RuleActionBalanceGroup throws a ValueError when target_count is larger than the total amount of items """
        # Arrange
        self.balance_group.selected_asset_type = 'ChemicalHeatConversionAsset'
        self.balance_group.save()

        interactive_elements = [{"value": 20, "interactive_element": self.interactive_element}]

        # Act
        with pytest.raises(ValueError) as e:
            updated_scenario = rule_mapping.get_scenario_and_apply_rules(
                self.scenario.id, interactive_elements
            )
            assert("target count" in e)


    # def test_rule_mapping_validation_unknown_assets(self):
    #     """ Verify RuleActionBalanceGroup throws a ValueError when not all filtered assets are in its ordered asset list """
    #     # Arrange
    #     rule = ScenarioRule.objects.create(
    #         interactive_element=self.interactive_element,
    #         model_type=ModelType.ENERGYASSET
    #     )
    #     balance_group = RuleActionBalanceGroup.objects.create(
    #         asset_order=['ChemicalHeatConversionAsset', 'ElectricHeatConversionAsset'], selected_asset_type='ChemicalHeatConversionAsset', rule=rule
    #     )
    #     interactive_elements = [{"value": 6, "interactive_element": self.interactive_element}]

    #     # Act
    #     with pytest.raises(ValueError) as e:
    #         updated_scenario = rule_mapping.get_scenario_and_apply_rules(
    #             self.scenario.id, interactive_elements
    #         )
    #         assert("All filtered assets should be present in the asset order" in e)