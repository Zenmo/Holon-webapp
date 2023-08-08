from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from polymorphic.models import PolymorphicModel

from holon.models.gridconnection import GridConnection
from holon.models.gridnode import GridNode


class EnergyAsset(PolymorphicModel):
    category = "GENERIC"

    gridconnection = models.ForeignKey(
        GridConnection, on_delete=models.CASCADE, null=True, blank=True
    )
    gridnode = models.ForeignKey(GridNode, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=255)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    is_rule_action_template = models.BooleanField(
        default=False,
        help_text=_("Set this to True when this model can be used as a template for rule actions"),
    )

    original_id = models.BigIntegerField(
        null=True,
        blank=True,
        help_text=_("This field is used as a reference for cloned models. Don't set it manually"),
    )

    def clean(self):
        not_connected = self.gridconnection is None and self.gridnode is None
        connected_twice = self.gridconnection is not None and self.gridnode is not None

        if not self.is_rule_action_template and (not_connected or connected_twice):
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
    DIESEL_DEMAND = "DIESEL_DEMAND"
    METHANE_DEMAND = "METHANE_DEMAND"
    HYDROGEN_DEMAND = "HYDROGEN_DEMAND"


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


class DieselConsumptionAsset(ConsumptionAsset):
    name = "DieselConsumptionAsset"
    type = ConsumptionAssetType.DIESEL_DEMAND
    yearlyDemandDiesel_kWh = models.FloatField()


class MethaneConsumptionAsset(ConsumptionAsset):
    name = "MethaneConsumptionAsset"
    type = ConsumptionAssetType.METHANE_DEMAND
    yearlyDemandMethane_kWh = models.FloatField()


class HydrogenConsumptionAsset(ConsumptionAsset):
    name = "HydrogenConsumptionAsset"
    type = ConsumptionAssetType.HYDROGEN_DEMAND
    yearlyDemandHydrogen_kWh = models.FloatField()


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
    CURTAILER_HEAT = "CURTAILER_HEAT"
    METHANE_CHP = "METHANE_CHP"
    BIOGAS_METHANE_CONVERTER = "BIOGAS_METHANE_CONVERTER"


class AmbientTempType(models.TextChoices):
    AIR = "AIR"
    GROUND = "GROUND"
    WATER = "WATER"


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
    category = "CONVERSION"
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
    deliveryTemp_degC = models.FloatField()


class ChemicalHeatConversionAsset(HeatConversionAsset):
    capacityHeat_kW = models.FloatField()


class BiogasMethaneConverter(ConversionAsset):
    name = "BiogasMethaneConverter"
    type = ConversionAssetType.BIOGAS_METHANE_CONVERTER
    capacityMethane_kW = models.FloatField()


class ElectricHeatConversionAsset(HeatConversionAsset):
    capacityElectricity_kW = models.FloatField()


class TransportHeatConversionAsset(ElectricHeatConversionAsset):
    ambientTempType = models.CharField(max_length=255, choices=AmbientTempType.choices)


class HybridHeatCoversionAsset(HeatConversionAsset):
    ambientTempType = models.CharField(max_length=255, choices=AmbientTempType.choices)
    capacityHeat_kW = models.FloatField()
    capacityElectricity_kW = models.FloatField()


# %% Production assets


class ProductionAssetType(models.TextChoices):
    PHOTOVOLTAIC = "PHOTOVOLTAIC"
    WINDMILL = "WINDMILL"
    RESIDUALHEATHT = "RESIDUALHEATHT"
    RESIDUALHEATLT = "RESIDUALHEATLT"
    LIVESTOCK = "LIVESTOCK"


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


class LiveStock(ProductionAsset):
    name = "LiveStock"
    type = ProductionAssetType.LIVESTOCK
    yearlyProductionMethane_kWh = models.FloatField(blank=False, null=False, default=0.0)


# %% Storage assets


class StorageAssetType(models.TextChoices):
    ELECTRIC_VEHICLE = "ELECTRIC_VEHICLE"
    STORAGE_ELECTRIC = "STORAGE_ELECTRIC"
    STORAGE_HEAT = "STORAGE_HEAT"
    STORAGE_GAS = "STORAGE_GAS"
    HEATMODEL = "HEATMODEL"


class StorageAsset(EnergyAsset):
    category = "STORAGE"
    type = models.CharField(
        max_length=50,
        choices=StorageAssetType.choices,
    )


class HeatStorageAsset(StorageAsset):
    capacityHeat_kW = models.FloatField()
    minTemp_degC = models.IntegerField()
    maxTemp_degC = models.IntegerField()
    setTemp_degC = models.IntegerField(null=True, blank=True)
    initialTemperature_degC = models.IntegerField(null=True, blank=True)
    lossFactor_WpK = models.FloatField()
    heatCapacity_JpK = models.FloatField()
    ambientTempType = models.CharField(
        choices=AmbientTempType.choices, max_length=100, null=True, blank=True
    )

    def clean(self) -> None:
        if self.type == StorageAssetType.HEATMODEL:
            if self.ambientTempType != AmbientTempType.AIR:
                raise ValidationError(f"AmbientTempType can only be air for type '{self.type}'")
            if self.initialTemperature_degC is None:
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
    stateOfCharge_r = models.FloatField()


class GasStorageAsset(StorageAsset):
    capacityGas_kW = models.FloatField()
    storageCapacity_kWh = models.FloatField()
    stateOfCharge_r = models.FloatField()


class VehicleElectricStorageAsset(ElectricStorageAsset):
    energyConsumption_kWhpkm = models.FloatField()
    vehicleScaling = models.IntegerField()
