from django.shortcuts import render
from rest_framework import mixins, viewsets

from api.models import Slider, InteractiveInput
from api.serializers import SliderSerializer, InteractiveInputSerializer


# Create your views here.
class SliderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Slider.objects.all()
    serializer_class = SliderSerializer


class InteractiveInputViewset(viewsets.ReadOnlyModelViewSet):
    queryset = InteractiveInput.objects.all()
    serializer_class = InteractiveInputSerializer
