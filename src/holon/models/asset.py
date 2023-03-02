from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from polymorphic.models import PolymorphicModel

from holon.models.gridconnection import GridConnection
from holon.models.gridnode import GridNode


class EnergyAsset(PolymorphicModel):
    gridconnection = models.ForeignKey(
        GridConnection, on_delete=models.SET_NULL, null=True, blank=True
    )
    gridnode = models.ForeignKey(GridNode, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    def clean(self):
        not_connected = self.gridconnection is None and self.gridnode is None
        connected_twice = self.gridconnection is not None and self.gridnode is not None

        if not_connected or connected_twice:
            raise ValidationError(
                "Asset should be connected to either a grid node or a grid connection!"
            )

    def __str__(self):
        try:
            string = (
                f"{self.name} - {self.id} ({self.gridconnection.category}{self.gridconnection.id})"
            )
        except AttributeError:
            string = f"{self.name} - {self.id} ({self.gridnode.__str__()})"

        return string


# %% Consumption assets


class ConsumptionAssetType(models.TextChoices):
    ELECTRICITY_DEMAND = "ELECTRICITY_DEMAND"
    HEAT_DEMAND = "HEAT_DEMAND"
    HOT_WATER_CONSUMPTION = "HOT_WATER_CONSUMPTION"
    OTHER_ELECTRICITY_CONSUMPTION = "OTHER_ELECTRICITY_CONSUMPTION"
    DIESEL_VEHICLE = "DIESEL_VEHICLE"


class ConsumptionAsset(EnergyAsset):
    category = "CONSUMPTION"
    type = models.CharField(max_length=255, choices=ConsumptionAssetType.choices)

    def clean(self) -> None:
        if (
            self.__class__.__name__ != "DieselVehicleAsset"
            and self.type == ConsumptionAssetType.DIESEL_VEHICLE
        ):
            raise ValidationError("Only DieselVehicleAsset can have type `DIESEL_VEHICLE`")
        return super().clean()


class DieselVehicleAsset(ConsumptionAsset):
    name: str
    energyConsumption_kWhpkm = models.FloatField()
    vehicleScaling = models.IntegerField()

    def clean(self) -> None:
        if self.type != ConsumptionAssetType.DIESEL_VEHICLE:
            print(self.type)
            raise ValidationError("DieselVehicleAsset can only have type `DIESEL_VEHICLE`")
        return super().clean()


class HeatConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()


class ElectricConsumptionAsset(ConsumptionAsset):
    yearlyDemandElectricity_kWh = models.FloatField()


class HybridConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()
    yearlyDemandElectricity_kWh = models.FloatField()


# %% Conversion assets


class ConversionAssetType(models.TextChoices):
    ELECTRIC_HEATER = "ELECTRIC_HEATER"
    GAS_BURNER = "GAS_BURNER"
    HEAT_DELIVERY_SET = "HEAT_DELIVERY_SET"
    HEAT_PUMP_AIR = "HEAT_PUMP_AIR"
    HEAT_PUMP_GROUND = "HEAT_PUMP_GROUND"
    HEAT_PUMP_WATER = "HEAT_PUMP_WATER"
    HYDROGEN_FURNACE = "HYDROGEN_FURNACE"
    METHANE_FURNACE = "METHANE_FURNACE"
    ELECTROLYSER = "ELECTROLYSER"
    CURTAILER = "CURTAILER"
    METHANE_CHP = "METHANE_CHP"


class AmbientTempType(models.TextChoices):
    AIR = "AIR"
    GROUND = "GROUND"


class ConversionAsset(EnergyAsset):
    category = "CONVERSION"
    type = models.CharField(max_length=255, choices=ConversionAssetType.choices)
    eta_r = models.FloatField()


class VehicleConversionAsset(ConversionAsset):
    energyConsumption_kWhpkm = models.FloatField()
    vehicleScaling = models.IntegerField()


class ElectricCoversionAsset(ConversionAsset):
    capacityElectricity_kW = models.FloatField()


class CookingConversionAssetTypes(models.TextChoices):
    ELECTRIC_HOB = "ELECTRIC_HOB"
    GAS_PIT = "GAS_PIT"


class CookingConversionAsset(EnergyAsset):
    type = models.CharField(max_length=255, choices=CookingConversionAssetTypes.choices)
    capacityHeat_kW = models.FloatField(blank=True, null=True)
    capacityElectricity_kW = models.FloatField(blank=True, null=True)
    eta_r = models.FloatField()

    def clean(self) -> None:
        if self.type is CookingConversionAssetTypes.GAS_PIT and (
            self.capacityHeat_kW is None or self.capacityElectricity_kW is not None
        ):
            raise ValueError("Type 'GAS_PIT' only works with capacityHeat_kW")
        if self.type is CookingConversionAssetTypes.ELECTRIC_HOB and (
            self.capacityElectricity_kW is None or self.capacityHeat_kW is not None
        ):
            raise ValueError("Type 'ELECTRIC_HOB' only works with capacityElectricity_kW")

        return super().clean()


class HeatConversionAsset(ConversionAsset):
    deliveryTemp_degc = models.FloatField()


class ChemicalHeatConversionAsset(HeatConversionAsset):
    capacityHeat_kW = models.FloatField()


class ElectricHeatConversionAsset(HeatConversionAsset):
    capacityElectricity_kW = models.FloatField()


class TransportHeatConversionAsset(ElectricHeatConversionAsset):
    ambientTempType = models.CharField(max_length=255, choices=AmbientTempType.choices)


class HybridHeatCoversionAsset(HeatConversionAsset):
    ambientTempType = models.CharField(max_length=255, choices=AmbientTempType.choices)
    capacityHeat_kW = models.FloatField()


# %% Production assets


class ProductionAssetType(models.TextChoices):
    PHOTOVOLTAIC = "PHOTOVOLTAIC"
    WINDMILL = "WINDMILL"
    RESIDUALHEATHT = "RESIDUALHEATHT"
    RESIDUALHEATLT = "RESIDUALHEATLT"


class ProductionAsset(EnergyAsset):
    category = "PRODUCTION"
    type = models.CharField(max_length=20, choices=ProductionAssetType.choices)


class ElectricProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()


class HeatProductionAsset(ProductionAsset):
    capacityHeat_kW = models.FloatField()
    deliveryTemp_degC = models.FloatField(default=80)


class HybridProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()
    capacityHeat_kW = models.FloatField()


# %% Storage assets


class StorageAssetType(models.TextChoices):
    ELECTRIC_VEHICLE = "ELECTRIC_VEHICLE"
    STORAGE_ELECTRIC = "STORAGE_ELECTRIC"
    STORAGE_HEAT = "STORAGE_HEAT"
    HEATMODEL = "HEATMODEL"


class StorageAsset(EnergyAsset):
    category = "STORAGE"
    type = models.CharField(
        max_length=50,
        choices=StorageAssetType.choices,
    )
    stateOfCharge_r = models.FloatField()


class HeatStorageAsset(StorageAsset):
    capacityHeat_kW = models.FloatField()
    minTemp_degC = models.IntegerField()
    maxTemp_degC = models.IntegerField()
    setTemp_degC = models.IntegerField(null=True, blank=True)
    initial_temperature_degC = models.IntegerField(null=True, blank=True)
    lossFactor_WpK = models.FloatField()
    heatCapacity_JpK = models.FloatField()
    ambientTempType = models.CharField(max_length=100, null=True, blank=True)

    def clean(self) -> None:
        if self.type == StorageAssetType.HEATMODEL:
            if self.initial_temperature_degC is None:
                raise ValidationError(
                    f"Must supply 'initial_temperature_degC' for type '{self.type}'"
                )

        if self.type == StorageAssetType.STORAGE_HEAT:
            if self.setTemp_degC is None or self.ambientTempType is None:
                raise ValidationError(
                    f"Must supply 'setTemp_degC' and 'ambientTempType' for type '{self.type}'"
                )

        return super().clean()


class ElectricStorageAsset(StorageAsset):
    capacityElectricity_kW = models.FloatField()
    storageCapacity_kWh = models.FloatField()


class VehicleElectricStorageAsset(ElectricStorageAsset):
    energyConsumption_kWhpkm = models.FloatField()
    vehicleScaling = models.IntegerField()
