from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from polymorphic.models import PolymorphicModel

from holon.models.util import all_subclasses


class Filter(PolymorphicModel):
    """Information on how to find the objects a scenario rule should be applied to"""

    rule = models.ForeignKey("holon.ScenarioRule", on_delete=models.CASCADE, related_name="filters")

    def get_q(self) -> Q:
        pass


class AttributeFilterComparator(models.TextChoices):
    """Types of supported comparators"""

    EQUAL = "EQUAL"
    LESS_THAN = "LESS THAN"
    GREATER_THAN = "GREATER THAN"
    NOT_EQUAL = "NOT EQUAL"


class AttributeFilter(Filter):
    """Filter on attribute"""

    model_attribute = models.CharField(max_length=255, null=True)
    comparator = models.CharField(max_length=255, choices=AttributeFilterComparator.choices)
    value = models.JSONField()

    def clean(self):
        super().clean()

        if self.model_attribute not in self.model_attribute_options():
            raise ValidationError("Invalid value model_attribute")

    def model_attribute_options(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if not field.is_relation]

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


class RelationAttributeFilter(AttributeFilter):
    """Filter on attribute for parent object"""

    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household

    def clean(self):
        super().clean()

        if self.relation_field not in self.relation_field_options():
            raise ValidationError("Invalid value relation_field")
        if (
            self.relation_field_subtype
            and self.relation_field_subtype not in self.relation_field_subtype_options()
        ):
            raise ValidationError("Invalid value relation_field_subtype")

    def relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if field.is_relation]

    def relation_field_subtype_options(self) -> list[str]:

        model = apps.get_model(self.rule.model_type)
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
