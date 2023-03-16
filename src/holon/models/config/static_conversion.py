from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError

from modelcluster.fields import ParentalKey

from holon.models.config.conversion_operation_type import ConversionOperationType
from holon.models.config.etm_query import ETMQuery
from holon.models.config.key_value_pair_collection import KeyValuePairCollection, FloatKeyValuePair


class StaticConversion(models.Model):
    etm_query = ParentalKey(ETMQuery, related_name="static_conversion_step")

    value = models.FloatField(help_text=_("Value for static conversions"), null=True, blank=True)

    def limit_float_keys(self):
        related_config = (
            ETMQuery.objects.select_related("related_config").get(id=self.etm_query).related_config
        )
        valid_kv_pc = KeyValuePairCollection.objects.select_related("pk").get(id=related_config).pk
        kvs = (
            FloatKeyValuePair.objects.select_related("pk")
            .filter({"related_key_value_collection": valid_kv_pc})
            .all()
        )
        print(kvs)

        return {"key__is__in": ["list of keys"]}

    local_variable = models.ForeignKey(
        FloatKeyValuePair,
        null=True,
        blank=True,
        # limit_choices_to=limit_float_keys, # TODO ???
        on_delete=models.SET_NULL,
    )

    conversion = models.CharField(max_length=255, choices=ConversionOperationType.choices)

    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )

    def clean(self) -> None:
        none_defined = self.value is None and self.local_variable is None
        both_defined = self.value is not None and self.local_variable is not None
        if none_defined or both_defined:
            raise ValidationError("Should supply either 'value' or 'local_variable' and not both!")
        return super().clean()
