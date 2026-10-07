"""
Root and API status views for AyuRAG-XAI Backend.
"""

from django.http import JsonResponse


def root_status_view(request):
    """
    Root endpoint for AyuRAG-XAI Backend (http://127.0.0.1:8000/).
    Provides service status, frontend application link, and available API routes.
    """
    return JsonResponse({
        "status": "healthy",
        "service": "AyuRAG-XAI Clinical Decision Support Backend API",
        "version": "2.1.0",
        "frontend_url": "http://localhost:5173",
        "message": (
            "AyuRAG-XAI backend API is running. "
            "To access the patient & doctor user interface, visit http://localhost:5173."
        ),
        "endpoints": {
            "root": "/",
            "admin": "/admin/",
            "api_root": "/api/",
            "auth": {
                "me": "/api/auth/me/",
                "login": "/api/auth/login/",
                "doctor_login": "/api/auth/doctor-login/",
                "register": "/api/auth/register/",
                "logout": "/api/auth/logout/",
                "demo_switch": "/api/auth/demo-switch/"
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
        "auth_routes": "/api/auth/",
        "doctor_routes": "/api/doctor/",
        "patient_routes": "/api/patient/",
        "notifications": "/api/notifications/"
    }, json_dumps_params={'indent': 2})
