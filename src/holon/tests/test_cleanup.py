from django.test import TestCase
from holon.models.scenario import Scenario
from django.urls import reverse
from django.test import Client
from rest_framework.response import Response


class MyTest(TestCase):
    fixtures = ["holon/tests/fixtures/merged-datamodel-ehub-config-fixture.json"]

    def test_cleanup_scenarios(self):
        # Arange
        scenario = Scenario.objects.get(pk=1)
        scenario.clone()

        # Act
        url: str = reverse("holon-cleanup")
        client: Client = Client()
        response: Response = client.get(url)

        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, "succes")

        scenarios = Scenario.objects.all()
        self.assertEqual(len(scenarios), 1)
