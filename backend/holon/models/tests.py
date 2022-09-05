from django.test import TestCase
from ..models import Rating, UpdateRegister


class RatingTest(TestCase):
    def test_rating_str(self):
        ratingStr = "test"
        rating = Rating.objects.create(rating=ratingStr)

        self.assertEqual(str(rating), ratingStr)


class UpdateRegisterTest(TestCase):
    def test_update_register_str(self):
        registrationName = "test"
        registration = UpdateRegister.objects.create(name=registrationName)

        self.assertEqual(str(registration), registrationName)
