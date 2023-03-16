from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


from holon.models.config.etm_query import ETMQuery


class DatamodelConversionValueType(models.TextChoices):
    VALUE = "value"


class DatamodelConversionOperationType(models.TextChoices):
    MULTIPLY = "multiply"
    DIVIDE = "divide"


class DatamodelConversion(ClusterableModel):
    etm_query = ParentalKey(ETMQuery, related_name="datamodel_conversion_step")

    conversion = models.CharField(max_length=255, choices=DatamodelConversionValueType.choices)
    conversion_value_type = models.CharField(
        max_length=255, choices=DatamodelConversionOperationType.choices
    )

    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )

    panels = [
        FieldPanel(conversion),
        FieldPanel(conversion_value_type),
        FieldPanel(shadow_key),
        InlinePanel(
            "datamodel_query_rule",
            label="Datamodel Query Rule",
            heading="One rule should be enough",
            min_num=1,
            max_num=1,
        ),
    ]

    def clean(self) -> None:
        # TODO!
        # conversion type is curve or query but no key is supplied
        return super().clean()
