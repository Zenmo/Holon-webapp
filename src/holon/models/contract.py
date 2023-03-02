from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.actor import Actor


class ContractType(models.TextChoices):
    DELIVERY = "DELIVERY"
    TRANSPORT = "TRANSPORT"
    CONNECTION = "CONNECTION"
    TAX = "TAX"


class ContractScope(models.TextChoices):
    ENERGYSUPPLIER = "ENERGYSUPPLIER"
    GRIDOPERATOR = "GRIDOPERATOR"
    ENERGYHOLON = "ENERGYHOLON"
    ADMINISTRATIVEHOLON = "ADMINISTRATIVEHOLON"


class EnergyCarrier(models.TextChoices):
    ELECTRICITY = "ELECTRICITY"
    HEAT = "HEAT"
    METHANE = "METHANE"
    HYDROGEN = "HYDROGEN"
    DIESEL = "DIESEL"


class Contract(PolymorphicModel):
    type = models.CharField(max_length=255, choices=ContractType.choices)
    contract_scope = models.CharField(max_length=255, choices=ContractScope.choices)
    energy_carrier = models.CharField(
        max_length=255, choices=EnergyCarrier.choices, default=EnergyCarrier.ELECTRICITY
    )
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE, related_name="contracts")
    annual_fee_eur = models.FloatField(default=0.0)
    wildcard_JSON = models.JSONField(
        blank=True,
        null=True,
        help_text=_(
            "Use this field to define parameters that are not currently available in the datamodel."
        ),
    )

    def __str__(self):
        return f"c{self.id} - {self.type.lower()}"


class DeliveryContractType(models.TextChoices):
    FIXED = "ELECTRICITY_FIXED"
    VARIABLE = "ELECTRICITY_VARIABLE"


class DeliveryContract(Contract):
    delivery_contract_type = models.CharField(max_length=255, choices=DeliveryContractType.choices)
    delivery_price_eurpkWh = models.FloatField()
    feedin_price_eurpkWh = models.FloatField()


class ConnectionContractType(models.TextChoices):
    DEFAULT = "DEFAULT"
    NFATO = "NFATO"


class ConnectionContract(Contract):
    connection_contract_type = models.CharField(
        max_length=255, choices=ConnectionContractType.choices
    )
    nfATO_capacity_kW = models.FloatField()
    nfATO_starttime_h = models.FloatField()
    nfATO_endtime_h = models.FloatField()


class TaxContractType(models.TextChoices):
    SALDEREN = "SALDEREN"
    NIETSALDEREN = "NIETSALDEREN"


class TaxContract(Contract):
    tax_contract_type = models.CharField(max_length=255, choices=TaxContractType.choices)
    tax_delivery_eurpkWh = models.FloatField()
    tax_feedin_eurpkWh = models.FloatField()
    proportional_fax_pct = models.FloatField()


class TransportContractType(models.TextChoices):
    DEFAULT = "DEFAULT"
    NODALPRICING = "NODALPRICING"
    BANDWIDTH = "BANDWIDTH"


class TransportContract(Contract):
    transport_contract_type = models.CharField(
        max_length=255, choices=TransportContractType.choices
    )
    bandwidth_treshold_kW = models.FloatField()
    bandwidth_tariff_eurpkWh = models.FloatField()
