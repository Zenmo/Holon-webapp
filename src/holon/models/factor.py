from django.db import models
from wagtail.admin.edit_handlers import FieldPanel, InlinePanel

# Create your models here.
class Factor(models.Model):

    # asset = models.ForeignKey("holon.asset", on_delete=models.CASCADE, related_name="+")
    asset_attribute = models.CharField(max_length=100, default="asset_attribute_not_supplied")

    # grid_connection = models.ForeignKey(
    #     "holon.gridconnection", on_delete=models.CASCADE, related_name="+"
    # )

    min_value = models.IntegerField()
    max_value = models.IntegerField()

    panels = [
        FieldPanel("asset_attribute"),
        FieldPanel("min_value"),
        FieldPanel("max_value"),
    ]

    class Meta:
        verbose_name = "Factors"

    def __str__(self):
        if self.asset is not None and self.grid_connection is not None:
            return self.asset.type + "-" + self.grid_connection.type
        else:
            return self
