import imp

from django.urls import path

from .views import HolonService, HolonV2Service

urlpatterns = [path("holon/", HolonService.as_view())]

urlpatterns_v2 = [path("holon/", HolonV2Service.as_view())]
