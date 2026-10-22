from django.urls import path
from .views import (
    DoctorDashboardView,
    DoctorPatientListView,
    DoctorPatientDetailView,
    DoctorPatientAssignView,
    DoctorPatientUnassignView,
    DoctorReviewListView,
    DoctorReviewDetailView,
    DoctorReportsView,
    DoctorPatientVerificationView,
    DoctorVerifyFieldView,
    DoctorVerifyAllFieldsView,
    DoctorFoodCatalogueView,
    DoctorFoodSubstitutesView,
    DoctorDietGenerateView,
    DoctorPatientDietPlanListView,
    DoctorDietPlanDetailView,
    DoctorDietPlanRecalculateView,
    DoctorDietPlanApproveView,
    DoctorDietPlanSupersedeView,
    DoctorDietPlanRejectView,
    DoctorPatientAuditLogsView,
    DoctorMonitoringDashboardView,
    DoctorMonitoringPatientDetailView,
    DoctorDifficultyReportReviewView,
    PatientCurrentDietView,
    PatientDietReportDifficultyView,
    PatientAssessmentSubmitView,
    PatientAssessmentDetailView,
    PatientAssessmentRetryView,
    PatientLatestAssessmentView,
    NotificationListView,
    NotificationMarkReadView,
    PatientMealScheduleView,
    PatientMealReminderPreferenceView,
    PatientWaterLogView,
    PatientProgressView,
    PatientDietHistoryView,
    ClinicalAiInferenceView,
    ClinicalRagQueryView,
    ClinicalRagStatsView,
    PatientAssessmentHistoryView,
    MessagingConversationsView,
    MessagingThreadView,
    MessagingSendView,
)

