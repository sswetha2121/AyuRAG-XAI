from django.contrib import admin
from django.utils import timezone
from .models import User, DoctorProfile, PatientProfile


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'role', 'is_staff', 'is_active', 'date_joined']
    list_filter = ['role', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'professional_name',
        'user',
        'clinical_license',
        'specialization',
        'clinic_institution',
        'approval_status',
        'approved_by',
        'created_at'
    ]
    list_filter = ['approval_status', 'specialization', 'created_at']
    search_fields = ['professional_name', 'clinical_license', 'clinic_institution', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'approved_at']
    actions = ['approve_selected_doctors', 'reject_selected_doctors']

    @admin.action(description='Approve selected doctor registrations')
    def approve_selected_doctors(self, request, queryset):
        count = queryset.update(
            approval_status=DoctorProfile.ApprovalStatus.APPROVED,
            approved_at=timezone.now(),
            approved_by=request.user,
            rejection_reason=''
        )
        self.message_user(request, f"Successfully approved {count} doctor accounts.")

    @admin.action(description='Reject selected doctor registrations')
    def reject_selected_doctors(self, request, queryset):
        count = queryset.update(
            approval_status=DoctorProfile.ApprovalStatus.REJECTED,
            approved_at=timezone.now(),
            approved_by=request.user,
            rejection_reason='Administrative verification criteria not met.'
        )
        self.message_user(request, f"Marked {count} doctor accounts as rejected.")


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'user', 'age', 'gender', 'contact_phone', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['full_name', 'user__username', 'user__email', 'contact_phone']
