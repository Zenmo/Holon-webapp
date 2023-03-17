from django.db import models


class ConversionOperationType(models.TextChoices):
    MULTIPLY = "multiply"
    DIVIDE = "divide"
    IN_PRODUCT = "in_product"
