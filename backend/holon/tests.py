import os
from unittest import mock
from unittest.mock import patch
from rest_framework.test import APITestCase
from django.test import TestCase
from .anylogic import (
    MOCK_REQUEST,
    MOCK_RESULTS,
    handle_request,
    map_anylogickey_to_api_key,
)


def mock_handle_request(data):
    return MOCK_RESULTS


class AnyLogicAPIViewTestCase(APITestCase):
    @mock.patch("holon.views.handle_request", mock_handle_request)
    def test_request(self):
        response = self.client.post("/calculation/", MOCK_REQUEST, format="json")
        self.assertEqual(200, response.status_code)
        self.assertEqual(response.data, MOCK_RESULTS)


class AnyLogicTestCase(TestCase):
    def setUp(self) -> None:
        self.patcher = patch("holon.anylogic.CloudClient")
        self.MockCloudClient = self.patcher.start()
        self.client = self.MockCloudClient.MagickMock()
        self.MockCloudClient.return_value = self.client

        return super().setUp()

    def test_map_anylogickey_to_api_key_maps_to_english(self):
        key = map_anylogickey_to_api_key("betaalbaarheid")
        self.assertEqual(key, "affordability")

        key = map_anylogickey_to_api_key("duurzaamheid")
        self.assertEqual(key, "renewability")

    def test_map_anylogickey_to_api_key_returns_same_if_no_mapping_is_available(self):
        key = map_anylogickey_to_api_key("testkey")
        self.assertEqual(key, "testkey")

    def test_handle_request_initializes_anylogic_client(self):
        handle_request(MOCK_REQUEST)

        self.MockCloudClient.assert_called_once_with(os.environ.get("AL_API_KEY"))
        self.client.get_model_by_name.assert_called_once_with("Holon buurt model")
        self.client.get_latest_model_version.assert_called_once_with(
            self.client.get_model_by_name()
        )
        self.client.create_inputs_from_experiment.assert_called_once_with(
            self.client.get_latest_model_version(), "Experiment"
        )

    def test_handle_request_returns_dict(self):
        response = handle_request(MOCK_REQUEST)

        test_response = {"national": {}, "national": {}}

        assert test_response.items() <= response.items()
