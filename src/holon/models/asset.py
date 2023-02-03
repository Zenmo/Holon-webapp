from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel


class EnergyAsset(PolymorphicModel):
    pass


#%% Consumption assets


class ConsumptionAssetType(models.TextChoices):
    electricity_demand = "ELECTRICITY_DEMAND"
    heat_demand = "HEAT_DEMAND"
    hot_water_consumption = "HOT_WATER_CONSUMPTION"
    other_electricity_consumption = "OTHER_ELECTRICITY_CONSUMPTION"


class ConsumptionAsset(EnergyAsset):
    category = "CONSUMPTION"
    type = models.CharField(max_length=255, choices=ConsumptionAssetType.choices)
    name = models.CharField(max_length=255)


class HeatConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()


class ElectricConsumptionAsset(ConsumptionAsset):
    yearlyDemandElectricity_kWh = models.FloatField()


class HybridConsumptionAsset(ConsumptionAsset):
    yearlyDemandHeat_kWh = models.FloatField()
    yearlyDemandElectricity_kWh = models.FloatField()


#%% Conversion assets


class ConversionAssetType(models.TextChoices):
    boiler = "BOILER"
    electrolyser = "ELECTROLYSER"
    gas_burner = "GAS_BURNER"
    heat_delivery_set = "HEAT_DELIVERY_SET"
    heat_pump_air = "HEAT_PUMP_AIR"
    heat_pump_ground = "HEAT_PUMP_GROUND"
    hydrogen_furnace = "HYDROGEN_FURNACE"
    methane_furnace = "METHANE_FURNACE"
    diesel_vehicle = "DIESEL_VEHICLE"


class AmbientTempType(models.TextChoices):
    air = "AIR"
    ground = "GROUND"


class ConversionAsset(EnergyAsset):
    category = "CONVERSION"
    type = models.CharField(max_length=255, choices=ConversionAssetType.choices)
    eta_r = models.FloatField()
    name = models.CharField(max_length=255)


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


#%% Production assets


class ProductionAssetType(models.TextChoices):
    PHOTOVOLTAIC = "PHOTOVOLTAIC"
    WINDMILL = "WINDMILL"


class ProductionAsset(EnergyAsset):
    category = "PRODUCTION"
    type = models.CharField(max_length=20, choices=ProductionAssetType.choices)
    name = models.CharField(max_length=100)


class ElectricProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()


class HeatProductionAsset(ProductionAsset):
    capacityHeat_kW = models.FloatField()


class HybridProductionAsset(ProductionAsset):
    capacityElectricity_kW = models.FloatField()
    capacityHeat_kW = models.FloatField()


#%% Storage assets


class StorageAssetType(models.TextChoices):
    electric_vehicle = "ELECTRIC_VEHICLE"
    storage_electric = "STORAGE_ELECTRIC"
    storage_heat = "STORAGE_HEAT"


class StorageAsset(models.Model):
    category = "STORAGE"
    type = models.CharField(
        max_length=50,
        choices=StorageAssetType.choices,
    )
    stateOfCharge_r = models.FloatField()
    name = models.CharField(max_length=100)


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
