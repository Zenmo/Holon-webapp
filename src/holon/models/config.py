from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError


from holon.models.scenario import Scenario
from modelcluster.models import ClusterableModel
from modelcluster.fields import ParentalKey


class AnylogicCloudConfig(ClusterableModel):
    """top level model for AnyLogic cloudclient connection configuration"""

    api_key = models.CharField(max_length=40)
    url = models.URLField(max_length=100, default="https://engine.holontool.nl")
    model_name = models.CharField(max_length=100)
    model_version_number = models.IntegerField(
        help_text=_("Use this field to define the AnyLogic Cloud model version number")
    )
    scenario = ParentalKey(Scenario, related_name="anylogic_config")

    owner_email = models.EmailField(
        help_text=_("This will be used to send the owner emails when things break")
    )  # use this later for sending error emails

    panels = [
        FieldPanel("api_key"),
        FieldPanel("url"),
        FieldPanel("model_name"),
        FieldPanel("model_version_number"),
        FieldPanel("scenario"),
        InlinePanel(
            "anylogic_cloud_output",
            heading="Use these features to map the outputs of AnyLogic results to internal keys",
            label="Cloud Output mapping",
            min_num=1,
        ),
        InlinePanel(
            "anylogic_cloud_input",
            heading="Optionally use this feature to supply additional operational arguments in JSON form",
            label="Additional AnyLogic Cloud inputs",
        ),
    ]

    class Meta:
        verbose_name = "Anylogic cloudclient configuratie"

    def clean(self) -> None:
        # TODO use holon.cloud.client to validate:
        # 1) API access for model
        # 2) Specified model version

        pass

    def __str__(self):
        return f"{self.model_name} / version {self.model_version_number}"


class AnylogicCloudInput(models.Model):
    """supports configurable mapping from AnyLogic resuls to guaranteed internal keys"""

    anylogic_key = models.CharField(max_length=100)
    anylogic_value = models.JSONField(
        help_text=_(
            "JSON format, will be parsed to be at available the same level in the JSON-payload as the other data"
        )
    )  # unsure if we should allow this

    anylogic_model_configuration = ParentalKey(
        AnylogicCloudConfig, on_delete=models.CASCADE, related_name="anylogic_cloud_input"
    )

    def __str__(self) -> str:
        return f"{self.anylogic_key}"


class AnylogicCloudOutput(models.Model):
    """supports configurable mapping from AnyLogic resuls to guaranteed internal keys"""

    anylogic_key = models.CharField(
        max_length=50, help_text=_("Key as provided in the AnyLogic Cloud response JSON")
    )
    internal_key = models.CharField(
        max_length=50,
        help_text=_(
            "Key that is used internally to access the data associated with this AnyLogic key"
        ),
    )

    anylogic_model_configuration = ParentalKey(
        AnylogicCloudConfig, on_delete=models.CASCADE, related_name="anylogic_cloud_output"
    )

    def __str__(self) -> str:
        return f"{self.internal_key}"


class QueryAndConvertConfig(ClusterableModel):
    api_url = models.URLField(
        default="https://beta-engine.energytransitionmodel.com/api/v3/scenarios/"
    )
    etm_scenario_id = models.IntegerField()

    panels = [
        InlinePanel(
            "etm_query",
            heading="Define your input and query statements here",
            label="ETM query/input statement",
            min_num=1,
        ),
    ]

    class Meta:
        abstract = True

    def __str__(self):
        pass


class ETMScalingConfig(QueryAndConvertConfig):
    scenario = ParentalKey(Scenario, related_name="etm_scaling_config")

    class Meta:
        verbose_name = "ETM opschalingsconfiguratie"

    def __str__(self):
        pass


class QueryType(models.TextChoices):
    INPUT = "input"
    QUERY = "query"
    CURVE = "curve"  # TODO: This seems weird to me


class DataType(models.TextChoices):
    VALUE = "value"
    CURVE = "curve"


class ETMQuery(ClusterableModel):
    internal_key = models.CharField(
        max_length=35,
        help_text=_(
            "Key that is used internally (downstream) to access the data associated with this query result"
        ),
    )

    query_type = models.CharField(max_length=255, choices=QueryType.choices)
    data_type = models.CharField(max_length=255, choices=DataType.choices)

    etm_key = models.CharField(
        max_length=255,
        help_text=_("Key as defined in the ETM"),
    )

    related_config = ParentalKey(ETMScalingConfig, related_name="etm_query")

    panels = [
        FieldPanel("query_type"),
        FieldPanel("data_type"),
        FieldPanel("etm_key"),
        InlinePanel(
            "etm_conversion_step",
            heading="Optionally use this feature edit the results from the ETM with other values or queries",
            label="Conversion (convert_with)",
        ),
        InlinePanel("al_conversion_step"),
        InlinePanel("datamodel_conversion_step"),
        InlinePanel("static_conversion_step"),
    ]

    def clean(self) -> None:
        # TODO validate the use of etm_keys?

        return super().clean()


