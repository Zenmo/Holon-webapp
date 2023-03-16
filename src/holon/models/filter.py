from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.util import all_subclasses


# Don't forget to register new filters in get_filters() of ScenarioRule


class AttributeFilterComparator(models.TextChoices):
    """Types of supported comparators"""

    EQUAL = "EQUAL"
    LESS_THAN = "LESS THAN"
    GREATER_THAN = "GREATER THAN"
    NOT_EQUAL = "NOT EQUAL"


class Filter(PolymorphicModel):
    """Information on how to find the objects a scenario rule should be applied to"""

    model_attribute = models.CharField(max_length=255)
    comparator = models.CharField(max_length=255, choices=AttributeFilterComparator.choices)
    value = models.JSONField()

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    def model_attribute_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

    class Meta:
        abstract = True

    def get_q(self) -> Q:
        pass


class AttributeFilter(Filter):
    """Filter on attribute"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="attribute_filters")

    class Meta:
        verbose_name = "AttributeFilter"

    def get_q(self) -> Q:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            return Q(**{f"{model_type}___{self.model_attribute}": self.value})
        if self.comparator == AttributeFilterComparator.LESS_THAN.value:
            return Q(**{f"{model_type}___{self.model_attribute}__lt": self.value})
        if self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            return Q(**{f"{model_type}___{self.model_attribute}__gt": self.value})
        if self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            return ~Q(**{f"{model_type}___{self.model_attribute}": self.value})

    def clean(self):
        super().clean()

        try:
            if self.model_attribute not in self.model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
        except ObjectDoesNotExist:
            return


class RelationAttributeFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="relation_attribute_filters"
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household

    panels = [
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
    ] + Filter.panels

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        super().clean()

        try:
            if self.model_attribute not in self.model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
            if self.relation_field not in self.relation_field_options():
                raise ValidationError("Invalid value relation_field")
            if (
                self.relation_field_subtype
                and self.relation_field_subtype not in self.relation_field_subtype_options()
            ):
                raise ValidationError("Invalid value relation_field_subtype")
        except ObjectDoesNotExist:
            return

    def relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if field.is_relation]

    def relation_field_subtype_options(self) -> list[str]:

        model = apps.get_model("holon", self.rule.model_type)
        related_model = model()._meta.get_field(self.relation_field).related_model

        return [subclass.__name__ for subclass in all_subclasses(related_model)]

    def get_q(self) -> Q:
        relation_field_q = Q()
        relation_field_subtype = Q()

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            relation_field_q = Q(**{f"{self.relation_field}__{self.model_attribute}": self.value})
        elif self.comparator == AttributeFilterComparator.LESS_THAN.value:
            relation_field_q = Q(
                **{f"{self.relation_field}__{self.model_attribute}__lt": self.value}
            )
        elif self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            relation_field_q = Q(
                **{f"{self.relation_field}__{self.model_attribute}__gt": self.value}
            )
        elif self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            relation_field_q = ~Q(**{f"{self.relation_field}__{self.model_attribute}": self.value})

        if self.relation_field_subtype:
            relation_subtype = apps.get_model("holon", self.relation_field_subtype)
            relation_field_subtype = Q(
                **{
                    f"{self.relation_field}__polymorphic_ctype": ContentType.objects.get_for_model(
                        relation_subtype
                    )
                }
            )

        return relation_field_subtype & relation_field_q


class DiscreteAttributeFilter(Filter):
    """Filter on attribute with discrete series"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="discrete_attribute_filters"
    )

    def clean(self):
        super().clean()

        try:
            if self.model_attribute not in self.discrete_relation_field_options():
                raise ValidationError("Invalid model attribute, not discrete")

            if self.value not in self.value_options():
                raise ValidationError("Invalid value, not a choice for model attribute")
        except ObjectDoesNotExist:
            return

    def discrete_relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if hasattr(field, "choices") and field.choices
        ]

    def value_options(self) -> list[str]:
        if not self.model_attribute:
            return []

        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)
        field = model()._meta.get_field(self.model_attribute)

        if not hasattr(field, "choices") and not field.choices:
            return []

        return [choice[0] for choice in field.choices]

    def get_q(self) -> Q:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            return Q(**{f"{model_type}___{self.model_attribute}": self.value})
        if self.comparator == AttributeFilterComparator.LESS_THAN.value:
            ignore_none_value_q = ~Q(**{f"{model_type}___{self.model_attribute}": -1})
            return (
                Q(**{f"{model_type}___{self.model_attribute}__lt": self.value})
                & ignore_none_value_q
            )
        if self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            ignore_none_value_q = ~Q(**{f"{model_type}___{self.model_attribute}": -1})
            return (
                Q(**{f"{model_type}___{self.model_attribute}__gt": self.value})
                & ignore_none_value_q
            )
        if self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            return ~Q(**{f"{model_type}___{self.model_attribute}": self.value})
