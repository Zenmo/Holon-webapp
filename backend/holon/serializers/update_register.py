from holon.models import UpdateRegister
from rest_framework import serializers

class UpdateRegisterSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = UpdateRegister
        fields = ["name", "email", "company"]