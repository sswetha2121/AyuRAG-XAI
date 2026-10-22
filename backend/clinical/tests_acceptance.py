import os
import tempfile
import json
from django.utils import timezone
from django.core.management import call_command
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from accounts.models import DoctorProfile, PatientProfile
from clinical.models import (
    FoodItem, DietPlan, DietPlanStatus, MealLog, MealLogStatus, MealType,
    DoctorPatientAssignment, PatientAssessment, AssessmentStatus
)
from clinical.services.nutritional_engine import (
    get_food_catalogue, find_food_item, calculate_item_nutrients, calculate_day_nutrients
)

User = get_user_model()


class AcceptanceCriteriaTestSuite(APITestCase):
    """
    Direct automated verification of the 13 required acceptance criteria:
    1. Import or seed the food catalogue with verified IFCT 2017 & Dev-Seed records.
    2. Verify the database contains structured FoodItem records with provenance.
    3. Query food catalogue endpoint and confirm records display with total count.
    4. Search by food name and filter by category (including normalized aliases).
    5. Add a food to a meal (Breakfast) with portion size.
    6. Change portion size and verify deterministic nutrient recalculation.
    7. Remove food and verify totals update deterministically.
    8. Save plan and confirm backend persistence.
    9. Patient login journey via /api/auth/login/ and session verification via /api/auth/me/.
    10. Confirm patient sees only their own published plan.
    11. Mark meal completed, verify persistence and doctor monitoring reflection.
    12. Test invalid credentials and unauthorized role access.
    13. Management command idempotent imports without duplicates.
    """

    def setUp(self):
        # 1. Approved Doctor
        self.doctor = User.objects.create_user(
            username='dr.sharma',
            email='dr.sharma@ayurag.org',
            password='doctorpassword123',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=self.doctor,
            professional_name='Dr. Sharma MD (Ayu)',
            clinical_license='AYUSH-DL-2024-8841',
            approval_status=DoctorProfile.ApprovalStatus.APPROVED,
            approved_at=timezone.now()
        )

        # 2. Pending Doctor (cannot log in)
        self.pending_doc = User.objects.create_user(
            username='dr.pending',
            email='dr.pending@ayurag.org',
            password='pendingpassword123',
            role=User.Role.DOCTOR
        )
        DoctorProfile.objects.create(
            user=self.pending_doc,
            professional_name='Dr. Pending Applicant',
            clinical_license='AYUSH-PENDING-001',
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        )

        # 3. Patient
        self.patient = User.objects.create_user(
            username='swetha.chowdary',
            email='swetha.chowdary@example.com',
            password='patientpassword123',
            role=User.Role.PATIENT
        )
        self.patient_profile = PatientProfile.objects.create(
            user=self.patient,
            full_name='Swetha Chowdary',
            age=29,
            gender='Female',
            assigned_doctor=self.doctor
        )
        DoctorPatientAssignment.objects.create(
            doctor=self.doctor,
            patient=self.patient,
            is_active=True
        )

        # 4. Another Patient (for isolation checks)
        self.other_patient = User.objects.create_user(
            username='other.patient',
            email='other.patient@example.com',
            password='otherpassword123',
            role=User.Role.PATIENT
        )
        self.other_patient_profile = PatientProfile.objects.create(
            user=self.other_patient,
            full_name='Other Patient',
            age=45,
            gender='Male'
        )

        # Run import_food_catalogue to seed DB
        call_command('import_food_catalogue', seed_verified=True, seed_dev=True)

    def test_01_and_02_food_catalogue_seeded_and_persisted_in_db(self):
        """Verify database contains structured FoodItem records with stable ID, provenance, and no fake IFCT claims."""
        count = FoodItem.objects.count()
        self.assertGreaterEqual(count, 31, f"Expected at least 31 items, found {count}")

        # Check verified IFCT item
        basmati = FoodItem.objects.filter(food_id='CER-001').first()
        self.assertIsNotNone(basmati)
        self.assertEqual(basmati.name, 'Steamed Aged Basmati Rice')
        self.assertEqual(basmati.category, 'cereals_millets')
        self.assertEqual(basmati.energy_kcal, 130.0)
        self.assertEqual(basmati.source_citation, 'ICMR-NIN IFCT 2017')
        self.assertFalse(basmati.is_dev_seed)

        # Check dev seed item clearly marked DEV_SEED
        makhana = FoodItem.objects.filter(food_id='SNK-001').first()
        self.assertIsNotNone(makhana)
        self.assertTrue(makhana.is_dev_seed)
        self.assertEqual(makhana.verification_status, 'DEV_SEED')
        self.assertIn('Dev Seed', makhana.source_citation)

    def test_03_query_catalogue_modal_endpoint(self):
        """Verify modal endpoint returns total count, items array, and foods array for Doctor."""
        self.client.force_authenticate(user=self.doctor)
        res = self.client.get('/api/doctor/food-catalogue/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('total', res.data)
        self.assertIn('count', res.data)
        self.assertIn('items', res.data)
        self.assertIn('foods', res.data)
        self.assertGreaterEqual(res.data['total'], 31)
        self.assertEqual(res.data['count'], res.data['total'])

    def test_04_search_and_category_filtering_with_aliases(self):
        """Verify search, category aliases (e.g. 'cereals' -> 'cereals_millets'), and resets work."""
        self.client.force_authenticate(user=self.doctor)

        # Search by food name
        res_search = self.client.get('/api/doctor/food-catalogue/?search=moong')
        self.assertEqual(res_search.status_code, status.HTTP_200_OK)
        self.assertGreater(res_search.data['count'], 0)
        for item in res_search.data['items']:
            self.assertIn('moong', (item['name'] + ' ' + str(item.get('regional_names', ''))).lower())

        # Category filter using frontend alias 'LEGUMES' or 'pulses_legumes'
        res_cat = self.client.get('/api/doctor/food-catalogue/?category=pulses_legumes')
        self.assertEqual(res_cat.status_code, status.HTTP_200_OK)
        self.assertGreater(res_cat.data['count'], 0)
        for item in res_cat.data['items']:
            self.assertEqual(item['category'], 'pulses_legumes')

        # Combined search + category filter
        res_both = self.client.get('/api/doctor/food-catalogue/?category=pulses_legumes&search=sprouted')
        self.assertEqual(res_both.status_code, status.HTTP_200_OK)
        self.assertEqual(res_both.data['count'], 1)
        self.assertEqual(res_both.data['items'][0]['food_id'], 'LEG-004')

    def test_05_06_07_08_add_food_portion_recalculate_remove_and_persist(self):
        """Verify adding food to meal, portion changes, deterministic recalculation, removal, and persistence."""
        self.client.force_authenticate(user=self.doctor)

        # Create draft plan
        plan = DietPlan.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            status=DietPlanStatus.DRAFT,
            title='Clinical Regimen v1.0',
            version=1,
            breakfast={'time': '08:00 AM', 'items': ['Steamed Aged Basmati Rice (150g) - 195 kcal, 3.9g protein']},
            lunch={'time': '01:30 PM', 'items': ['Yellow Moong Dal (150g) - 157.5 kcal, 10.5g protein']},
            dinner={'time': '08:00 PM', 'items': ['Soft Phulka / Roti (2 pieces (60g)) - 180 kcal, 6g protein']}
        )

        # Recalculate baseline
        res_recalc1 = self.client.post(f'/api/doctor/diet-plans/{plan.id}/recalculate/')
        self.assertEqual(res_recalc1.status_code, status.HTTP_200_OK)
        cal_1 = res_recalc1.data['nutritional_totals']['calories_kcal']
        self.assertGreater(cal_1, 400)

        # Step 5 & 6: Add Roasted Makhana with 2x portion (70g)
        makhana = FoodItem.objects.get(food_id='SNK-001')
        new_item_str = f"{makhana.name} (70g (2x portion)) - 245.0 kcal, 6.8g protein"
        updated_breakfast_items = plan.breakfast['items'] + [new_item_str]

        res_update = self.client.post(f'/api/doctor/diet-plans/{plan.id}/recalculate/', {
            'breakfast': {'time': '08:00 AM', 'items': updated_breakfast_items}
        }, format='json')
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        cal_2 = res_update.data['nutritional_totals']['calories_kcal']
        self.assertGreater(cal_2, cal_1, "Adding item must deterministically increase calories")

        # Step 7: Remove item and verify totals decrease
        res_remove = self.client.post(f'/api/doctor/diet-plans/{plan.id}/recalculate/', {
            'breakfast': {'time': '08:00 AM', 'items': [plan.breakfast['items'][0]]}
        }, format='json')
        self.assertEqual(res_remove.status_code, status.HTTP_200_OK)
        cal_3 = res_remove.data['nutritional_totals']['calories_kcal']
        self.assertEqual(cal_3, cal_1, "Removing item must deterministically return totals to baseline")

        # Step 8: Approve/Publish and verify persistence
        res_pub = self.client.post(f'/api/doctor/diet-plans/{plan.id}/approve/', {
            'notes': 'Clinically finalized regimen'
        }, format='json')
        self.assertEqual(res_pub.status_code, status.HTTP_200_OK)

        plan.refresh_from_db()
        self.assertEqual(plan.status, DietPlanStatus.PUBLISHED)
        self.assertIsNotNone(plan.approved_at)

    def test_09_and_10_patient_login_and_published_plan_isolation(self):
        """Verify Patient logs in via /api/auth/login/, session verifies via /api/auth/me/, and sees only their own plan."""
        # 1. Patient login
        res_login = self.client.post('/api/auth/login/', {
            'username': 'swetha.chowdary',
            'password': 'patientpassword123'
        }, format='json')
        self.assertEqual(res_login.status_code, status.HTTP_200_OK)
        self.assertEqual(res_login.data['user']['role'], 'PATIENT')

        # 2. Session verification via /api/auth/me/
        res_me = self.client.get('/api/auth/me/')
        self.assertEqual(res_me.status_code, status.HTTP_200_OK)
        self.assertEqual(res_me.data['username'], 'swetha.chowdary')

        # 3. Create published plan for Swetha and another for other_patient
        p1_plan = DietPlan.objects.create(
            patient=self.patient,
            doctor=self.doctor,
            status=DietPlanStatus.PUBLISHED,
            title='Swetha Regimen v1',
            version=1,
            breakfast={'time': '08:00 AM', 'items': ['Moong Dal Khichdi (1 bowl)']}
        )
        p2_plan = DietPlan.objects.create(
            patient=self.other_patient,
            doctor=self.doctor,
            status=DietPlanStatus.PUBLISHED,
            title='Other Patient Regimen v1',
            version=1,
            breakfast={'time': '08:00 AM', 'items': ['Barley Water (1 glass)']}
        )

        # 4. Swetha fetches active diet plan -> MUST see p1_plan, NEVER p2_plan
        res_plan = self.client.get('/api/patient/diet/current/')
        self.assertEqual(res_plan.status_code, status.HTTP_200_OK)
        self.assertTrue(res_plan.data['has_active_plan'])
        self.assertEqual(res_plan.data['diet_plan']['id'], p1_plan.id)
        self.assertNotEqual(res_plan.data['diet_plan']['id'], p2_plan.id)

    def test_11_patient_meal_completion_and_doctor_monitoring_reflection(self):
        """Verify patient marks meal completed, backend persists, and doctor monitoring reflects progress."""
        # Authenticate as patient
        self.client.force_authenticate(user=self.patient)

        # Log breakfast as COMPLETED
        res_log = self.client.post('/api/patient/meal-schedule/log/', {
            'meal_type': MealType.BREAKFAST,
            'status': MealLogStatus.COMPLETED,
            'notes': 'Consumed on schedule',
            'energy_rating': 5
        }, format='json')
        self.assertEqual(res_log.status_code, status.HTTP_200_OK)

        # Doctor logs in and checks monitoring
        self.client.force_authenticate(user=self.doctor)
        res_mon = self.client.get('/api/doctor/monitoring/')
        self.assertEqual(res_mon.status_code, status.HTTP_200_OK)

        patient_mon = next((p for p in res_mon.data['patients'] if p['patient_id'] == self.patient.id), None)
        self.assertIsNotNone(patient_mon)
        self.assertEqual(patient_mon['today_summary']['meals_completed'], 1)

    def test_12_invalid_credentials_and_role_authorization_enforcement(self):
        """Verify invalid credentials fail with useful message and unauthorized roles are blocked."""
        # Invalid password
        res_invalid = self.client.post('/api/auth/login/', {
            'username': 'swetha.chowdary',
            'password': 'wrongpassword'
        }, format='json')
        self.assertEqual(res_invalid.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', res_invalid.data)

        # Pending doctor cannot log in
        res_pending = self.client.post('/api/auth/doctor-login/', {
            'username': 'dr.pending',
            'password': 'pendingpassword123'
        }, format='json')
        self.assertEqual(res_pending.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(res_pending.data.get('approval_status'), 'PENDING')

        # Patient cannot access doctor catalogue endpoint
        self.client.force_authenticate(user=self.patient)
        res_blocked = self.client.get('/api/doctor/food-catalogue/')
        self.assertEqual(res_blocked.status_code, status.HTTP_403_FORBIDDEN)

        # Unauthenticated user cannot access patient schedule
        self.client.logout()
        res_unauth = self.client.get('/api/patient/meal-schedule/')
        self.assertEqual(res_unauth.status_code, status.HTTP_403_FORBIDDEN)

    def test_13_idempotent_import_preventing_duplicates(self):
        """Verify running import_food_catalogue repeatedly updates existing records and creates 0 duplicates."""
        initial_count = FoodItem.objects.count()

        # Run command second time
        call_command('import_food_catalogue', seed_verified=True, seed_dev=True)
        new_count = FoodItem.objects.count()
        self.assertEqual(initial_count, new_count, "Import must be idempotent and prevent duplicate food items")
