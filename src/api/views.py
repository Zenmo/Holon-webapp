from django.shortcuts import render
from rest_framework import mixins, viewsets

from api.models import Slider
from api.serializers import SliderSerializer


# Create your views here.


class SliderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Slider.objects.all()
    serializer_class = SliderSerializer
