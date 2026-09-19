from django.urls import path
from .views import MeView, LoginView, LogoutView, DemoSwitchView

urlpatterns = [
    path('auth/me/', MeView.as_view(), name='auth-me'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/demo-switch/', DemoSwitchView.as_view(), name='auth-demo-switch'),
]
