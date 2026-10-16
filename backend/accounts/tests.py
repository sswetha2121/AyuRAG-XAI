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
            qualification='MD Ayurveda',
            clinical_license='AYUSH-TEST-2026-0001',
            approval_status=DoctorProfile.ApprovalStatus.APPROVED
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

    def test_registration_rejects_common_password(self):
        """Common passwords (e.g., 'password123') fail Django password validators."""
        response = self.client.post('/api/auth/register/', {
            'username': 'weakuser',
            'email': 'weakuser@test.com',
            'password': 'password'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_registration_always_assigns_patient_role(self):
        """Registration ignores any client-supplied doctor role and strictly assigns PATIENT."""
        response = self.client.post('/api/auth/register/', {
            'username': 'sneakyuser',
            'email': 'sneaky@test.com',
            'password': 'StrongPassword2026!',
            'role': 'DOCTOR'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='sneakyuser')
        self.assertEqual(user.role, User.Role.PATIENT)

    def test_health_live_endpoint(self):
        """Liveness endpoint returns 200 and does not leak secrets."""
        response = self.client.get('/api/health/live/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('status'), 'live')

    def test_health_ready_endpoint(self):
        """Readiness endpoint returns 200 and confirms database connectivity."""
        response = self.client.get('/api/health/ready/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json().get('status'), 'ready')
        self.assertEqual(response.json().get('database'), 'connected')

    def test_unauthenticated_cannot_access_me(self):
        """Unauthenticated request to /api/auth/me/ returns 401 or 403."""
        response = self.client.get('/api/auth/me/')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_doctor_registration_success_pending_approval(self):
        """Valid doctor registration creates DOCTOR account with PENDING approval and does not auto-login."""
        payload = {
            'fullName': 'Dr. Swetha Rao',
            'email': 'swetha.rao@ayurhospital.org',
            'clinicalLicense': 'AYUSH-KA-2026-9812',
            'specialization': 'Kayachikitsa (Internal Medicine)',
            'qualification': 'BAMS, MD (Ayurveda)',
            'clinicInstitution': 'National Institute of Ayurveda',
            'experienceYears': 10,
            'password': 'SecurePhysicianPass2026!',
            'confirmPassword': 'SecurePhysicianPass2026!'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get('approval_status'), 'PENDING')
        self.assertIn('awaiting administrative verification', response.data.get('message', ''))

        # Check DB persistence
        user = User.objects.get(email='swetha.rao@ayurhospital.org')
        self.assertEqual(user.role, User.Role.DOCTOR)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.check_password('SecurePhysicianPass2026!'))

        profile = user.doctor_profile
        self.assertEqual(profile.professional_name, 'Dr. Swetha Rao')
        self.assertEqual(profile.clinical_license, 'AYUSH-KA-2026-9812')
        self.assertEqual(profile.approval_status, DoctorProfile.ApprovalStatus.PENDING)
        self.assertFalse(profile.is_approved())

        # Unauthenticated check: ensure no session cookie was created
        me_resp = self.client.get('/api/auth/me/')
        self.assertIn(me_resp.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_doctor_registration_duplicate_email(self):
        """Doctor registration with already registered email returns 400."""
        payload = {
            'fullName': 'Dr. Duplicate Email',
            'email': 'doctor@test.com',  # already exists in setUp
            'clinicalLicense': 'AYUSH-UNIQUE-2026-9999',
            'password': 'SecurePhysicianPass2026!',
            'confirmPassword': 'SecurePhysicianPass2026!'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already exists', response.data.get('error', ''))

    def test_doctor_registration_duplicate_license(self):
        """Doctor registration with already registered license returns 400."""
        payload = {
            'fullName': 'Dr. Another Practitioner',
            'email': 'new.practitioner@ayurag.org',
            'clinicalLicense': 'AYUSH-TEST-2026-0001',  # already exists in setUp
            'password': 'SecurePhysicianPass2026!',
            'confirmPassword': 'SecurePhysicianPass2026!'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already registered', response.data.get('error', ''))

    def test_doctor_registration_invalid_email(self):
        """Doctor registration rejects invalid email format."""
        payload = {
            'fullName': 'Dr. Invalid Email',
            'email': 'not-an-email',
            'clinicalLicense': 'AYUSH-LIC-0002',
            'password': 'SecurePhysicianPass2026!',
            'confirmPassword': 'SecurePhysicianPass2026!'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('valid professional email', response.data.get('error', ''))

    def test_doctor_registration_password_mismatch(self):
        """Doctor registration rejects mismatched confirmPassword."""
        payload = {
            'fullName': 'Dr. Mismatch',
            'email': 'mismatch@ayurag.org',
            'clinicalLicense': 'AYUSH-LIC-0003',
            'password': 'SecurePhysicianPass2026!',
            'confirmPassword': 'DifferentPassword2026!'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Passwords do not match', response.data.get('error', ''))

    def test_doctor_registration_password_length(self):
        """Doctor registration rejects password < 8 chars."""
        payload = {
            'fullName': 'Dr. Short PW',
            'email': 'shortpw@ayurag.org',
            'clinicalLicense': 'AYUSH-LIC-0004',
            'password': '123',
            'confirmPassword': '123'
        }
        response = self.client.post('/api/auth/doctor-register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('at least 8 characters', response.data.get('error', ''))

    def test_pending_doctor_cannot_login(self):
        """Doctor with PENDING approval is rejected from login with 403 and pending message."""
        user = User.objects.create_user(
            username='pending.doc',
            email='pending.doc@test.com',
            password='DocPassword2026!',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=user,
            professional_name='Dr. Pending',
            clinical_license='AYUSH-PENDING-0001',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )

        # Attempt doctor login
        response = self.client.post('/api/auth/doctor-login/', {
            'username': 'pending.doc',
            'password': 'DocPassword2026!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('awaiting administrative verification', response.data.get('error', ''))

        # Attempt general login
        gen_response = self.client.post('/api/auth/login/', {
            'username': 'pending.doc@test.com',
            'password': 'DocPassword2026!'
        }, format='json')
        self.assertEqual(gen_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('awaiting administrative verification', gen_response.data.get('error', ''))

    def test_pending_doctor_cannot_access_doctor_routes(self):
        """Pending doctor forced-authenticated session is rejected from doctor routes."""
        pending_user = User.objects.create_user(
            username='pending.doc2',
            email='pending.doc2@test.com',
            password='DocPassword2026!',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=pending_user,
            professional_name='Dr. Pending Two',
            clinical_license='AYUSH-PENDING-0002',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )
        self.client.force_authenticate(user=pending_user)
        response = self.client.get('/api/doctor/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('pending administrative verification', response.data.get('detail', ''))

    def test_rejected_doctor_cannot_login(self):
        """Rejected doctor receives 403 with rejection info."""
        rejected_user = User.objects.create_user(
            username='rejected.doc',
            email='rejected.doc@test.com',
            password='DocPassword2026!',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=rejected_user,
            professional_name='Dr. Rejected',
            clinical_license='AYUSH-REJECT-0001',
            approval_status=DoctorProfile.ApprovalStatus.REJECTED,
            rejection_reason='Invalid registration council number.'
        )
        response = self.client.post('/api/auth/doctor-login/', {
            'username': 'rejected.doc',
            'password': 'DocPassword2026!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('not approved', response.data.get('error', ''))
        self.assertIn('Invalid registration council number.', response.data.get('error', ''))

    def test_unauthorized_user_cannot_approve_doctor(self):
        """Non-admin user (e.g., patient or unauthenticated) cannot approve doctor accounts."""
        pending_user = User.objects.create_user(
            username='pending.doc3',
            email='pending.doc3@test.com',
            password='DocPassword2026!',
            role=User.Role.DOCTOR
        )
        profile = DoctorProfile.objects.create(
            user=pending_user,
            professional_name='Dr. Pending Three',
            clinical_license='AYUSH-PENDING-0003',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )

        # Unauthenticated request
        anon_resp = self.client.post(f'/api/admin/doctors/{profile.id}/approve/', {'action': 'approve'})
        self.assertIn(anon_resp.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Patient request
        self.client.force_authenticate(user=self.patient_user)
        patient_resp = self.client.post(f'/api/admin/doctors/{profile.id}/approve/', {'action': 'approve'})
        self.assertEqual(patient_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_doctor_self_approval_forbidden(self):
        """An administrator cannot approve their own doctor account."""
        admin_doctor = User.objects.create_user(
            username='admin.doctor',
            email='admin.doctor@ayurag.org',
            password='AdminPassword2026!',
            role=User.Role.DOCTOR,
            is_staff=True
        )
        profile = DoctorProfile.objects.create(
            user=admin_doctor,
            professional_name='Dr. Admin',
            clinical_license='AYUSH-ADMIN-0001',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )
        self.client.force_authenticate(user=admin_doctor)
        response = self.client.post(f'/api/admin/doctors/{profile.id}/approve/', {'action': 'approve'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('forbidden', response.data.get('error', ''))

    def test_admin_can_approve_doctor(self):
        """Staff administrator can approve a pending doctor, unlocking portal login."""
        admin_user = User.objects.create_user(
            username='staff.admin',
            email='admin@ayurag.org',
            password='AdminPass2026!',
            role=User.Role.DOCTOR,
            is_staff=True
        )
        new_doc = User.objects.create_user(
            username='dr.onboarding',
            email='onboarding@ayurag.org',
            password='DoctorOnboardPass2026!',
            role=User.Role.DOCTOR
        )
        profile = DoctorProfile.objects.create(
            user=new_doc,
            professional_name='Dr. Onboarding',
            clinical_license='AYUSH-ONBOARD-2026',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )

        # Admin approves
        self.client.force_authenticate(user=admin_user)
        approve_resp = self.client.post(f'/api/admin/doctors/{profile.id}/approve/', {'action': 'approve'})
        self.assertEqual(approve_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(approve_resp.data.get('approval_status'), 'APPROVED')

        profile.refresh_from_db()
        self.assertEqual(profile.approval_status, DoctorProfile.ApprovalStatus.APPROVED)
        self.assertIsNotNone(profile.approved_at)
        self.assertEqual(profile.approved_by, admin_user)

        # Now the approved doctor can log in
        self.client.force_authenticate(user=None)
        login_resp = self.client.post('/api/auth/doctor-login/', {
            'username': 'dr.onboarding',
            'password': 'DoctorOnboardPass2026!'
        }, format='json')
        self.assertEqual(login_resp.status_code, status.HTTP_200_OK)
        self.assertIn('user', login_resp.data)
        self.assertEqual(login_resp.data['user']['role'], 'DOCTOR')

    def test_doctor_portal_rejects_patient_login(self):
        """Patient user credentials submitted to /api/auth/doctor-login/ receive 403."""
        response = self.client.post('/api/auth/doctor-login/', {
            'username': 'patient.test',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('Access Denied', response.data.get('error', ''))

    def test_create_doctor_management_command(self):
        """Management command create_doctor safely creates and approves doctor accounts."""
        from django.core.management import call_command
        import io
        out = io.StringIO()
        call_command(
            'create_doctor',
            email='cli.doctor@ayurhospital.org',
            name='Dr. CLI Doctor',
            license='AYUSH-CLI-2026-7788',
            password='CliDoctorPassword2026!',
            approved=True,
            stdout=out
        )
        self.assertIn("Successfully created doctor account for 'Dr. CLI Doctor'", out.getvalue())
        user = User.objects.get(email='cli.doctor@ayurhospital.org')
        self.assertEqual(user.role, User.Role.DOCTOR)
        self.assertTrue(user.doctor_profile.is_approved())

        # Test login via clinical license
        response = self.client.post('/api/auth/doctor-login/', {
            'username': 'AYUSH-CLI-2026-7788',
            'password': 'CliDoctorPassword2026!'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['email'], 'cli.doctor@ayurhospital.org')
