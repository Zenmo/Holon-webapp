from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _

from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey

from holon.models.config.query_and_convert import QueryAndConvertConfig


class EndPoint(models.TextChoices):
    INPUT = "input"
    QUERY = "query"
    CURVE = "curve"


class DataType(models.TextChoices):
    VALUE = "value"
    CURVE = "curve"


class ETMQuery(ClusterableModel):
    internal_key = models.CharField(
        max_length=255,
        help_text=_(
            "Key that is used internally (downstream) to access the data associated with this query result"
        ),
    )

    endpoint = models.CharField(max_length=255, choices=EndPoint.choices)
    data_type = models.CharField(max_length=255, choices=DataType.choices)

    etm_key = models.CharField(
        max_length=255,
        help_text=_("Key as defined in the ETM"),
    )

    related_config = ParentalKey(QueryAndConvertConfig, related_name="etm_query")

    related_interactive_element = models.ForeignKey(
        "holon.InteractiveElement",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        help_text=_(
            "Use this field to relate this query and conversion set to an interactive element (used for rendering in the front-end)"
        ),
    )
    interactive_upscaling_comment = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text=_(
            "Use this field to explain the query in the front-end. Use {{variable}} for dynamic values. Options: local key-value pairs e.g., `scaling_factor`, `final_value` or `query_value` (to be implemented)"
        ),
    )

    panels = [
        FieldPanel("endpoint"),
        FieldPanel("data_type"),
        FieldPanel("etm_key"),
        FieldPanel("internal_key"),
        InlinePanel(
            "static_conversion_step",
            heading="Convert inputs/queries with static values",
            label="Static conversion (convert with static value)",
        ),
        InlinePanel(
            "etm_conversion_step",
            heading="Convert inputs/queries from the ETM with other values or queries",
            label="ETM conversion (convert with ETM query)",
        ),
        InlinePanel(
            "datamodel_conversion_step",
            heading="Convert inputs/queries based on specific parts of the datamodel definition",
            label="Datamodel based conversion (convert based on datamodel fields)",
        ),
        InlinePanel(
            "al_conversion_step",
            heading="Convert inputs/queries based on AnyLogic outcomes",
            label="AnyLogic result conversion (convert with AnyLogic outcomes)",
        ),
        FieldPanel("related_interactive_element"),
        FieldPanel("interactive_upscaling_comment"),
    ]

    def clean(self) -> None:
        # TODO validate the use of etm_keys?

        return super().clean()
