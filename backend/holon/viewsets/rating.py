from holon.models import Rating
from holon.serializers import RatingSerializer
from rest_framework import viewsets, mixins

# ViewSets define the view behavior.
class RatingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
