from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.db.models import Q
from polymorphic.models import PolymorphicModel


class Filter(PolymorphicModel):
    """Information on how to find the objects a scenario rule should be applied to"""

    rule = models.ForeignKey("holon.ScenarioRule", on_delete=models.CASCADE, related_name="filters")
    
    def getQ(self) -> Q:
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
    value = models.IntegerField()

    def getQ(self) -> Q:
        if self.comparator == AttributeFilterComparator.EQUAL:
            return Q(**{self.model_attribute: self.value})
        if self.comparator == AttributeFilterComparator.LESS_THAN:
            return Q(**{f"{self.model_attribute}__lt": self.value})
        if self.comparator == AttributeFilterComparator.GREATER_THAN:
            return Q(**{f"{self.model_attribute}__gt": self.value})
        if self.comparator == AttributeFilterComparator.NOT_EQUAL:
            return ~Q(**{self.model_attribute: self.value})


class RelationAttributeFilter(AttributeFilter):
    """Filter on attribute for parent object"""

    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household

    def relation_field_values(self):
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [field.name for field in model()._meta.get_fields() if field.is_relation]

    def relation_field_subtype_values(self) -> list[str]:
        def all_subclasses(cls) -> list[models.Model]:
            return set(cls.__subclasses__()).union(
                [s for c in cls.__subclasses__() for s in all_subclasses(c)]
            )

        model = apps.get_model(self.rule.model_type)
        related_model = model()._meta.get_field(self.relation_field).related_model

        return [subclass.__name__ for subclass in all_subclasses(related_model)]

    def getQ(self) -> Q:
        relation_field_q = Q()
        relation_field_subtype = Q()

        if self.comparator == AttributeFilterComparator.EQ:
            relation_field_q = Q(**{f"{self.relation_field}__{self.model_attribute}": self.value})
        elif self.comparator == AttributeFilterComparator.LT:
            relation_field_q = Q(
                **{f"{self.relation_field}__{self.model_attribute}__lt": self.value}
            )
        elif self.comparator == AttributeFilterComparator.GT:
            relation_field_q = Q(
                **{f"{self.relation_field}__{self.model_attribute}__gt": self.value}
            )
        elif self.comparator == AttributeFilterComparator.NE:
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

        return relation_field_q & relation_field_subtype
