from django.db import models

class UpdateRegister(models.Model):
    """
    Model describing an User Registration
    """

    RATING_CHOICES = (
      ("HEART", "heart"),
      ("THUMBSUP", "thumbsup"),
      ("NEUTRAL", "neutral"),
      ("THUMBSDOWN", "thumbsdown")
    )

    name = models.CharField(max_length=256, help_text="The name of the user")
    email = models.EmailField(max_length=256, help_text="The email of the user")
    company = models.CharField(
      max_length=256, 
      help_text="The company of the user",
      null=True,
      blank=True
    )
    rating = models.CharField(
      max_length=20,
      choices=RATING_CHOICES,
      null=True,
      blank=True
    )

    def __str__(self):
        return self.name
