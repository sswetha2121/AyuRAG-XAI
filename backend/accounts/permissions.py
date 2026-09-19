from rest_framework import permissions

class IsDoctorUser(permissions.BasePermission):
    """
    Allows access ONLY to authenticated users whose account role is DOCTOR.
    Strictly denies PATIENT and unauthenticated requests.
    """
    message = "Access denied. Dedicated to authenticated DOCTOR accounts only."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'DOCTOR'
        )

class IsPatientUser(permissions.BasePermission):
    message = "Access denied. Dedicated to authenticated PATIENT accounts only."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'PATIENT'
        )
