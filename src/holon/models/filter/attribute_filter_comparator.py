from django.db import models


class AttributeFilterComparator(models.TextChoices):
    """Types of supported comparators"""

    EQUAL = "EQUAL"
    LESS_THAN = "LESS THAN"
    GREATER_THAN = "GREATER THAN"
    NOT_EQUAL = "NOT EQUAL"
