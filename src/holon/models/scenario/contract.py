from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from polymorphic.models import PolymorphicModel

from holon.models.scenario.actor import Actor


class ContractType(models.TextChoices):
    DELIVERY = "DELIVERY"
    TRANSPORT = "TRANSPORT"
    CONNECTION = "CONNECTION"
    TAX = "TAX"


class EnergyCarrier(models.TextChoices):
    ELECTRICITY = "ELECTRICITY"
    HEAT = "HEAT"
    METHANE = "METHANE"
    HYDROGEN = "HYDROGEN"
    DIESEL = "DIESEL"


class Contract(PolymorphicModel):
    contractType = models.CharField(
        max_length=255,
        choices=ContractType.choices,
        default=ContractType.DELIVERY,
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=255, blank=True, null=True)
    contractScope = models.ForeignKey(Actor, on_delete=models.SET_NULL, null=True)
    energyCarrier = models.CharField(
        max_length=255, choices=EnergyCarrier.choices, default=EnergyCarrier.ELECTRICITY
    )
    actor = models.ForeignKey(
        Actor, on_delete=models.SET_NULL, related_name="contracts", null=True, blank=True
    )
    annualFee_eur = models.FloatField(default=0.0)
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
        return f"c{self.id} - {self.contractType.lower()}{' - ' + self.name if self.name else ''}"

    def clean(self):
        return ValidationError(
            "Should not be implemented at top level! Use a specific class for this case."
        )

    def clean_foreign_keys(self):
        if not self.is_rule_action_template and (self.actor is None or self.contractScope is None):
            raise ValidationError(
                "Contract should be connected. actor and contractScope are required"
            )


class DeliveryContractType(models.TextChoices):
    FIXED = "ELECTRICITY_FIXED"
    VARIABLE = "ELECTRICITY_VARIABLE"


class DeliveryContract(Contract):
    deliveryContractType = models.CharField(max_length=255, choices=DeliveryContractType.choices)
    deliveryPrice_eurpkWh = models.FloatField()
    feedinPrice_eurpkWh = models.FloatField()

    def clean(self) -> None:
        if self.contractType != ContractType.DELIVERY:
            raise ValidationError(f"ContractType should be 'Delivery' for DeliveryContract")

        self.clean_foreign_keys()

        return super().clean()


class ConnectionContractType(models.TextChoices):
    DEFAULT = "DEFAULT"
    NFATO = "NFATO"


class ConnectionContract(Contract):
    connectionContractType = models.CharField(
        max_length=255, choices=ConnectionContractType.choices
    )
    nfATO_capacity_kW = models.FloatField()
    nfATO_starttime_h = models.FloatField()
    nfATO_endtime_h = models.FloatField()

    def clean(self) -> None:
        if self.contractType != ContractType.CONNECTION:
            raise ValidationError(f"ContractType should be 'Connection' for ConnectionContract")

        self.clean_foreign_keys()

        return super().clean()


class TaxContractType(models.TextChoices):
    SALDEREN = "SALDEREN"
    NIETSALDEREN = "NIETSALDEREN"


class TaxContract(Contract):
    taxContractType = models.CharField(max_length=255, choices=TaxContractType.choices)
    taxDelivery_eurpkWh = models.FloatField()
    taxFeedin_eurpkWh = models.FloatField()
    proportionalTax_pct = models.FloatField()

    def clean(self) -> None:
        if self.contractType != ContractType.TAX:
            raise ValidationError(f"ContractType should be 'Tax' for TaxContract")

        self.clean_foreign_keys()

        return super().clean()


class TransportContractType(models.TextChoices):
    DEFAULT = "DEFAULT"
    NODALPRICING = "NODALPRICING"
    BANDWIDTH = "BANDWIDTH"


class TransportContract(Contract):
    transportContractType = models.CharField(max_length=255, choices=TransportContractType.choices)
    bandwidthTreshold_kW = models.FloatField()
    bandwidthTariff_eurpkWh = models.FloatField()

    def clean(self) -> None:
        if self.contractType != ContractType.TRANSPORT:
            raise ValidationError(f"ContractType should be 'Transport' for TransportContract")

        self.clean_foreign_keys()

        return super().clean()
