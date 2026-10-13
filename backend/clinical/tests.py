from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, PatientProfile, DoctorProfile
from clinical.models import (
    PatientAssessment,
    ClinicalReview,
    AssessmentStatus,
    ReviewStatus
)


class ClinicalWorkflowsAndDataIsolationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Patient 1
        self.patient_1 = User.objects.create_user(
            username='patient1',
            email='patient1@test.com',
            password='Password123!',
            role=User.Role.PATIENT
        )
        self.profile_1 = PatientProfile.objects.create(
            user=self.patient_1,
            full_name='Patient One',
            age=30,
            gender='male'
        )

        # Patient 2
        self.patient_2 = User.objects.create_user(
            username='patient2',
            email='patient2@test.com',
            password='Password123!',
            role=User.Role.PATIENT
        )
        self.profile_2 = PatientProfile.objects.create(
            user=self.patient_2,
            full_name='Patient Two',
            age=45,
            gender='female'
        )

        # Doctor
        self.doctor = User.objects.create_user(
            username='dr.test',
            email='doctor@test.com',
            password='DoctorPassword123!',
            role=User.Role.DOCTOR
        )
        self.doctor_profile = DoctorProfile.objects.create(
            user=self.doctor,
            professional_name='Dr. Test',
            qualification='MD Ayurveda'
        )

        # Existing assessment for Patient 1
        self.assessment_1 = PatientAssessment.objects.create(
            patient=self.patient_1,
            status=AssessmentStatus.COMPLETED,
            demographics={'fullName': 'Patient One', 'age': 30},
            prakriti_scores={'vata': 40, 'pitta': 35, 'kapha': 25, 'primary': 'Vata-Pitta'},
            ai_analysis={'prediction': 'Vata-Pitta Assessment', 'confidence': 0.89}
        )

    def test_unauthenticated_cannot_submit_assessment(self):
        """Unauthenticated requests cannot submit clinical assessments."""
        response = self.client.post('/api/patient/assessment/submit/', {
            'demographics': {'fullName': 'Hacker'}
        }, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_patient_can_submit_assessment(self):
        """Authenticated patient submits assessment and it is strictly bound to them."""
        self.client.force_authenticate(user=self.patient_2)
        payload = {
            'demographics': {'fullName': 'Patient Two', 'age': 45},
            'prakriti_data': {'q1': 'opt1'},
            'lifestyle_data': {},
            'diet_data': {},
            'symptoms_data': {},
            'prakriti_scores': {'vata': 30, 'pitta': 45, 'kapha': 25, 'primary': 'Pitta-Vata'},
            'ai_analysis': {'prediction': 'Pitta-Vata', 'confidence': 0.91}
        }
        response = self.client.post('/api/patient/assessment/submit/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('assessment_id', response.data)
        assessment_id = response.data.get('assessment_id')
        created = PatientAssessment.objects.get(id=assessment_id)
        self.assertEqual(created.patient, self.patient_2)

    def test_prevention_of_duplicate_submissions_idempotent(self):
        """Resubmitting with an existing assessment_id updates the record rather than duplicating it."""
        self.client.force_authenticate(user=self.patient_1)
        initial_count = PatientAssessment.objects.filter(patient=self.patient_1).count()
        payload = {
            'assessment_id': self.assessment_1.id,
            'demographics': {'fullName': 'Patient One Updated', 'age': 31},
            'prakriti_scores': {'vata': 42, 'pitta': 34, 'kapha': 24, 'primary': 'Vata-Pitta'}
        }
        response = self.client.post('/api/patient/assessment/submit/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('assessment_id'), self.assessment_1.id)
        final_count = PatientAssessment.objects.filter(patient=self.patient_1).count()
        self.assertEqual(initial_count, final_count)
        self.assessment_1.refresh_from_db()
        self.assertEqual(self.assessment_1.demographics.get('fullName'), 'Patient One Updated')

    def test_patient_record_isolation(self):
        """Patient 2 cannot access Patient 1's assessment record."""
        self.client.force_authenticate(user=self.patient_2)
        # Patient 2 checks latest assessment - should NOT return Patient 1's assessment
        response = self.client.get('/api/patient/assessment/latest/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data.get('has_assessment'))
        self.assertIsNone(response.data.get('assessment'))

    def test_patient_history_isolation(self):
        """Patient history returns only records belonging to the requesting user."""
        self.client.force_authenticate(user=self.patient_1)
        response = self.client.get('/api/patient/assessment/history/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('assessments', [])), 1)

        self.client.force_authenticate(user=self.patient_2)
        response = self.client.get('/api/patient/assessment/history/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data.get('assessments', [])), 0)

    def test_doctor_can_view_patient_directory_and_detail(self):
        """Authorized doctor can view patients list and specific patient assessment."""
        self.client.force_authenticate(user=self.doctor)
        response = self.client.get('/api/doctor/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

        response = self.client.get(f'/api/doctor/patients/{self.assessment_1.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get('patient_name'), 'Patient One')

    def test_doctor_review_creation_and_update(self):
        """Doctor can create and update clinical review for a patient assessment."""
        self.client.force_authenticate(user=self.doctor)
        payload = {
            'assessment_id': self.assessment_1.id,
            'status': 'IN_REVIEW',
            'summary': 'Baseline constitutional assessment consistent with Vata vitiation.',
            'observations': 'Digestive agni irregular.',
            'recommendations': 'Prescribe warm digestive herbs and ushnodaka.'
        }
        response = self.client.post('/api/doctor/reviews/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        review_id = response.data.get('id')
        self.assertTrue(ClinicalReview.objects.filter(id=review_id).exists())

        # Update the existing review
        update_payload = {
            'status': 'COMPLETED',
            'summary': 'Signed off by attending physician.'
        }
        put_response = self.client.put(f'/api/doctor/reviews/{review_id}/', update_payload, format='json')
        self.assertEqual(put_response.status_code, status.HTTP_200_OK)
        self.assertEqual(put_response.data.get('status'), 'COMPLETED')

    def test_ai_inference_endpoint(self):
        """AI inference returns complete structured tridosha analysis without masquerading."""
        self.client.force_authenticate(user=self.patient_1)
        payload = {
            'demographics': {'age': 30, 'gender': 'male'},
            'prakriti_data': {'prakriti_q1': 'opt_1_1'},
            'lifestyle_data': {},
            'diet_data': {},
            'symptoms_data': {}
        }
        response = self.client.post('/api/clinical/ai/infer/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tridoshaProfile', response.data)
        self.assertIn('aiMetrics', response.data)
        self.assertIn('xaiFeatures', response.data)
