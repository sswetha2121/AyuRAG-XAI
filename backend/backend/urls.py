from django.contrib import admin
from django.urls import path, include
from .views import root_status_view, api_index_view, health_live_view, health_ready_view

api_urlpatterns = [
    path('', api_index_view, name='api-index'),
    path('health/live/', health_live_view, name='health-live'),
    path('health/ready/', health_ready_view, name='health-ready'),
    path('', include('accounts.urls')),
    path('', include('clinical.urls')),
]

urlpatterns = [
    path('', root_status_view, name='root-status'),
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
]
