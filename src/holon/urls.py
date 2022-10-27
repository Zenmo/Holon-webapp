import imp
from django.urls import path

from .views import HolonService

urlpatterns = [path("holon/", HolonService.as_view())]
