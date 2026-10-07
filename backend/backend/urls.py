from django.contrib import admin
from django.urls import path, include
from .views import root_status_view, api_index_view

api_urlpatterns = [
    path('', api_index_view, name='api-index'),
    path('', include('accounts.urls')),
    path('', include('clinical.urls')),
]

urlpatterns = [
    path('', root_status_view, name='root-status'),
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
]
