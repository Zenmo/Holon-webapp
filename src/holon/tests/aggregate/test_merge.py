from django.test import TestCase

from holon.models import *
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType
from holon.rule_engine.repositories import GridConnectionRepository, EnergyAssetRepository


class ScenarioAggregateMergeTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor0: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, id=0
        )
        self.actor1: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario, id=1
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
        self.asset1 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
            id=1,
        )

        self.scenario_aggregate = ScenarioAggregate(self.scenario)

    def test_merge_repository(self):
        repository_0 = GridConnectionRepository([self.gridconnection_0])
        repository_1 = GridConnectionRepository([self.gridconnection_1])

        merged_repository = repository_0.merge(repository_1)

        assert merged_repository.len() == 2

    def test_merge_repository_deduplication(self):
        repository_0 = self.scenario_aggregate.get_repository_for_model_type(
            ModelType.GRIDCONNECTION.value
        )
        repository_1 = self.scenario_aggregate.get_repository_for_model_type(
            ModelType.GRIDCONNECTION.value
        )

        merged_repository = repository_0.merge(repository_1)

        assert merged_repository.len() == 2

    def test_merge_repository_different_classes(self):
        gridconnection_repository = GridConnectionRepository([self.gridconnection_0])
        energyasset_repository = EnergyAssetRepository([self.asset1])

        self.assertRaises(
            TypeError,
            gridconnection_repository.merge,
            energyasset_repository,
        )
