"""
Root and API status views for AyuRAG-XAI Backend.
Includes safe, production-grade liveness and readiness health checks.
"""

import os
import logging
from django.http import JsonResponse
from django.db import connection
from django.conf import settings

logger = logging.getLogger(__name__)


def health_live_view(request):
    """
    Liveness probe: verifies process execution.
    Safe: does not leak sensitive information, database internals, or environment variables.
    """
    return JsonResponse({
        "status": "live",
        "service": "AyuRAG-XAI Clinical Decision Support Backend",
        "environment": getattr(settings, 'ENVIRONMENT', 'production'),
    }, status=200)


def health_ready_view(request):
    """
    Readiness probe: verifies backend dependencies (database connectivity).
    Safe: returns 200 on healthy connectivity and 503 on database failure without disclosing internals.
    """
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            cursor.fetchone()
        return JsonResponse({
            "status": "ready",
            "service": "AyuRAG-XAI Clinical Decision Support Backend",
            "database": "connected"
        }, status=200)
    except Exception as exc:
        logger.error("Health readiness check failed: %s", str(exc))
        return JsonResponse({
            "status": "unavailable",
            "service": "AyuRAG-XAI Clinical Decision Support Backend",
            "database": "disconnected"
        }, status=503)


def root_status_view(request):
    """
    Root endpoint for AyuRAG-XAI Backend.
    Provides service status, health endpoints, and available API routes.
    """
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    return JsonResponse({
        "status": "healthy",
        "service": "AyuRAG-XAI Clinical Decision Support Backend API",
        "version": "2.1.0",
        "frontend_url": frontend_url,
        "message": "AyuRAG-XAI backend API is running.",
        "health": {
            "live": "/api/health/live/",
            "ready": "/api/health/ready/"
        },
        "endpoints": {
            "root": "/",
            "admin": "/admin/",
            "api_root": "/api/",
            "auth": {
                "me": "/api/auth/me/",
                "login": "/api/auth/login/",
                "doctor_login": "/api/auth/doctor-login/",
                "register": "/api/auth/register/",
                "logout": "/api/auth/logout/"
            },
            "clinical": {
                "doctor_dashboard": "/api/doctor/dashboard/",
                "doctor_patients": "/api/doctor/patients/",
                "doctor_reviews": "/api/doctor/reviews/",
                "doctor_reports": "/api/doctor/reports/",
                "patient_diet": "/api/patient/diet/current/",
                "patient_assessment_submit": "/api/patient/assessment/submit/"
            }
        }
    }, json_dumps_params={'indent': 2})


def api_index_view(request):
    """
    API root endpoint (http://127.0.0.1:8000/api/).
    """
    return JsonResponse({
        "status": "healthy",
        "service": "AyuRAG-XAI REST API",
        "version": "2.1.0",
        "description": "Clinical Decision Support & Explainable Ayurvedic Intelligence API",
        "health_live": "/api/health/live/",
        "health_ready": "/api/health/ready/",
        "auth_routes": "/api/auth/",
        "doctor_routes": "/api/doctor/",
        "patient_routes": "/api/patient/",
        "notifications": "/api/notifications/"
    }, json_dumps_params={'indent': 2})
