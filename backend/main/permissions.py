from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow read-only (safe) requests for any user
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions require ownership
        return obj.owner == request.user
