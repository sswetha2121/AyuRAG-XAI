from django.urls import path
from .views import (
    DoctorDashboardView,
    DoctorPatientListView,
    DoctorPatientDetailView,
    DoctorReviewListView,
    DoctorReviewDetailView,
    DoctorReportsView
)

urlpatterns = [
    path('doctor/dashboard/', DoctorDashboardView.as_view(), name='doctor-dashboard'),
    path('doctor/patients/', DoctorPatientListView.as_view(), name='doctor-patients'),
    path('doctor/patients/<int:pk>/', DoctorPatientDetailView.as_view(), name='doctor-patient-detail'),
    path('doctor/reviews/', DoctorReviewListView.as_view(), name='doctor-reviews'),
    path('doctor/reviews/<int:pk>/', DoctorReviewDetailView.as_view(), name='doctor-review-detail'),
    path('doctor/reports/', DoctorReportsView.as_view(), name='doctor-reports'),
]
