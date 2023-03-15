from django.db.models import Q
from django.db.models.query import QuerySet

from holon.models.filter import Filter


class FilterAggregation:
    """Collection of functions for aggregating on filter results"""

    def get_filters_object_count(filters: list[Filter]) -> int:
        """Get the number of objects in the combined filter resutls"""
        filtered_queryset = FilterAggregation.get_queryset_from_filters(filters)
        return filtered_queryset.count()

    def get_filters_attribute_sum(filters: list[Filter], attribute_name: str) -> float:
        """Return the sum of a specific attribute of all objects in a queryset"""

        filtered_queryset = FilterAggregation.get_queryset_from_filters(filters)

        attr_sum = 0

        for filtered_object in filtered_queryset:
            try:
                value = getattr(filtered_object, attribute_name)
                attr_sum += value
            except Exception as e:
                print(f"Something went wrong, let's act as if nothing happend and keep going ({e})")

        return attr_sum

        # TODO on what model are we filtering? And do we want models within a specific scenario, or all models in the database? - TAVM

    def get_queryset_from_filters(
        filters: list[Filter],
    ) -> QuerySet:
        """Get a queryset from a list of filters"""
        queryset_filter = Q()

        # filter: Filter
        for filter in filters:
            queryset_filter &= filter.get_q()

        return base_queryset.filter(queryset_filter)
