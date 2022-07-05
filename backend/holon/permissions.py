# permissions.py
from rest_framework import permissions

class AllowOnlyPost(permissions.BasePermission):

    def has_permission(self, request, view):
      if request.user.is_authenticated:
        return True

      if request.method == 'POST':
        return True