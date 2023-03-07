from rest_framework import generics

from holon.models import Scenario
from holon.serializers import ScenarioSerializer, ETMSerializer


class DatamodelService(generics.RetrieveAPIView):
    serializer_class = ScenarioSerializer
    queryset = (
        Scenario.objects.prefetch_related("actor_set")
        .prefetch_related("actor_set__contracts")
        .prefetch_related("gridconnection_set")
        .prefetch_related("gridconnection_set__energyasset_set")
        .prefetch_related("gridnode_set")
        .prefetch_related("gridnode_set__energyasset_set")
        .prefetch_related("policy_set")
        .all()
    )


class ETMService(generics.RetrieveAPIView):
    serializer_class = ETMSerializer
    queryset = (
        Scenario.objects.prefetch_related("query_and_convert_config")
        .prefetch_related("query_and_convert_config__key_value_pair_collection")
        .prefetch_related("query_and_convert_config__etm_query")
        .prefetch_related("query_and_convert_config__etm_query__static_conversion_step")
        .prefetch_related("query_and_convert_config__etm_query__etm_conversion_step")
        .prefetch_related("query_and_convert_config__etm_query__al_conversion_step")
        .prefetch_related("query_and_convert_config__etm_query__datamodel_conversion_step")
        .all()
    )
