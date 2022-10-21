from rest_framework import routers

from api.views import SliderViewSet

api_router = routers.DefaultRouter()
api_router.register("sliders", SliderViewSet)
