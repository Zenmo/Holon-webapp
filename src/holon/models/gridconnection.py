from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from modelcluster.models import ClusterableModel
from polymorphic.models import PolymorphicModel

from holon.models.actor import Actor
from holon.models.gridnode import ElectricGridNode, HeatGridNode
from holon.models.scenario import Scenario

holon_app = apps.get_app_config("holon")


class GridCategory(models.TextChoices):
    BUILDING = "BUILDING"
    INDUSTRY = "INDUSTRY"


class ChargingMode(models.TextChoices):
    MAX_POWER = "MAX_POWER"
    MAX_SPREAD = "MAX_SPREAD"
    CHEAP = "CHEAP"
    SIMPLE = "SIMPLE"


class BatteryMode(models.TextChoices):
    BALANCE = "BALANCE"
    PRICE = "PRICE"


class ElectrolyserMode(models.TextChoices):
    BALANCE = "BALANCE"
    PRICE = "PRICE"


class GridConnection(PolymorphicModel, ClusterableModel):
    category = "GENERIC"

    owner_actor = models.ForeignKey(Actor, on_delete=models.CASCADE, null=True, blank=True)
    capacity_kw = models.FloatField()
    parent_electric = models.ForeignKey(
        ElectricGridNode, on_delete=models.SET_NULL, null=True, blank=True
    )
    parent_heat = models.ForeignKey(HeatGridNode, on_delete=models.SET_NULL, null=True, blank=True)
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
    electrolyser_mode = models.CharField(
        max_length=100,
        choices=ElectrolyserMode.choices,
        null=True,
        blank=True,
    )
    payload = models.ForeignKey(Scenario, on_delete=models.CASCADE, null=True, blank=True)
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

    def __str__(self):
        return f"b{self.id} {self.category}"

    def clean(self):
        return ValidationError(
            "Should not be implemented at top level! Use a specific class for this case."
        )

    def clean_foreign_keys(self):
        if not self.is_rule_action_template and (self.payload is None or self.owner_actor is None):
            raise ValidationError(
                "GridConnection should be connected. Payload and Owner actor are required"
            )


class InsulationLabel(models.IntegerChoices):
    A = 7, "A"
    B = 6, "B"
    C = 5, "C"
    D = 4, "D"
    E = 3, "E"
    F = 2, "F"
    G = 1, "G"
    NONE = -1, "NONE"


class HeatingType(models.TextChoices):
    GASBURNER = "GASBURNER"
    GASFIRED = "GASFIRED"
    HEATPUMP_GASPEAK = "HEATPUMP_GASPEAK"
    DISTRICTHEAT = "DISTRICTHEAT"
    HEATPUMP_BOILERPEAK = "HEATPUMP_BOILERPEAK"
    HYDROGENFIRED = "HYDROGENFIRED"
    GASFIRED_CHPPEAK = "GASFIRED_CHPPEAK"
    DISTRICT_EBOILER_CHP = "DISTRICT_EBOILER_CHP"
    HEATPUMP_AIR = "HEATPUMP_AIR"
    DISTRICTHEATDECENTRAL = "DISTRICTHEATDECENTRAL"
    LT_RESIDUAL_HEATPUMP_GASPEAK = "LT_RESIDUAL_HEATPUMP_GASPEAK"
    NONE = "NONE"


class BuiltEnvironmentGridConnection(GridConnection):
    category = "BUILT_ENVIRONMENT"
    insulation_label = models.IntegerField(
        choices=InsulationLabel.choices,
    )
    heating_type = models.CharField(
        max_length=100,
        choices=HeatingType.choices,
    )
    tempSetpointNight_degC = models.FloatField(default=16.0)
    tempSetpointNight_start_hr = models.FloatField(default=20.0)
    tempSetpointDay_degC = models.FloatField(default=20.0)
    tempSetpointDay_start_hr = models.FloatField(default=8.0)
    pricelevelLowDifFromAvg_eurpkWh = models.FloatField(blank=True, null=True)
    pricelevelHighDifFromAvg_eurpkWh = models.FloatField(blank=True, null=True)

    def clean(self):
        super().clean()
        self.clean_foreign_keys()


class UtilityGridConnection(GridConnection):
    category = "UTILITY"
    heating_type = models.CharField(max_length=100, choices=HeatingType.choices)

    def clean(self):
        super().clean()
        self.clean_foreign_keys()


class HousingType(models.TextChoices):
    SEMIDETACHED = "SEMIDETACHED"
    TERRACED = "TERRACED"
    DETACHED = "DETACHED"
    APPARTMENT = "APPARTMENT"
    HIGHRISE = "HIGHRISE"


class HouseGridConnection(BuiltEnvironmentGridConnection):
    category = "HOUSE"
    type = models.CharField(max_length=100, choices=HousingType.choices)
    smart_assets = models.BooleanField(null=True, blank=True)


class BuildingType(models.TextChoices):
    STORE = "STORE"
    OFFICE = "OFFICE"
    LOGISTICS = "LOGISTICS"


class BuildingGridConnection(BuiltEnvironmentGridConnection):
    category = "BUILDING"
    type = models.CharField(max_length=100, choices=BuildingType.choices)


class ProductionCategory(models.TextChoices):
    WINDFARM = "WINDFARM"
    SOLARFARM = "SOLARFARM"
    GRIDBATTERY = "GRIDBATTERY"
    RESIDUALHEAT = "RESIDUALHEAT"


class ProductionGridConnection(GridConnection):
    category = models.CharField(max_length=25, choices=ProductionCategory.choices)

    def clean(self):
        super().clean()
        self.clean_foreign_keys()


class IndustryType(models.TextChoices):
    STEEL = "STEEL"
    INDUSTRY_OTHER = "INDUSTRY_OTHER"
    AGRO_ENERGYHUB = "AGRO_ENERGYHUB"


class IndustryGridConnection(UtilityGridConnection):
    category = "INDUSTRY"
    type = models.CharField(max_length=25, choices=IndustryType.choices)


class DistrictHeatingType(models.TextChoices):
    MT = "MT"
    HT = "HT"
    LT = "LT"


class DistrictHeatingGridConnection(UtilityGridConnection):
    category = "DISTRICTHEATING"
    type = models.CharField(max_length=2, choices=DistrictHeatingType.choices)
    smart_assets = models.BooleanField(null=True, blank=True)
