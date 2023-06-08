from django.apps import apps
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey
from wagtail.admin.edit_handlers import FieldPanel

from holon.models.util import (
    relation_field_options,
    relation_field_subtype_options,
)
from src.holon.models.filter.filter import Filter


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
            if self.relation_field not in relation_field_options(self.rule):
                raise ValidationError("Invalid value relation_field")
            if (
                self.relation_field_subtype
                and self.relation_field_subtype
                not in relation_field_subtype_options(self.rule, self.relation_field)
            ):
                raise ValidationError("Invalid value relation_field_subtype")
        except ObjectDoesNotExist:
            return

    def hash(self):
        return f"[F{self.id},{self.model_attribute},{self.comparator},{self.value},{self.relation_field},{self.relation_field_subtype},{self.invert_filter}]"

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
