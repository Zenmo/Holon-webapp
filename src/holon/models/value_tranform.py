import math
from django.db import models
from polymorphic.models import PolymorphicModel
from wagtail.admin.edit_handlers import FieldPanel
from modelcluster.fields import ParentalKey


class ValueTransform(PolymorphicModel):
    """Base class for a class that allows selecting a subset of the elements in a queryset"""

    def transform_value(self, value: float) -> float:
        """Transform the value"""
        pass


class ValueTranslate(ValueTransform):
    """Class that allows for skipping a certain amount of items in a queryset"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="value_translates")
    amount = models.FloatField(null=False, verbose_name="Amount to add (or subtract)")

    panels = [FieldPanel("amount")]

    def transform_value(self, value: float) -> float:
        """Translate the value"""

        value = float(value)
        return value + self.amount


class ValueScale(ValueTransform):
    """Class that allows for skipping a certain amount of items in a queryset"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="value_scales")
    factor = models.FloatField(null=False, verbose_name="Scaling factor")

    panels = [FieldPanel("factor")]

    def transform_value(self, value: float) -> float:
        """Scale the value"""

        value = float(value)
        return value * self.factor


class ValueMapRange(ValueTransform):
    """Class that allows for skipping a certain amount of items in a queryset"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="value_map_ranges")
    value_min = models.FloatField(null=False, verbose_name="Minimum possible input value")
    value_max = models.FloatField(null=False, verbose_name="Maximum possible input value")
    new_range_min = models.FloatField(null=False, verbose_name="Minimum output value")
    new_range_max = models.FloatField(null=False, verbose_name="Maximum output value")

    panels = [
        FieldPanel("value_min"),
        FieldPanel("value_max"),
        FieldPanel("new_range_min"),
        FieldPanel("new_range_max"),
    ]

    def transform_value(self, value: float) -> float:
        """Map the value from one range to another"""

        value = float(value)
        return (self.new_range_max - self.new_range_min) * (
            (value - self.value_min) / (self.value_max - self.value_min)
        ) + self.new_range_min


class RoundMode(models.TextChoices):
    ROUND = "ROUND"
    CEIL = "CEIL"
    FLOOR = "FLOOR"


class ValueRound(ValueTransform):
    """Class that rounds an input value"""

    rule = ParentalKey("holon.Rule", on_delete=models.CASCADE, related_name="value_rounds")
    mode = models.CharField(max_length=12, null=False, choices=RoundMode.choices)

    panels = [
        FieldPanel("mode"),
    ]

    def transform_value(self, value: float) -> int:
        """Round the value"""

        value = float(value)

        if self.mode == RoundMode.ROUND.value:
            return int(round(value))
        if self.mode == RoundMode.CEIL.value:
            return int(math.ceil(value))
        if self.mode == RoundMode.FLOOR.value:
            return int(math.floor(value))

        raise NotImplementedError(f'Round mode "{self.mode.value}" not implemented')