urlpatterns = [
    # Dedicated AI Model Inference & Grounded Clinical RAG Pipeline
    path('clinical/ai/infer/', ClinicalAiInferenceView.as_view(), name='clinical-ai-infer'),
    path('clinical/rag/query/', ClinicalRagQueryView.as_view(), name='clinical-rag-query'),
    path('clinical/rag/stats/', ClinicalRagStatsView.as_view(), name='clinical-rag-stats'),

    # Doctor Dashboard & Patient Directory
    path('doctor/dashboard/', DoctorDashboardView.as_view(), name='doctor-dashboard'),
    path('doctor/patients/', DoctorPatientListView.as_view(), name='doctor-patients'),
    path('doctor/patients/<int:pk>/', DoctorPatientDetailView.as_view(), name='doctor-patient-detail'),
    path('doctor/patients/<int:patient_id>/assign/', DoctorPatientAssignView.as_view(), name='doctor-patient-assign'),
    path('doctor/patients/<int:patient_id>/unassign/', DoctorPatientUnassignView.as_view(), name='doctor-patient-unassign'),
    path('doctor/reviews/', DoctorReviewListView.as_view(), name='doctor-reviews'),
    path('doctor/reviews/<int:pk>/', DoctorReviewDetailView.as_view(), name='doctor-review-detail'),
    path('doctor/reports/', DoctorReportsView.as_view(), name='doctor-reports'),

    # Clinical Verification Endpoints
    path('doctor/patients/<int:patient_id>/verification/', DoctorPatientVerificationView.as_view(), name='doctor-patient-verification'),
    path('doctor/patients/<int:patient_id>/verify-field/', DoctorVerifyFieldView.as_view(), name='doctor-verify-field'),
    path('doctor/patients/<int:patient_id>/verify-all/', DoctorVerifyAllFieldsView.as_view(), name='doctor-verify-all'),

    # Food Catalogue & Substitutes (IFCT 2017 derived)
    path('doctor/food-catalogue/', DoctorFoodCatalogueView.as_view(), name='doctor-food-catalogue'),
    path('doctor/food-substitutes/', DoctorFoodSubstitutesView.as_view(), name='doctor-food-substitutes'),

    # Diet Generation & Management
    path('doctor/patients/<int:patient_id>/diet/generate/', DoctorDietGenerateView.as_view(), name='doctor-diet-generate'),
    path('doctor/patients/<int:patient_id>/diet-plans/', DoctorPatientDietPlanListView.as_view(), name='doctor-patient-diet-plans'),
    path('doctor/diet-plans/<int:plan_id>/', DoctorDietPlanDetailView.as_view(), name='doctor-diet-plan-detail'),
    path('doctor/diet-plans/<int:plan_id>/recalculate/', DoctorDietPlanRecalculateView.as_view(), name='doctor-diet-plan-recalculate'),
    path('doctor/diet-plans/<int:plan_id>/approve/', DoctorDietPlanApproveView.as_view(), name='doctor-diet-plan-approve'),
    path('doctor/diet-plans/<int:plan_id>/supersede/', DoctorDietPlanSupersedeView.as_view(), name='doctor-diet-plan-supersede'),
    path('doctor/diet-plans/<int:plan_id>/reject/', DoctorDietPlanRejectView.as_view(), name='doctor-diet-plan-reject'),
    path('doctor/patients/<int:patient_id>/audit-logs/', DoctorPatientAuditLogsView.as_view(), name='doctor-patient-audit-logs'),

    # Doctor Monitoring Dashboard & Detail
    path('doctor/monitoring/', DoctorMonitoringDashboardView.as_view(), name='doctor-monitoring-dashboard'),
    path('doctor/monitoring/<int:patient_id>/', DoctorMonitoringPatientDetailView.as_view(), name='doctor-monitoring-patient-detail'),
    path('doctor/monitoring/difficulty/<int:report_id>/review/', DoctorDifficultyReportReviewView.as_view(), name='doctor-difficulty-review'),

    # Patient Isolated Endpoints
    path('patient/diet/current/', PatientCurrentDietView.as_view(), name='patient-current-diet'),
    path('patient/diet/history/', PatientDietHistoryView.as_view(), name='patient-diet-history'),
    path('patient/diet/report-difficulty/', PatientDietReportDifficultyView.as_view(), name='patient-diet-report-difficulty'),
    path('patient/assessment/submit/', PatientAssessmentSubmitView.as_view(), name='patient-assessment-submit'),
    path('patient/assessment/<int:pk>/', PatientAssessmentDetailView.as_view(), name='patient-assessment-detail'),
    path('patient/assessment/<int:pk>/retry-analysis/', PatientAssessmentRetryView.as_view(), name='patient-assessment-retry'),
    path('patient/assessment/latest/', PatientLatestAssessmentView.as_view(), name='patient-assessment-latest'),
    path('patient/assessment/history/', PatientAssessmentHistoryView.as_view(), name='patient-assessment-history'),
    path('patient/meal-schedule/', PatientMealScheduleView.as_view(), name='patient-meal-schedule'),
    path('patient/meal-schedule/log/', PatientMealScheduleView.as_view(), name='patient-meal-schedule-log'),
    path('patient/reminders/', PatientMealReminderPreferenceView.as_view(), name='patient-meal-reminders'),
    path('patient/water/log/', PatientWaterLogView.as_view(), name='patient-water-log'),
    path('patient/progress/', PatientProgressView.as_view(), name='patient-progress'),

    # Patient-Doctor Authenticated Messaging
    path('messages/conversations/', MessagingConversationsView.as_view(), name='messages-conversations'),
    path('messages/<int:user_id>/', MessagingThreadView.as_view(), name='messages-thread-by-id'),
    path('messages/thread/<int:user_id>/', MessagingThreadView.as_view(), name='messages-thread'),
    path('messages/send/', MessagingSendView.as_view(), name='messages-send'),

    # Notifications
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('notifications/mark-all-read/', NotificationMarkReadView.as_view(), name='notifications-mark-all-read'),
]



