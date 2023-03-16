from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from modelcluster.fields import ParentalKey
from holon.models.config.conversion_operation_type import ConversionOperationType
from holon.models.config.etm_query import ETMQuery


class ETMConversionValueType(models.TextChoices):
    VALUE = "value"
    CURVE = "curve"


class ETMConversion(models.Model):
    etm_query = ParentalKey(ETMQuery, related_name="etm_conversion_step")

    conversion = models.CharField(max_length=255, choices=ConversionOperationType.choices)
    conversion_value_type = models.CharField(max_length=255, choices=ETMConversionValueType.choices)

    etm_key = models.CharField(
        max_length=255,
        help_text=_("Key as defined in the ETM"),
    )
    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )

    def clean(self) -> None:
        # conversion operation is in product but no curves are supplied
        if (
            self.conversion == ConversionOperationType.IN_PRODUCT
            and self.conversion_value_type != ETMConversionValueType.CURVE
        ):
            raise ValidationError(
                "Conversion operation is 'in product' but no curves are supplied!"
            )

        return super().clean()
