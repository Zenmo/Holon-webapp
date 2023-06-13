from django.test import TestCase
import pytest

from holon.models import *
from holon.models import rule_mapping
from holon.rule_engine.scenario_aggregate import ScenarioAggregate
from holon.models.scenario_rule import ModelType


class RuleMappingTestClass(TestCase):
    def setUp(self) -> None:
        self.scenario: Scenario = Scenario.objects.create(name="test")
        self.actor0: Actor = Actor.objects.create(
            category=ActorType.CONNECTIONOWNER, payload=self.scenario
        )
        self.gridconnection_0: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor1,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_1: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor1,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.gridconnection_2: BuildingGridConnection = BuildingGridConnection.objects.create(
            owner_actor=self.actor2,
            capacity_kw=750.0,
            payload=self.scenario,
            insulation_label=InsulationLabel.A,
            heating_type=HeatingType.GASBURNER,
            type=BuildingType.LOGISTICS,
        )
        self.asset1 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )
        self.asset2 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_0,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )
        self.asset3 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_1,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )
        self.asset4 = ElectricHeatConversionAsset.objects.create(
            gridconnection=self.gridconnection_2,
            name="building_heat_pump",
            type=ConversionAssetType.HEAT_PUMP_AIR,
            eta_r=0.95,
            deliveryTemp_degC=70.0,
            capacityElectricity_kW=30.0,
        )

    def test_add_and_remove_actor(self):
        scenario_aggregate = ScenarioAggregate(self.scenario)

        # Sanity check
        assert scenario_aggregate.get_repository_for_model_type(ModelType.ACTOR.value).len() == 2
        assert scenario_aggregate.get_repository_for_model_type(ModelType.GRIDCONNECTION.value).len() == 3
        assert scenario_aggregate.get_repository_for_model_type(ModelType.ENERGYASSET.value).len() == 4

        scenario_aggregate.remove_object(self.actor1)
