from rest_framework import generics

from holon.models import Scenario
from holon.serializers import ETMSerializer


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
