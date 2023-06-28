from django.test import TestCase

from holon.models import *
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType


class ScenarioAggregateAddTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor0: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, id=0
        )
        self.actor1: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, id=1
        )
        self.actor2: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, id=2
        )
        self.gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor1,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
            id=0,
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor1,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
            id=1,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor2,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
            id=2,
        )
        self.asset1 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=1,
        )
        self.asset2 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=2,
        )
        self.asset3 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_1,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=3,
        )
        self.asset4 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_2,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=4,
        )

        self.scenario_aggregate = ScenarioAggregate(self.scenario)

    def test_add_asset(self):
        asset5 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_2,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=5,
        )

        self.assertRaises(
            ValueError,
            self.scenario_aggregate.repositories[ModelType.ENERGYASSET.value].get,
            5,
        )
        new_object = self.scenario_aggregate.add_object(asset5)

        self.scenario_aggregate.repositories[ModelType.ENERGYASSET.value].get(
            new_object.id
        ) == new_object

        assert self.scenario_aggregate.repositories[ModelType.ENERGYASSET.value].len() == 5

    def test_add_empty_repo_type(self):
        gridnode = GridNode(id=22)

        self.assertRaises(
            ValueError,
            self.scenario_aggregate.repositories[ModelType.GRIDNODE.value].get,
            22,
        )
        new_object = self.scenario_aggregate.add_object(gridnode)

        self.scenario_aggregate.repositories[ModelType.GRIDNODE.value].get(
            new_object.id
        ) == new_object

    def test_add_with_params(self):
        asset5 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_2,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=5,
        )

        new_object = self.scenario_aggregate.add_object(
            asset5, additional_attributes={"deliveryTemp_degC": 50.0}
        )

        assert new_object.deliveryTemp_degC == 50.0

        assert (
            self.scenario_aggregate.repositories[ModelType.ENERGYASSET.value]
            .get(new_object.id)
            .deliveryTemp_degC
            == 50.0
        )
