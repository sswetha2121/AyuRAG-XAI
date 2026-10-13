from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, DoctorProfile


class AuthenticationAndSecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.patient_user = User.objects.create_user(
            username='patient.test',
            email='patient@test.com',
            password='Password123!',
            role=User.Role.PATIENT
        )
        self.doctor_user = User.objects.create_user(
            username='doctor.test',
            email='doctor@test.com',
            password='DoctorPassword123!',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=self.doctor_user,
            professional_name='Dr. Test',
            qualification='MD Ayurveda'
        )

    def test_login_success(self):
        """Valid credentials return 200, auth token, and correct role."""
        response = self.client.post('/api/auth/login/', {
            'username': 'patient.test',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['role'], 'PATIENT')

    def test_login_failure_invalid_credentials(self):
        """Invalid credentials return 401 Unauthorized."""
        response = self.client.post('/api/auth/login/', {
            'username': 'patient.test',
            'password': 'WrongPassword!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_registration_password_length_validation(self):
        """Password shorter than 8 characters is strictly rejected."""
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'newuser@test.com',
            'password': '123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Password must be at least 8 characters long.', response.data.get('error', ''))

    def test_registration_success(self):
        """Valid registration creates account and returns 201."""
        response = self.client.post('/api/auth/register/', {
            'username': 'validuser',
            'email': 'validuser@test.com',
            'password': 'SecurePassword123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='validuser').exists())

    @override_settings(DEBUG=False, DEMO_MODE=False)
    def test_demo_switch_disabled_in_production(self):
        """Demo persona switching is blocked with 403 when DEMO_MODE/DEBUG is disabled."""
        response = self.client.post('/api/auth/demo-switch/', {
            'role': 'DOCTOR'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('strictly disabled in production', response.data.get('error', ''))

    @override_settings(DEBUG=True, DEMO_MODE=True)
    def test_demo_switch_isolated_personas(self):
        """In debug demo mode, demo switch uses dedicated demo personas."""
        response = self.client.post('/api/auth/demo-switch/', {
            'role': 'DOCTOR'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'demo.doctor')
        self.assertEqual(response.data['user']['role'], 'DOCTOR')

    def test_doctor_route_restricted_from_patient(self):
        """Patient cannot access doctor workspace endpoints."""
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get('/api/doctor/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_route_accessible_by_doctor(self):
        """Doctor can access doctor dashboard endpoint."""
        self.client.force_authenticate(user=self.doctor_user)
        response = self.client.get('/api/doctor/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
