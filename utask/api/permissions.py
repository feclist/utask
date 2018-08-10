from rest_framework import permissions

class IsCreatOrIsAuthenticated(permissions.IsAuthenticated):

    def has_permission(self, request, view):
        return (request.method == 'POST' and request.path == '/api/user/create/') or super().has_permission(request, view)