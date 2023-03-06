from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.gridconnection import GridConnection


class EnergyAsset(PolymorphicModel):
    gridconnection = models.ForeignKey(GridConnection, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        if self.gridconnection:
            return f"{self.name} - {self.id} ({self.gridconnection.category}{self.gridconnection.id})"
        return f"{self.name} - {self.id} (no gridconnection)"


# %% Consumption assets


class ConsumptionAssetType(models.TextChoices):
    ELECTRICITY_DEMAND = "ELECTRICITY_DEMAND"
    HEAT_DEMAND = "HEAT_DEMAND"
    HOT_WATER_CONSUMPTION = "HOT_WATER_CONSUMPTION"
    OTHER_ELECTRICITY_CONSUMPTION = "OTHER_ELECTRICITY_CONSUMPTION"


class ConsumptionAsset(EnergyAsset):
    category = "CONSUMPTION"
    type = models.CharField(max_length=255, choices=ConsumptionAssetType.choices)


class HeatConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()


class ElectricConsumptionAsset(ConsumptionAsset):
    yearlyDemandElectricity_kWh = models.FloatField()


class HybridConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()
    yearlyDemandElectricity_kWh = models.FloatField()


# %% Conversion assets


class ConversionAssetType(models.TextChoices):
    BOILER = "BOILER"
    ELECTROLYSER = "ELECTROLYSER"
    GAS_BURNER = "GAS_BURNER"
    HEAT_DELIVERY_SET = "HEAT_DELIVERY_SET"
    HEAT_PUMP_AIR = "HEAT_PUMP_AIR"
    HEAT_PUMP_GROUND = "HEAT_PUMP_GROUND"
    HYDROGEN_FURNACE = "HYDROGEN_FURNACE"
    METHANE_FURNACE = "METHANE_FURNACE"
    DIESEL_VEHICLE = "DIESEL_VEHICLE"


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


class ProductionAsset(EnergyAsset):
    category = "PRODUCTION"
    type = models.CharField(max_length=20, choices=ProductionAssetType.choices)


class ElectricProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()


class HeatProductionAsset(ProductionAsset):
    capacityHeat_kW = models.FloatField()


class HybridProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()
    capacityHeat_kW = models.FloatField()


# %% Storage assets


class StorageAssetType(models.TextChoices):
    ELECTRIC_VEHICLE = "ELECTRIC_VEHICLE"
    STORAGE_ELECTRIC = "STORAGE_ELECTRIC"
    STORAGE_HEAT = "STORAGE_HEAT"


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
    setTemp_degC = models.IntegerField()
    lossFactor_WpK = models.FloatField()
    heatCapacity_JpK = models.FloatField()
    ambientTempType = models.CharField(max_length=100)


class ElectricStorageAsset(StorageAsset):
    capacityElectricity_kW = models.FloatField()
    storageCapacity_kWh = models.FloatField()


class VehicleElectricStorageAsset(ElectricStorageAsset):
    energyConsumption_kWhpkm = models.FloatField()
    vehicleScaling = models.IntegerField()
