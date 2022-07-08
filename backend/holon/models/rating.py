from django.db import models
from django.utils.timezone import now
from rest_framework import serializers

class Rating(models.Model):
    """
    Model describing a rating
    """

    RATING_CHOICES = (
      ("HEART", "heart"),
      ("THUMBSUP", "thumbsup"),
      ("NEUTRAL", "neutral"),
      ("THUMBSDOWN", "thumbsdown")
    )
    datetime = models.DateTimeField(
      default=now,
      blank=True,
      help_text="The date and time when the rating is done",
    )
    rating = models.CharField(
      max_length=20,
      choices=RATING_CHOICES
    )

    def __str__(self):
        return self.rating
