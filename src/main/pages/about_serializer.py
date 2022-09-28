from .base_serializer import BasePageSerializer
from . import AboutPage


class AboutPageSerializer(BasePageSerializer):
    class Meta:
        model = AboutPage
        fields = [
            "company_name",
        ] + BasePageSerializer.Meta.fields