class ConversionOperationType(models.TextChoices):
    MULTIPLY = "multiply"
    DIVIDE = "divide"
    ADD = "add"
    SUBSTRACT = "substract"
    IN_PRODUCT = "in_product"


class ETMConversionValueType(models.TextChoices):
    VALUE = "value"
    CURVE = "curve"


class StaticConversion(models.Model):
    etm_query = ParentalKey(ETMQuery, related_name="static_conversion_step")

    value = models.FloatField(
        help_text=_("Value for static conversions"),
    )
    conversion = models.CharField(max_length=255, choices=ConversionOperationType.choices)
    
    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )


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
        # conversion type is curve or query but no key is supplied
        if (
            self.conversion_value_type == ETMConversionValueType.CURVE
            or self.conversion_value_type == ETMConversionValueType.QUERY
        ) and self.key is None:
            raise ValidationError("Conversion type is curve or query but no key is supplied!")

        # conversion operation is in product but no curves are supplied
        if (
            self.conversion == ConversionOperationType.IN_PRODUCT
            and self.conversion_value_type != ETMConversionValueType.CURVE
        ):
            raise ValidationError(
                "Conversion operation is 'in product' but no curves are supplied!"
            )

        return super().clean()


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
        # conversion type is curve or query but no key is supplied
        if self.conversion_value_type == AnyLogicConversionValueType.CURVE and self.key is None:
            raise ValidationError("Conversion type is curve or query but no key is supplied!")

        # conversion operation is in product but no curves are supplied
        if (
            self.conversion == ConversionOperationType.IN_PRODUCT
            and self.conversion_value_type != AnyLogicConversionValueType.CURVE
        ):
            raise ValidationError(
                "Conversion operation is 'in product' but no curves are supplied!"
            )

        return super().clean()


class DatamodelConversionOperationType(models.TextChoices):
    """Applied to the resulting set of objects attribute values before conversion"""

    SUM = "sum"
    COUNT = "count"


class DatamodelConversion(models.Model):
    etm_query = ParentalKey(ETMQuery, related_name="datamodel_conversion_step")

    conversion = models.CharField(max_length=255, choices=ConversionOperationType.choices)
    conversion_value_type = models.CharField(
        max_length=255, choices=AnyLogicConversionValueType.choices
    )

    filter = models.CharField(
        max_length=255,
        default="not_implemented",
        help_text=_(
            "Should be implemented as an inline panel that allows you to filter and select parts of the datamodel as you would"
        ),
    )

    self_conversion = models.CharField(
        max_length=255,
        choices=DatamodelConversionOperationType.choices,
        help_text=_("Operation that is applied to the query set that results from the filter"),
    )

    shadow_key = models.CharField(
        max_length=255,
        help_text=_("Internal key, not used by humans but might occur in logs when errors occur"),
    )

    def clean(self) -> None:
        # conversion type is curve or query but no key is supplied
        if self.conversion_value_type == AnyLogicConversionValueType.CURVE and self.key is None:
            raise ValidationError("Conversion type is curve or query but no key is supplied!")

        # conversion operation is in product but no curves are supplied
        if (
            self.conversion == ConversionOperationType.IN_PRODUCT
            and self.conversion_value_type != AnyLogicConversionValueType.CURVE
        ):
            raise ValidationError(
                "Conversion operation is 'in product' but no curves are supplied!"
            )

        return super().clean()


class ETMCostConfig(QueryAndConvertConfig):
    scenario = ParentalKey(Scenario, related_name="etm_cost_config")

    class Meta:
        verbose_name = "Kostenmodule configuratie"

    def clean() -> None:
        # left hand side ETM key should be querried
        if False:
            raise ("AnyLogic result not found!")

        # right hand side is datamodel attr
        if False:
            raise ("AnyLogic result not found!")

        # right hand sight is anylogic result
        if False:
            raise ("AnyLogic result not found!")

        return super().clean()

    def __str__(self):
        return "Kostenmodule configuratie"


class CostBenifitConfig(models.Model):
    # casus wide scope

    panels = []

    class Meta:
        verbose_name = "Kosten&baten configuratie"

    def __str__(self):
        return "Kosten&baten configuratie"
