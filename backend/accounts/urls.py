from django.urls import path
from .views import (
    MeView,
    LoginView,
    DoctorLoginView,
    DoctorRegisterView,
    RegisterView,
    LogoutView,
    DemoSwitchView,
    AdminPendingDoctorsView,
    AdminDoctorApprovalView
)

urlpatterns = [
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/doctor-login/', DoctorLoginView.as_view(), name='auth-doctor-login'),
    path('auth/doctor-register/', DoctorRegisterView.as_view(), name='auth-doctor-register'),
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/demo-switch/', DemoSwitchView.as_view(), name='auth-demo-switch'),
    path('admin/doctors/pending/', AdminPendingDoctorsView.as_view(), name='admin-pending-doctors'),
    path('admin/doctors/<int:pk>/approve/', AdminDoctorApprovalView.as_view(), name='admin-doctor-approve'),
    path('admin/doctors/<int:pk>/reject/', AdminDoctorApprovalView.as_view(), name='admin-doctor-reject'),
]

