from django.http import JsonResponse
from django.views.decorators.csrf import get_token


def get_csrf(request):
    return JsonResponse({"token": get_token(request)})
