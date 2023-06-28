from django.test import TestCase

from holon.models import *
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType


class ScenarioAggregateGetTestClass(TestCase):
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
        self.gridconnection_2: ProductionGridConnection = ProductionGridConnection.objects.create(
            owner_actor=self.actor2,
            capacity_kw=750.0,
            payload=self.scenario,
            category=ProductionCategory.WINDFARM,
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
        self.asset3 = ChemicalHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_1,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityHeat_kW=50.0,
            id=3,
        )
        self.asset4 = EnergyAsset.objects.create(
            gridconnection=self.gridconnection_2,
            id=4,
        )

        self.scenario_aggregate = ScenarioAggregate(self.scenario)

    def test_get_repository(self):
        repo = self.scenario_aggregate.get_repository_for_model_type(ModelType.GRIDCONNECTION.value)
        assert repo.base_model_type == GridConnection
        assert repo.len() == 3

    def test_get_repository_subtype(self):
        repo = self.scenario_aggregate.get_repository_for_model_type(
            ModelType.ENERGYASSET.value, EnergyAsset.__name__
        )
        assert repo.len() == 4

        repo = self.scenario_aggregate.get_repository_for_model_type(
            ModelType.ENERGYASSET.value, ElectricHeatConversionAsset.__name__
        )
        assert repo.len() == 2

        repo = self.scenario_aggregate.get_repository_for_model_type(
            ModelType.ENERGYASSET.value, HeatConversionAsset.__name__
        )
        assert repo.len() == 3

    def test_get_repository_relation_field_parent_to_child(self):
        repo = self.scenario_aggregate.get_repository_for_relation_field(
            ModelType.GRIDCONNECTION.value, "energyasset"
        )
        assert repo.base_model_type == EnergyAsset

        repo = self.scenario_aggregate.get_repository_for_relation_field(
            ModelType.ACTOR.value, "gridconnection"
        )
        assert repo.base_model_type == GridConnection

    def test_get_repository_relation_field_submodel_type(self):
        repo = self.scenario_aggregate.get_repository_for_relation_field(
            ModelType.ENERGYASSET.value,
            "gridconnection",
            model_subtype_name=ProductionGridConnection.__name__,
        )
        assert isinstance(repo.first(), ProductionGridConnection)
