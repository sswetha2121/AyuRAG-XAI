from rest_framework import permissions

class IsDoctorUser(permissions.BasePermission):
    """
    Allows access ONLY to authenticated users whose account role is DOCTOR
    and whose doctor profile has been verified and approved by an administrator.
    Strictly denies PATIENT, unauthenticated, and pending/rejected doctor requests.
    """
    message = "Access denied. Dedicated to approved DOCTOR accounts only."

    def has_permission(self, request, view):
        user = getattr(request, 'user', None)
        if not (user and user.is_authenticated and getattr(user, 'role', None) == 'DOCTOR'):
            return False

        doctor_profile = getattr(user, 'doctor_profile', None)
        if not doctor_profile or doctor_profile.approval_status != 'APPROVED':
            self.message = "Account pending administrative verification. Access to clinical records is restricted until approval."
            return False

        return True

class IsPatientUser(permissions.BasePermission):
    message = "Access denied. Dedicated to authenticated PATIENT accounts only."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'PATIENT'
        )
