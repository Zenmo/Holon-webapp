from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from modelcluster.fields import ParentalKey

from holon.models.config.conversion_operation_type import ConversionOperationType
from holon.models.config.etm_query import ETMQuery


class AnyLogicConversionValueType(models.TextChoices):
    VALUE = "value"
    CURVE = "curve"


class AnyLogicConversion(models.Model):
    etm_query = ParentalKey(ETMQuery, related_name="al_conversion_step")

    conversion = models.CharField(max_length=255, choices=ConversionOperationType.choices)
    conversion_value_type = models.CharField(
        max_length=255, choices=AnyLogicConversionValueType.choices
    )

    anylogic_key = models.CharField(
        max_length=255,
        help_text=_("Key as defined in the AnyLogic results"),
    )
    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )

    def clean(self) -> None:
        # conversion operation is in product but no curves are supplied
        if (
            self.conversion == ConversionOperationType.IN_PRODUCT
            and self.conversion_value_type != AnyLogicConversionValueType.CURVE
        ):
            raise ValidationError(
                "Conversion operation is 'in product' but no curves are supplied!"
            )

        return super().clean()

    if False: 
        def clean() -> None:
            # TODO!
            return super().clean()
