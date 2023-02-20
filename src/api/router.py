from rest_framework import routers

from api.views import InteractiveInputViewset

api_router = routers.DefaultRouter()
api_router.register("interactive-inputs", InteractiveInputViewset)
