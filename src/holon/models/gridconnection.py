from django.db import models
from holon.models.actor import Actor
from holon.models.asset import EnergyAsset
from holon.models.gridnode import ElectricGridNode, GridNode, HeatGridNode

from holon.models.scenario import Scenario
from polymorphic.models import PolymorphicModel


class GridCategory(models.TextChoices):
    BUILDING = "BUILDING"
    INDUSTRY = "INDUSTRY"


class ChargingMode(models.TextChoices):
    MAX_POWER = "MAX_POWER"
    MAX_SPREAD = "MAX_SPREAD"


class BatteryMode(models.TextChoices):
    BALANCE = "BALANCE"
    PRICE = "PRICE"


class GridConnection(PolymorphicModel):
    owner_actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    capacity_kw = models.FloatField()
    parent_electric = models.ForeignKey(ElectricGridNode, on_delete=models.CASCADE)
    parent_heat = models.ForeignKey(HeatGridNode, on_delete=models.CASCADE)
    assets = models.ManyToManyField(EnergyAsset, blank=True)
    category = "GENERIC"
    charging_mode = models.CharField(
        max_length=100,
        choices=ChargingMode.choices,
        null=True,
        blank=True,
    )
    battery_mode = models.CharField(
        max_length=100,
        choices=BatteryMode.choices,
        null=True,
        blank=True,
    )
    nfATO_capacity_kw = models.FloatField(null=True, blank=True)
    nfATO_starttime = models.FloatField(null=True, blank=True)
    nfATO_endtime = models.FloatField(null=True, blank=True)
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE)


class InsulationLabel(models.TextChoices):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"
    F = "F"
    G = "G"
    NONE = "NONE"


class HeatingType(models.TextChoices):
    GASBURNER = "GASBURNER"
    GASFIRED = "GASFIRED"
    HEATPUMP_GASPEAK = "HEATPUMP_GASPEAK"
    DISTRICTHEAT = "DISTRICTHEAT"
    HEATPUMP_BOILERPEAK = "HEATPUMP_BOILERPEAK"
    HYDROGENFIRED = "HYDROGENFIRED"
    NONE = "NONE"


class BuiltEnvironmentGridConnection(GridConnection):
    category = "BUILT_ENVIRONMENT"
    insulation_label = models.CharField(
        max_length=100,
        choices=InsulationLabel.choices,
    )
    heating_type = models.CharField(
        max_length=100,
        choices=HeatingType.choices,
    )


class UtilityGridConnection(GridConnection):
    category = "UTILITY"
    heating_type = models.CharField(max_length=100, choices=HeatingType.choices)


class HousingType(models.TextChoices):
    SEMIDETACHED = "SEMIDETACHED", "Semidetached"
    TERRACED = "TERRACED", "Terraced"
    DETACHED = "DETACHED", "Detached"


class HouseGridConnection(BuiltEnvironmentGridConnection):
    category = "HOUSE"
    type = models.CharField(max_length=20, choices=HousingType.choices)


class BuildingType(models.TextChoices):
    store = "STORE"
    office = "OFFICE"
    logistics = "LOGISTICS"


class BuildingGridConnection(BuiltEnvironmentGridConnection):
    category = "BUILDING"
    type = models.CharField(max_length=9, choices=BuildingType.choices)


class ProductionCategory(models.TextChoices):
    windfarm = "WINDFARM"
    solarfarm = "SOLARFARM"
    gridbattery = "GRIDBATTERY"


class ProductionGridConnection(GridConnection):
    category = models.CharField(max_length=11, choices=ProductionCategory.choices)


class IndustryType(models.TextChoices):
    steel = "STEEL"
    industry_other = "INDUSTRY_OTHER"


class IndustryGridConnection(UtilityGridConnection):
    category = "INDUSTRY"
    type = models.CharField(max_length=14, choices=IndustryType.choices)


class DistrictHeatingType(models.TextChoices):
    mt = "MT"
    ht = "HT"


class DistrictHeatingGridConnection(UtilityGridConnection):
    category = "DISTRICT_HEATING"
    type = models.CharField(max_length=2, choices=DistrictHeatingType.choices)
