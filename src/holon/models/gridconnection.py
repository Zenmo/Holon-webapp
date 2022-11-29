from django.db import models

# Create your models here.
class GridConnection(models.Model):
    type = models.CharField(max_length=100)

    def __str__(self):
        return self.type
