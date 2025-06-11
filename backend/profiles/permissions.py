from rest_framework import permissions


class IsMatchingRole(permissions.BasePermission):
    def has_permission(self, request, view):
        role = getattr(request.user, "role", None)
        pt = request.data.get("profile_type")
        return role == pt
