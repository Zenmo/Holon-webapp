from rest_framework import routers

from api.views import SliderViewSet, InteractiveInputViewset

api_router = routers.DefaultRouter()
api_router.register("sliders", SliderViewSet)
api_router.register("interactive-inputs", InteractiveInputViewset)
