from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.util import all_subclasses, is_exclude_field


# Don't forget to register new filters in get_filters() of ScenarioRule


class AttributeFilterComparator(models.TextChoices):
    """Types of supported comparators"""

    EQUAL = "EQUAL"
    LESS_THAN = "LESS THAN"
    GREATER_THAN = "GREATER THAN"
    NOT_EQUAL = "NOT EQUAL"


class Filter(PolymorphicModel):
    """Information on how to find the objects a scenario rule should be applied to"""

    model_attribute = models.CharField(max_length=255, null=True, blank=True)
    comparator = models.CharField(max_length=255, choices=AttributeFilterComparator.choices)
    value = models.JSONField(null=True, blank=True)

    def model_attribute_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if not field.is_relation and not is_exclude_field(field)
        ]

    class Meta:
        abstract = True

    def get_q(self) -> Q:
        pass


class AttributeFilter(Filter):
    """Filter on attribute"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="attribute_filters")

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

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

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

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
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't satisfy the model attribute comparison"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        super().clean()

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.relation_model_attribute_options():
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

    def get_relation_model(self) -> models.Model:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type
        model = apps.get_model("holon", model_type)

        relation_model_type = (
            self.relation_field_subtype
            if self.relation_field_subtype
            else model._meta.get_field(self.relation_field).name
        )

        return apps.get_model("holon", relation_model_type)

    def relation_model_attribute_options(self) -> list[str]:
        relation_model = self.get_relation_model()

        return [
            field.name
            for field in relation_model._meta.get_fields()
            if not field.is_relation and not is_exclude_field(field)
        ]

    def relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if field.is_relation and not is_exclude_field(field)
        ]

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

        if self.invert_filter:
            return ~(relation_field_subtype & relation_field_q)
        return relation_field_subtype & relation_field_q


class RelationExistsFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="relation_exists_filters"
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't have the specified relation"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
    ]

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        super().clean()

        try:
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

        return [
            field.name
            for field in model()._meta.get_fields()
            if field.is_relation and not is_exclude_field(field)
        ]

    def relation_field_subtype_options(self) -> list[str]:
        model = apps.get_model("holon", self.rule.model_type)
        related_model = model()._meta.get_field(self.relation_field).related_model

        return [subclass.__name__ for subclass in all_subclasses(related_model)]

    def get_q(self) -> Q:
        if self.invert_filter:
            if self.relation_field_subtype:
                return ~Q(
                    **{
                        f"{self.relation_field}__polymorphic_ctype": ContentType.objects.get_for_model(
                            apps.get_model("holon", self.relation_field_subtype)
                        )
                    }
                )
            else:
                return Q(**{f"{self.relation_field}__isnull": True})
        else:
            if self.relation_field_subtype:
                return Q(
                    **{
                        f"{self.relation_field}__polymorphic_ctype": ContentType.objects.get_for_model(
                            apps.get_model("holon", self.relation_field_subtype)
                        )
                    }
                )
            else:
                return Q(**{f"{self.relation_field}__isnull": False})


class SecondOrderRelationAttributeFilter(Filter):
    """Filter on attribute for parent object"""

    rule = ParentalKey(
        "holon.Rule",
        on_delete=models.CASCADE,
        related_name="second_order_relation_attribute_filters",
    )
    relation_field = models.CharField(max_length=255)  # bijv gridconnection
    relation_field_subtype = models.CharField(max_length=255, blank=True)  # bijv household
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't have the specified relation"
    )
    second_order_relation_field = models.CharField(max_length=255)
    second_order_relation_field_subtype = models.CharField(max_length=255, blank=True)
    invert_filter = models.BooleanField(
        default=False, help_text="Filter models that don't satisfy the model attribute comparison"
    )

    panels = [
        FieldPanel("invert_filter"),
        FieldPanel("relation_field"),
        FieldPanel("relation_field_subtype"),
        FieldPanel("second_order_relation_field"),
        FieldPanel("second_order_relation_field_subtype"),
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    class Meta:
        verbose_name = "RelationAttributeFilter"

    def clean(self):
        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

        try:
            if self.model_attribute not in self.second_order_relation_model_attribute_options():
                raise ValidationError("Invalid value model_attribute")
            if self.relation_field not in self.relation_field_options():
                raise ValidationError("Invalid value relation field")
            if (
                self.relation_field_subtype
                and self.relation_field_subtype not in self.relation_field_subtype_options()
            ):
                raise ValidationError("Invalid value relation field subtype")
            if self.second_order_relation_field not in self.second_order_relation_field_options():
                raise ValidationError("Invalid value second order relation field")
            if (
                self.second_order_relation_field_subtype
                and self.second_order_relation_field_subtype
                not in self.second_order_relation_field_subtype_options()
            ):
                raise ValidationError("Invalid value relation second order relation field subtype")
        except ObjectDoesNotExist:
            return

    def get_relation_model(self) -> models.Model:
        model_type = self.rule.model_subtype if self.rule.model_subtype else self.rule.model_type
        model = apps.get_model("holon", model_type)

        relation_model_type = (
            self.relation_field_subtype
            if self.relation_field_subtype
            else model._meta.get_field(self.relation_field).name
        )

        return apps.get_model("holon", relation_model_type)

    def relation_model_attribute_options(self) -> list[str]:
        relation_model = self.get_relation_model()

        return [
            field.name
            for field in relation_model._meta.get_fields()
            if not field.is_relation and not is_exclude_field(field)
        ]

    def relation_field_options(self) -> list[str]:
        model_type = (
            self.rule.model_type if self.rule.model_subtype is None else self.rule.model_subtype
        )
        model = apps.get_model("holon", model_type)

        return [
            field.name
            for field in model()._meta.get_fields()
            if field.is_relation and not is_exclude_field(field)
        ]

    def relation_field_subtype_options(self) -> list[str]:
        model = apps.get_model("holon", self.rule.model_type)
        related_model = model()._meta.get_field(self.relation_field).related_model

        return [subclass.__name__ for subclass in all_subclasses(related_model)]

    def get_second_order_relation_model(self) -> models.Model:
        if self.second_order_relation_field_subtype:
            return apps.get_model("holon", self.second_order_relation_field_subtype)

        relation_model = self.get_relation_model()
        second_order_relation_model = relation_model._meta.get_field(
            self.second_order_relation_field
        ).related_model

        return second_order_relation_model

    def second_order_relation_model_attribute_options(self) -> list[str]:
        relation_model = self.get_second_order_relation_model()

        return [
            field.name
            for field in relation_model._meta.get_fields()
            if not field.is_relation and not is_exclude_field(field)
        ]

    def second_order_relation_field_options(self) -> list[str]:
        model = self.get_relation_model()

        return [
            field.name
            for field in model()._meta.get_fields()
            if field.is_relation and not is_exclude_field(field)
        ]

    def second_order_relation_field_subtype_options(self) -> list[str]:

        related_model = self.get_relation_model()
        second_related_model = related_model._meta.get_field(self.relation_field).related_model

        return [subclass.__name__ for subclass in all_subclasses(second_related_model)]

    def get_q(self) -> Q:
        second_order_relation_field_q = Q()
        relation_field_subtype = Q()
        second_order_relation_field_subtype = Q()

        if self.comparator == AttributeFilterComparator.EQUAL.value:
            second_order_relation_field_q = Q(
                **{
                    f"{self.relation_field}__{self.second_order_relation_field}__{self.model_attribute}": self.value
                }
            )
        elif self.comparator == AttributeFilterComparator.LESS_THAN.value:
            second_order_relation_field_q = Q(
                **{
                    f"{self.relation_field}__{self.second_order_relation_field}__{self.model_attribute}__lt": self.value
                }
            )
        elif self.comparator == AttributeFilterComparator.GREATER_THAN.value:
            second_order_relation_field_q = Q(
                **{
                    f"{self.relation_field}__{self.second_order_relation_field}__{self.model_attribute}__gt": self.value
                }
            )
        elif self.comparator == AttributeFilterComparator.NOT_EQUAL.value:
            second_order_relation_field_q = ~Q(
                **{
                    f"{self.relation_field}__{self.second_order_relation_field}__{self.model_attribute}": self.value
                }
            )

        if self.relation_field_subtype:
            relation_subtype = apps.get_model("holon", self.relation_field_subtype)
            relation_field_subtype = Q(
                **{
                    f"{self.relation_field}__polymorphic_ctype": ContentType.objects.get_for_model(
                        relation_subtype
                    )
                }
            )

        if self.second_order_relation_field_subtype:
            relation_subtype = apps.get_model("holon", self.second_order_relation_field_subtype)
            second_order_relation_field_subtype = Q(
                **{
                    f"{self.relation_field}__polymorphic_ctype": ContentType.objects.get_for_model(
                        relation_subtype
                    )
                }
            )

        if self.invert_filter:
            return ~(
                relation_field_subtype
                & second_order_relation_field_q
                & second_order_relation_field_subtype
            )
        return (
            relation_field_subtype
            & second_order_relation_field_q
            & second_order_relation_field_subtype
        )


class DiscreteAttributeFilter(Filter):
    """Filter on attribute with discrete series"""

    rule = ParentalKey(
        "holon.Rule", on_delete=models.CASCADE, related_name="discrete_attribute_filters"
    )

    panels = [
        FieldPanel("model_attribute"),
        FieldPanel("comparator"),
        FieldPanel("value"),
    ]

    def clean(self):
        super().clean()

        if not self.model_attribute:
            raise ValidationError("Model attribute is required")
        if not self.value:
            raise ValidationError("Value is required")

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
