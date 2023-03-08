from rest_framework import serializers

from holon.models.config import (
    KeyValuePairCollection,
    StaticConversion,
    ETMConversion,
    AnyLogicConversion,
    DatamodelConversion,
    ETMQuery,
    QueryAndConvertConfig,
)

from holon.models.scenario import Scenario


class KeyValuePairCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyValuePairCollection
        fields = "__all__"


class StaticConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticConversion
        fields = "__all__"


class ETMConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ETMConversion
        fields = "__all__"


class AnyLogicConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnyLogicConversion
        fields = "__all__"


class DatamodelConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatamodelConversion
        fields = "__all__"


class ETMQuerySerializer(serializers.ModelSerializer):
    static_conversion_steps = StaticConversionSerializer(
        many=True, read_only=True, source="static_conversion_step"
    )
    etm_conversion_steps = ETMConversionSerializer(
        many=True, read_only=True, source="etm_conversion_step"
    )
    al_conversion_steps = AnyLogicConversionSerializer(
        many=True, read_only=True, source="al_conversion_step"
    )
    datamodel_conversion_steps = DatamodelConversionSerializer(
        many=True, read_only=True, source="datamodel_conversion_step"
    )

    class Meta:
        model = ETMQuery
        fields = "__all__"


class QueryAndConvertConfigSerializer(serializers.ModelSerializer):
    key_value_pair_collections = KeyValuePairCollectionSerializer(
        many=True, read_only=True, source="key_value_pair_collection"
    )
    etm_queries = ETMQuerySerializer(many=True, read_only=True, source="etm_query")

    class Meta:
        model = QueryAndConvertConfig
        fields = "__all__"


class ETMSerializer(serializers.ModelSerializer):
    query_and_convert_configs = QueryAndConvertConfigSerializer(
        many=True, read_only=True, source="query_and_convert_config"
    )

    class Meta:
        model = Scenario
        fields = "__all__"
