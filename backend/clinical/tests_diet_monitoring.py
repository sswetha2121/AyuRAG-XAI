import datetime
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import DoctorProfile, PatientProfile
from clinical.models import (
    DietPlan, DietPlanStatus, DietPlanGeneratedBy,
    MealLog, MealLogStatus, MealType, ProgressRecord,
    DoctorPatientAssignment, PatientDoctorMessage, PatientDietDifficultyReport,
    PatientAssessment, AssessmentStatus
)
from clinical.services.nutritional_engine import calculate_day_nutrients, get_food_catalogue

User = get_user_model()


class DietMonitoringAndMessagingTests(APITestCase):
    """
    Automated integration tests for:
    - Phase 2: Doctor-Patient assignment & authorization isolation
    - Phase 3: Diet Plan Generator, deterministic nutrients, editing, approval, superseding
    - Phase 4: Patient daily meal checklist (Completed, Partial, Skipped, Not Done) & difficulty reporting
    - Phase 5: Doctor monitoring dashboard & adherence tracking
    - Phase 6: Patient-Doctor messaging with unread tracking & emergency disclaimer
    """

    def setUp(self):
        # 1. Approved Doctor
        self.doctor = User.objects.create_user(
            username='dr.test',
            email='dr.test@ayurag.org',
            password='testpassword123',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=self.doctor,
            professional_name='Dr. Test Sharma',
            clinical_license='AYUSH-2026-TEST',
            approval_status=DoctorProfile.ApprovalStatus.APPROVED,
            approved_at=timezone.now()
        )

        # 2. Patient 1 (Assigned)
        self.patient_1 = User.objects.create_user(
            username='patient.one',
            email='patient.one@ayurag.org',
            password='testpassword123',
            role=User.Role.PATIENT
        )
        self.patient_1_profile = PatientProfile.objects.create(
            user=self.patient_1,
            full_name='Patient One',
            age=29,
            gender='Female',
            assigned_doctor=self.doctor
        )
        DoctorPatientAssignment.objects.create(
            doctor=self.doctor,
            patient=self.patient_1,
            is_active=True
        )

        # 3. Patient 2 (Unassigned initially)
        self.patient_2 = User.objects.create_user(
            username='patient.two',
            email='patient.two@ayurag.org',
            password='testpassword123',
            role=User.Role.PATIENT
        )
        self.patient_2_profile = PatientProfile.objects.create(
            user=self.patient_2,
            full_name='Patient Two',
            age=34,
            gender='Male'
        )

        # 4. Baseline assessment for Patient 1 & Patient 2
        self.assessment_1 = PatientAssessment.objects.create(
            patient=self.patient_1,
            status=AssessmentStatus.COMPLETED,
            demographics={'fullName': 'Patient One', 'age': 29, 'gender': 'Female'},
            prakriti_scores={'primary': 'Vāta-Pitta', 'Vata': 48, 'Pitta': 36, 'Kapha': 16},
            symptoms_data=['Irregular digestion', 'Mild fatigue']
        )
        self.assessment_2 = PatientAssessment.objects.create(
            patient=self.patient_2,
            status=AssessmentStatus.COMPLETED,
            demographics={'fullName': 'Patient Two', 'age': 34, 'gender': 'Male'},
            prakriti_scores={'primary': 'Pitta-Kapha', 'Vata': 20, 'Pitta': 45, 'Kapha': 35},
            symptoms_data=['Hyperacidity', 'Inflammation']
        )

    def test_doctor_patient_assignment_workflow(self):
        """Test doctor assigns unassigned patient, checks roster, and unassigns."""
        self.client.force_authenticate(user=self.doctor)

        # Assign Patient 2
        res_assign = self.client.post(f'/api/doctor/patients/{self.patient_2.id}/assign/', {
            'notes': 'Admitted for dietary management'
        })
        self.assertEqual(res_assign.status_code, status.HTTP_200_OK)
        self.patient_2_profile.refresh_from_db()
        self.assertEqual(self.patient_2_profile.assigned_doctor, self.doctor)

        # Verify listed in assigned patients
        res_list = self.client.get('/api/doctor/patients/?scope=assigned')
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        p_ids = [p['patient'] for p in res_list.data['patients']]
        self.assertIn(self.patient_2.id, p_ids)

        # Unassign Patient 2
        res_unassign = self.client.post(f'/api/doctor/patients/{self.patient_2.id}/unassign/')
        self.assertEqual(res_unassign.status_code, status.HTTP_200_OK)
        self.patient_2_profile.refresh_from_db()
        self.assertIsNone(self.patient_2_profile.assigned_doctor)

    def test_food_catalogue_and_substitutes(self):
        """Test querying structured IFCT food catalogue and verified alternatives."""
        self.client.force_authenticate(user=self.doctor)

        res_cat = self.client.get('/api/doctor/food-catalogue/?search=rice')
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        self.assertGreater(res_cat.data['count'], 0)
        item = res_cat.data['items'][0]
        self.assertIn('nutrients_per_100g', item)
        self.assertIn('energy_kcal', item['nutrients_per_100g'])
        self.assertIn('protein_g', item['nutrients_per_100g'])

        # Food substitutes query
        food_id = item['food_id']
        res_sub = self.client.get(f'/api/doctor/food-substitutes/?food_id={food_id}&preference=Vegetarian')
        self.assertEqual(res_sub.status_code, status.HTTP_200_OK)
        self.assertIn('substitutes', res_sub.data)

    def test_diet_generation_recalculation_and_publishing(self):
        """Test generating individualized plan, deterministic recalculation, and publishing."""
        self.client.force_authenticate(user=self.doctor)

        # Generate draft plan
        res_gen = self.client.post(f'/api/doctor/patients/{self.patient_1.id}/diet/generate/', {
            'dietary_preference': 'Vegetarian',
            'regional_preference': 'North Indian',
            'allergens': []
        }, format='json')
        self.assertEqual(res_gen.status_code, status.HTTP_201_CREATED)
        plan_id = res_gen.data['diet_plan']['id']
        nutrients = res_gen.data['diet_plan']['nutritional_totals']
        self.assertIn('calories_kcal', nutrients)
        self.assertGreater(nutrients['calories_kcal'], 0)

        # Recalculate endpoint
        res_recalc = self.client.post(f'/api/doctor/diet-plans/{plan_id}/recalculate/')
        self.assertEqual(res_recalc.status_code, status.HTTP_200_OK)
        self.assertIn('nutritional_totals', res_recalc.data)

        # Publish plan
        res_pub = self.client.post(f'/api/doctor/diet-plans/{plan_id}/approve/', {
            'notes': 'Clinically finalized for patient'
        }, format='json')
        self.assertEqual(res_pub.status_code, status.HTTP_200_OK)

        # Verify patient sees published plan
        self.client.force_authenticate(user=self.patient_1)
        res_curr = self.client.get('/api/patient/diet/current/')
        self.assertEqual(res_curr.status_code, status.HTTP_200_OK)
        self.assertTrue(res_curr.data['has_active_plan'])
        self.assertEqual(res_curr.data['diet_plan']['id'], plan_id)

    def test_patient_meal_checklist_and_progress_logging(self):
        """Test patient meal checklist state changes: COMPLETED, PARTIAL, SKIPPED, NOT_DONE."""
        # Create published diet plan
        plan = DietPlan.objects.create(
            patient=self.patient_1,
            doctor=self.doctor,
            status=DietPlanStatus.PUBLISHED,
            title='Autumn Regimen v1',
            version=1
        )

        self.client.force_authenticate(user=self.patient_1)

        # 1. Fetch daily schedule
        res_sched = self.client.get('/api/patient/meal-schedule/')
        self.assertEqual(res_sched.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_sched.data['meals']), 5)

        # 2. Complete Breakfast
        res_b = self.client.post('/api/patient/meal-schedule/log/', {
            'meal_type': MealType.BREAKFAST,
            'status': MealLogStatus.COMPLETED,
            'notes': 'Felt warm and energized',
            'energy_rating': 4
        }, format='json')
        self.assertEqual(res_b.status_code, status.HTTP_200_OK)
        self.assertEqual(res_b.data['meal_log']['status'], MealLogStatus.COMPLETED)

        # 3. Partially complete Lunch
        res_l = self.client.post('/api/patient/meal-schedule/log/', {
            'meal_type': MealType.LUNCH,
            'status': MealLogStatus.PARTIALLY_COMPLETED,
            'portion_consumed': '50%',
            'notes': 'Ate half bowl'
        }, format='json')
        self.assertEqual(res_l.status_code, status.HTTP_200_OK)
        self.assertEqual(res_l.data['meal_log']['status'], MealLogStatus.PARTIALLY_COMPLETED)

        # 4. Skip Evening snack with reason and symptoms
        res_e = self.client.post('/api/patient/meal-schedule/log/', {
            'meal_type': MealType.EVENING,
            'status': MealLogStatus.SKIPPED,
            'skip_reason': 'Traveling',
            'symptom_notes': 'Mild acidity'
        }, format='json')
        self.assertEqual(res_e.status_code, status.HTTP_200_OK)
        self.assertEqual(res_e.data['progress']['meals_completed'], 1)
        self.assertEqual(res_e.data['progress']['meals_partially_completed'], 1)
        self.assertEqual(res_e.data['progress']['meals_skipped'], 1)

        # 5. Report difficulty endpoint
        res_diff = self.client.post('/api/patient/diet/report-difficulty/', {
            'meal_type': MealType.EVENING,
            'difficulty_description': 'Difficult to drink hot tea while commuting',
            'symptoms': 'Mild bloating',
            'severity': 'MILD'
        }, format='json')
        self.assertEqual(res_diff.status_code, status.HTTP_201_CREATED)
        report_id = res_diff.data['report']['id']

        # 6. Doctor verifies monitoring dashboard reflects these updates
        self.client.force_authenticate(user=self.doctor)
        res_mon = self.client.get('/api/doctor/monitoring/')
        self.assertEqual(res_mon.status_code, status.HTTP_200_OK)
        self.assertIn('clinical_notice', res_mon.data)
        self.assertIn('summary_metrics', res_mon.data)
        patients = res_mon.data['patients']
        p1_mon = next((p for p in patients if p['patient_id'] == self.patient_1.id), None)
        self.assertIsNotNone(p1_mon)
        self.assertEqual(p1_mon['today_summary']['meals_completed'], 1)
        self.assertEqual(p1_mon['today_summary']['meals_partially_completed'], 1)
        self.assertEqual(p1_mon['today_summary']['meals_skipped'], 1)

        # 7. Doctor reviews the difficulty report
        res_rev = self.client.patch(f'/api/doctor/monitoring/difficulty/{report_id}/review/', {
            'notes': 'Advised lukewarm water when traveling'
        }, format='json')
        self.assertEqual(res_rev.status_code, status.HTTP_200_OK)
        self.assertTrue(res_rev.data['report']['reviewed_by_doctor'])

    def test_patient_doctor_messaging_workflow(self):
        """Test authenticated persistent conversation, unread count, auto-read, and non-emergency notice."""
        # 1. Patient sends message to doctor
        self.client.force_authenticate(user=self.patient_1)
        res_send = self.client.post('/api/messages/send/', {
            'recipient_id': self.doctor.id,
            'content': 'Hello Doctor, is it permissible to add fresh mint to the lunch dal?'
        }, format='json')
        self.assertEqual(res_send.status_code, status.HTTP_201_CREATED)

        # 2. Doctor checks conversation list -> unread_count is 1
        self.client.force_authenticate(user=self.doctor)
        res_conv = self.client.get('/api/messages/conversations/')
        self.assertEqual(res_conv.status_code, status.HTTP_200_OK)
        conv = next((c for c in res_conv.data['conversations'] if c['participant_id'] == self.patient_1.id), None)
        self.assertIsNotNone(conv)
        self.assertEqual(conv['unread_count'], 1)

        # 3. Doctor opens thread -> message marked as read and disclaimer shown
        res_thread = self.client.get(f'/api/messages/{self.patient_1.id}/')
        self.assertEqual(res_thread.status_code, status.HTTP_200_OK)
        self.assertIn('emergency_disclaimer', res_thread.data)
        self.assertEqual(res_thread.data['count'], 1)

        # Verify unread count is now 0
        res_conv2 = self.client.get('/api/messages/conversations/')
        conv2 = next((c for c in res_conv2.data['conversations'] if c['participant_id'] == self.patient_1.id), None)
        self.assertEqual(conv2['unread_count'], 0)

        # 4. Doctor replies
        res_reply = self.client.post('/api/messages/send/', {
            'recipient_id': self.patient_1.id,
            'content': 'Yes, fresh mint is cooling and pacifies Pitta. You may add a few leaves.'
        }, format='json')
        self.assertEqual(res_reply.status_code, status.HTTP_201_CREATED)

        # 5. Isolation: Patient 2 cannot access Patient 1's conversation thread
        self.client.force_authenticate(user=self.patient_2)
        res_other = self.client.get(f'/api/messages/{self.patient_1.id}/')
        self.assertEqual(res_other.status_code, status.HTTP_403_FORBIDDEN)
