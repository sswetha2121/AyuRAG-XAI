from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from accounts.models import User, PatientProfile, DoctorProfile
from clinical.models import (
    PatientAssessment,
    ClinicalReview,
    AssessmentStatus,
    ReviewStatus,
    DietPlan,
    DietPlanStatus,
    Notification,
    MealLog,
    ProgressRecord
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
            qualification='MD Ayurveda',
            approval_status=DoctorProfile.ApprovalStatus.APPROVED
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
        self.assertTrue(response.data['aiMetrics'].get('is_rule_based'))

    def test_cross_patient_cannot_modify_other_assessment(self):
        """Patient 2 cannot overwrite Patient 1's assessment by passing Patient 1's assessment_id."""
        self.client.force_authenticate(user=self.patient_2)
        payload = {
            'assessment_id': self.assessment_1.id,
            'demographics': {'fullName': 'Hacked Name', 'age': 99},
            'prakriti_scores': {'vata': 50, 'pitta': 30, 'kapha': 20, 'primary': 'Vata'}
        }
        response = self.client.post('/api/patient/assessment/submit/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # Ensure Patient 1's assessment is completely unchanged
        self.assessment_1.refresh_from_db()
        self.assertEqual(self.assessment_1.demographics.get('fullName'), 'Patient One')
        self.assertEqual(self.assessment_1.patient, self.patient_1)

    def test_rag_evidence_retrieval_and_empty_retrieval(self):
        """Authentic classical shlokas are retrieved for matching parameters, and empty list for unmatched without fabricating citations."""
        from clinical.services.rag_service import retrieve_relevant_knowledge

        # Matching query
        matched = retrieve_relevant_knowledge(prakriti='Vata-Pitta', symptoms=['gas_bloating', 'insomnia'])
        self.assertGreater(len(matched), 0)
        self.assertTrue(all(item.get('verified_classical_compendium') for item in matched))
        self.assertIn('Charaka Saṃhitā', matched[0]['source'])

        # Empty / non-matching query should return empty list (no fabricated citations)
        unmatched = retrieve_relevant_knowledge(prakriti='nonexistent_dosha_12345', symptoms=['unknown_symptom_xyz'])
        self.assertEqual(unmatched, [])

    def test_dynamic_rule_attribution_schema(self):
        """Rule attributions dynamically derive from actual answered questions."""
        from clinical.services.ai_model_service import AyuRagAiModelService

        # Response with lean build and variable hunger (Vata indicators)
        vata_payload = {
            'prakriti_data': {'prakriti_q1': 'opt_1_1', 'prakriti_q4': 'opt_4_1'},
            'lifestyle_data': {},
            'diet_data': {'diet_q1_meal_regularity': 'erratic'},
            'symptoms_data': {'selectedSymptoms': ['gas_bloating']}
        }
        res = AyuRagAiModelService.run_inference(vata_payload)
        features = res['xaiFeatures']
        self.assertGreaterEqual(len(features), 3)

        # Confirm direction and percentage fields exist
        pos_features = [f for f in features if f['direction'] == 'positive']
        self.assertGreater(len(pos_features), 0)
        self.assertIn('contributionPct', pos_features[0])
        self.assertIn('rule_triggered', pos_features[0])

    def test_doctor_diet_generation_and_approval_flow(self):
        """Doctor generates, edits, and approves a diet plan, which creates patient notification and active plan."""
        self.client.force_authenticate(user=self.doctor)

        # 1. Generate Diet Plan Draft
        gen_res = self.client.post(f'/api/doctor/patients/{self.patient_1.id}/diet/generate/')
        self.assertEqual(gen_res.status_code, status.HTTP_201_CREATED)
        plan_id = gen_res.data['diet_plan']['id']

        # 2. Approve Diet Plan
        approve_res = self.client.post(f'/api/doctor/diet-plans/{plan_id}/approve/', {
            'notes': 'Clinically validated for autumn regimen.'
        }, format='json')
        self.assertEqual(approve_res.status_code, status.HTTP_200_OK)
        self.assertEqual(approve_res.data['diet_plan']['status'], 'ACTIVE')

        # 3. Patient receives notification
        notif = Notification.objects.filter(user=self.patient_1, type='DIET_PLAN_APPROVED').first()
        self.assertIsNotNone(notif)
        self.assertIn('approved', notif.title.lower())

        # 4. Patient can retrieve active diet plan
        self.client.force_authenticate(user=self.patient_1)
        diet_res = self.client.get('/api/patient/diet/current/')
        self.assertEqual(diet_res.status_code, status.HTTP_200_OK)
        self.assertTrue(diet_res.data['has_active_plan'])
        self.assertEqual(diet_res.data['diet_plan']['id'], plan_id)

    def test_patient_cannot_approve_diet_plan(self):
        """Patient cannot approve their own or any other diet plan (Doctor role required)."""
        # Create draft plan
        plan = DietPlan.objects.create(
            patient=self.patient_1,
            status=DietPlanStatus.DRAFT,
            title='Draft Plan'
        )
        self.client.force_authenticate(user=self.patient_1)
        response = self.client.post(f'/api/doctor/diet-plans/{plan.id}/approve/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        plan.refresh_from_db()
        self.assertEqual(plan.status, DietPlanStatus.DRAFT)

    def test_patient_meal_logging_and_progress_tracking(self):
        """Patient can log meals and hydration, and view aggregated adherence progress."""
        self.client.force_authenticate(user=self.patient_1)

        # Log a meal
        meal_res = self.client.post('/api/patient/meal-schedule/log/', {
            'meal_type': 'BREAKFAST',
            'status': 'COMPLETED',
            'meal_name': 'Warm Oats with Almonds',
            'notes': 'Felt energetic'
        }, format='json')
        self.assertEqual(meal_res.status_code, status.HTTP_200_OK)
        self.assertEqual(meal_res.data['meal_log']['status'], 'COMPLETED')

        # Log water
        water_res = self.client.post('/api/patient/water/log/', {
            'amount_ml': 500,
            'action': 'add'
        }, format='json')
        self.assertEqual(water_res.status_code, status.HTTP_200_OK)
        self.assertEqual(water_res.data['water_intake_ml'], 500)

        # Check progress
        progress_res = self.client.get('/api/patient/progress/')
        self.assertEqual(progress_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(progress_res.data.get('total_meals_completed', 0), 1)

    def test_notification_list_and_mark_read(self):
        """Patient can list their notifications and mark them as read."""
        notif = Notification.objects.create(
            user=self.patient_1,
            title='Test Alert',
            message='Your health update is ready.'
        )
        self.client.force_authenticate(user=self.patient_1)
        list_res = self.client.get('/api/notifications/')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(list_res.data.get('notifications', [])), 1)

        # Mark read
        read_res = self.client.patch(f'/api/notifications/{notif.id}/read/')
        self.assertEqual(read_res.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)


    def test_scenario_a_patient_full_lifecycle(self):
        """
        Scenario A (Patient): Complete assessment submission -> backend rule inference ->
        persisted results -> retrieval upon page refresh matches DB source of truth.
        """
        self.client.force_authenticate(user=self.patient_2)
        payload = {
            'demographics': {
                'fullName': 'Patient Two',
                'age': 32,
                'gender': 'female',
                'height': '165 cm',
                'weight': '58 kg'
            },
            'prakriti_data': {
                'prakriti_q1': 'opt_1_2', # Athletic (Pitta)
                'prakriti_q2': 'opt_2_2', # Warm skin (Pitta)
                'prakriti_q4': 'opt_4_2', # Sharp appetite (Pitta)
                'prakriti_q5': 'opt_5_2'  # Rapid digestion (Pitta)
            },
            'lifestyle_data': {},
            'diet_data': {},
            'symptoms_data': {'selectedSymptoms': ['hyperacidity']}
        }
        submit_res = self.client.post('/api/patient/assessment/submit/', payload, format='json')
        self.assertEqual(submit_res.status_code, status.HTTP_201_CREATED)
        asm_id = submit_res.data['assessment_id']
        self.assertIsNotNone(asm_id)

        asm_data = submit_res.data['assessment']
        self.assertEqual(asm_data['status'], AssessmentStatus.COMPLETED)
        scores = asm_data['prakriti_scores']
        self.assertIn('pitta', scores.get('breakdown', {}))
        self.assertGreater(scores['breakdown']['pitta'], scores['breakdown']['vata'])

        # Total dosha percentages strictly sum to 100
        total_dosha = scores['breakdown']['vata'] + scores['breakdown']['pitta'] + scores['breakdown']['kapha']
        self.assertEqual(total_dosha, 100)

        # Citations are classical
        self.assertGreater(len(asm_data['rag_evidence']), 0)
        self.assertIn('Saṃhitā', asm_data['rag_evidence'][0]['source'])

        # Retrieval upon page refresh
        latest_res = self.client.get('/api/patient/assessment/latest/')
        self.assertEqual(latest_res.status_code, status.HTTP_200_OK)
        self.assertTrue(latest_res.data['has_assessment'])
        self.assertEqual(latest_res.data['assessment']['id'], asm_id)
        self.assertEqual(latest_res.data['assessment']['prakriti_scores']['primary'], scores['primary'])

        # Direct detail retrieval
        detail_res = self.client.get(f'/api/patient/assessment/{asm_id}/')
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_res.data['id'], asm_id)

    def test_scenario_b_inference_failure_retention_and_safe_retry(self):
        """
        Scenario B (Failure Recovery): If inference fails, assessment is preserved (status IN_PROGRESS, 202).
        A subsequent retry idempotently updates the same assessment without creating a duplicate.
        """
        from unittest.mock import patch
        from clinical.services.ai_model_service import AyuRagAiModelService

        self.client.force_authenticate(user=self.patient_2)
        payload = {
            'demographics': {'fullName': 'Patient Two', 'age': 45},
            'prakriti_data': {'prakriti_q1': 'opt_1_1'},
            'lifestyle_data': {},
            'diet_data': {},
            'symptoms_data': {}
        }

        # 1. Simulate inference failure during submission
        with patch.object(AyuRagAiModelService, 'run_inference', side_effect=RuntimeError("AI Engine Timeout")):
            submit_res = self.client.post('/api/patient/assessment/submit/', payload, format='json')

        self.assertEqual(submit_res.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(submit_res.data['status'], 'INFERENCE_FAILED')
        self.assertTrue(submit_res.data['can_retry'])
        asm_id = submit_res.data['assessment_id']

        # Assessment is retained in DB
        asm = PatientAssessment.objects.get(id=asm_id)
        self.assertEqual(asm.status, AssessmentStatus.IN_PROGRESS)
        self.assertEqual(asm.ai_analysis.get('inference_status'), 'FAILED')

        initial_count = PatientAssessment.objects.filter(patient=self.patient_2).count()

        # 2. Safe idempotent retry
        retry_res = self.client.post(f'/api/patient/assessment/{asm_id}/retry-analysis/')
        self.assertEqual(retry_res.status_code, status.HTTP_200_OK)
        self.assertEqual(retry_res.data['assessment_id'], asm_id)

        # Assessment is now completed
        asm.refresh_from_db()
        self.assertEqual(asm.status, AssessmentStatus.COMPLETED)
        self.assertIn('tridoshaProfile', asm.ai_analysis)

        # Count did not increase (no duplicate created)
        final_count = PatientAssessment.objects.filter(patient=self.patient_2).count()
        self.assertEqual(initial_count, final_count)

    def test_scenario_c_doctor_review_and_patient_notification(self):
        """
        Scenario C (Doctor Review): Doctor reviews assessment, completes review,
        assessment becomes VALIDATED, and patient receives notification.
        Reverting a COMPLETED review to PENDING is rejected.
        """
        self.client.force_authenticate(user=self.doctor)

        # Create review in progress
        res1 = self.client.post('/api/doctor/reviews/', {
            'assessment_id': self.assessment_1.id,
            'status': ReviewStatus.IN_REVIEW,
            'summary': 'Clinical verification underway.'
        }, format='json')
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        review_id = res1.data['id']

        # Complete review
        res2 = self.client.patch(f'/api/doctor/reviews/{review_id}/', {
            'status': ReviewStatus.COMPLETED,
            'summary': 'Constitutional protocol clinically validated and approved.'
        }, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)

        # Assessment status updated to VALIDATED
        self.assessment_1.refresh_from_db()
        self.assertEqual(self.assessment_1.status, AssessmentStatus.VALIDATED)

        # Patient notification created
        notif = Notification.objects.filter(
            user=self.patient_1,
            type='CLINICAL_REVIEW_COMPLETED'
        ).first()
        self.assertIsNotNone(notif)
        self.assertIn('validated', notif.title.lower())

        # Invalid transition: Reverting COMPLETED to PENDING is rejected
        res3 = self.client.patch(f'/api/doctor/reviews/{review_id}/', {
            'status': ReviewStatus.PENDING
        }, format='json')
        self.assertEqual(res3.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid state transition', res3.data['error'])

    def test_scenario_d_cross_patient_detail_isolation(self):
        """
        Scenario D (Security): Patient 2 cannot read or retry Patient 1's assessment (403 Forbidden).
        Doctor can view it.
        """
        self.client.force_authenticate(user=self.patient_2)

        # Cannot read assessment 1
        res_read = self.client.get(f'/api/patient/assessment/{self.assessment_1.id}/')
        self.assertEqual(res_read.status_code, status.HTTP_403_FORBIDDEN)

        # Cannot retry analysis on assessment 1
        res_retry = self.client.post(f'/api/patient/assessment/{self.assessment_1.id}/retry-analysis/')
        self.assertEqual(res_retry.status_code, status.HTTP_403_FORBIDDEN)

        # Doctor has access
        self.client.force_authenticate(user=self.doctor)
        res_doc = self.client.get(f'/api/patient/assessment/{self.assessment_1.id}/')
        self.assertEqual(res_doc.status_code, status.HTTP_200_OK)

    def test_draft_persistence_does_not_trigger_doctor_review(self):
        """
        Draft assessments save in-progress state but do NOT create ClinicalReview or notify doctor.
        """
        self.client.force_authenticate(user=self.patient_2)
        payload = {
            'is_draft': True,
            'demographics': {'fullName': 'Patient Two Draft', 'age': 45},
            'prakriti_data': {'prakriti_q1': 'opt_1_1'}
        }
        res = self.client.post('/api/patient/assessment/submit/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        asm_id = res.data['assessment_id']

        asm = PatientAssessment.objects.get(id=asm_id)
        self.assertEqual(asm.status, AssessmentStatus.IN_PROGRESS)

        # No clinical review created for draft
        self.assertFalse(ClinicalReview.objects.filter(assessment=asm).exists())

        # No doctor notification created
        self.assertFalse(Notification.objects.filter(related_object_id=asm.id, type='NEW_ASSESSMENT').exists())

    def test_diet_plan_state_transition_validation(self):
        """
        Doctor cannot approve an already ACTIVE plan or reject an already ACTIVE plan.
        """
        self.client.force_authenticate(user=self.doctor)

        plan = DietPlan.objects.create(
            patient=self.patient_1,
            doctor=self.doctor,
            status=DietPlanStatus.ACTIVE,
            title='Active Clinical Plan'
        )

        # Attempt to approve already active plan -> 400
        res_approve = self.client.post(f'/api/doctor/diet-plans/{plan.id}/approve/')
        self.assertEqual(res_approve.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('already active', res_approve.data['error'].lower())

        # Attempt to reject already active plan -> 400
        res_reject = self.client.post(f'/api/doctor/diet-plans/{plan.id}/reject/')
        self.assertEqual(res_reject.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cannot reject an active', res_reject.data['error'].lower())
