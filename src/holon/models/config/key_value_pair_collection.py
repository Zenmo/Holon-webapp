from django.db import models
from wagtail.admin.edit_handlers import InlinePanel
from django.utils.translation import gettext_lazy as _

from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey

from holon.models.config.query_and_convert import QueryAndConvertConfig


class KeyValuePairCollection(ClusterableModel):
    related_config = ParentalKey(QueryAndConvertConfig, related_name="key_value_pair_collection")

    panels = [
        InlinePanel(
            "float_key_value_pair",
            heading="Define float type key-value pair",
            label="Float key-value pair",
        )
    ]

    class Meta:
        verbose_name = "ETM module configuratie variabelen"

    def __str__(self):
        return f"ETM module configuratie variabelen"


class FloatKeyValuePair(models.Model):
    related_key_value_collection = ParentalKey(
        KeyValuePairCollection, related_name="float_key_value_pair"
    )

    key = models.CharField(max_length=255, null=False, blank=False)
    value = models.FloatField()

    def __str__(self):
        return f"{self.key}: {self.value}"
