from django.urls import path
from .views import (
    DoctorDashboardView,
    DoctorPatientListView,
    DoctorPatientDetailView,
    DoctorReviewListView,
    DoctorReviewDetailView,
    DoctorReportsView,
    DoctorPatientVerificationView,
    DoctorVerifyFieldView,
    DoctorVerifyAllFieldsView,
    DoctorDietGenerateView,
    DoctorPatientDietPlanListView,
    DoctorDietPlanDetailView,
    DoctorDietPlanApproveView,
    DoctorDietPlanRejectView,
    DoctorPatientAuditLogsView,
    PatientCurrentDietView,
    NotificationListView,
    NotificationMarkReadView
)

urlpatterns = [
    # Doctor Dashboard & Patient Directory
    path('doctor/dashboard/', DoctorDashboardView.as_view(), name='doctor-dashboard'),
    path('doctor/patients/', DoctorPatientListView.as_view(), name='doctor-patients'),
    path('doctor/patients/<int:pk>/', DoctorPatientDetailView.as_view(), name='doctor-patient-detail'),
    path('doctor/reviews/', DoctorReviewListView.as_view(), name='doctor-reviews'),
    path('doctor/reviews/<int:pk>/', DoctorReviewDetailView.as_view(), name='doctor-review-detail'),
    path('doctor/reports/', DoctorReportsView.as_view(), name='doctor-reports'),

    # Clinical Verification Endpoints
    path('doctor/patients/<int:patient_id>/verification/', DoctorPatientVerificationView.as_view(), name='doctor-patient-verification'),
    path('doctor/patients/<int:patient_id>/verify-field/', DoctorVerifyFieldView.as_view(), name='doctor-verify-field'),
    path('doctor/patients/<int:patient_id>/verify-all/', DoctorVerifyAllFieldsView.as_view(), name='doctor-verify-all'),

    # Diet Generation & Management
    path('doctor/patients/<int:patient_id>/diet/generate/', DoctorDietGenerateView.as_view(), name='doctor-diet-generate'),
    path('doctor/patients/<int:patient_id>/diet-plans/', DoctorPatientDietPlanListView.as_view(), name='doctor-patient-diet-plans'),
    path('doctor/diet-plans/<int:plan_id>/', DoctorDietPlanDetailView.as_view(), name='doctor-diet-plan-detail'),
    path('doctor/diet-plans/<int:plan_id>/approve/', DoctorDietPlanApproveView.as_view(), name='doctor-diet-plan-approve'),
    path('doctor/diet-plans/<int:plan_id>/reject/', DoctorDietPlanRejectView.as_view(), name='doctor-diet-plan-reject'),
    path('doctor/patients/<int:patient_id>/audit-logs/', DoctorPatientAuditLogsView.as_view(), name='doctor-patient-audit-logs'),

    # Patient Isolated Endpoints
    path('patient/diet/current/', PatientCurrentDietView.as_view(), name='patient-current-diet'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('notifications/mark-all-read/', NotificationMarkReadView.as_view(), name='notifications-mark-all-read'),
]

