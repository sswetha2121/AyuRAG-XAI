import re
from django.conf import settings
from django.contrib.auth import authenticate, login, logout, password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import User, PatientProfile, DoctorProfile
from .serializers import UserSerializer


def generate_unique_doctor_username(email, full_name=''):
    raw_prefix = email.split('@')[0].lower().strip()
    clean_prefix = re.sub(r'[^a-zA-Z0-9._]', '', raw_prefix)
    if not clean_prefix.startswith('dr.'):
        clean_prefix = f"dr.{clean_prefix}"
    
    candidate = clean_prefix
    counter = 1
    while User.objects.filter(username__iexact=candidate).exists():
        candidate = f"{clean_prefix}{counter}"
        counter += 1
    return candidate


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        clean_username = str(username).strip()
        # Case-insensitive match on email or username
        user_obj = User.objects.filter(email__iexact=clean_username).first() or User.objects.filter(username__iexact=clean_username).first()
        if user_obj:
            clean_username = user_obj.username

        user = authenticate(request, username=clean_username, password=password)
        if user is not None:
            # Check approval status if doctor
            if user.role == User.Role.DOCTOR:
                doctor_profile = getattr(user, 'doctor_profile', None)
                if not doctor_profile or doctor_profile.approval_status == DoctorProfile.ApprovalStatus.PENDING:
                    return Response(
                        {
                            'error': 'Your doctor account is awaiting administrative verification. You will be able to access the clinical portal once your credentials have been verified by an administrator.',
                            'approval_status': 'PENDING'
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )
                if doctor_profile.approval_status == DoctorProfile.ApprovalStatus.REJECTED:
                    reason = f" Reason: {doctor_profile.rejection_reason}" if doctor_profile.rejection_reason else ""
                    return Response(
                        {
                            'error': f'Your clinical account registration was not approved.{reason} Please contact clinical administration.',
                            'approval_status': 'REJECTED'
                        },
                        status=status.HTTP_403_FORBIDDEN
                    )

            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'message': 'Authentication successful.',
                'user': serializer.data
            })
        else:
            return Response(
                {'error': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class DoctorLoginView(APIView):
    """
    Dedicated login endpoint for licensed medical practitioners.
    Strictly verifies DOCTOR role authorization and approval status.
    Provides actionable status messages for pending, approved, and invalid accounts.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Physician username/email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        clean_identifier = str(username).strip()
        # Look up by email, username, or clinical license number
        user_obj = (
            User.objects.filter(email__iexact=clean_identifier).first() or
            User.objects.filter(username__iexact=clean_identifier).first() or
            User.objects.filter(doctor_profile__clinical_license__iexact=clean_identifier).first()
        )

        if not user_obj:
            return Response(
                {'error': 'Invalid physician credentials or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if user_obj.role != User.Role.DOCTOR:
            return Response(
                {'error': 'Access Denied: This portal is restricted to authorized physicians and clinical staff only. Please use the Patient Portal.'},
                status=status.HTTP_403_FORBIDDEN
            )

        doctor_profile = getattr(user_obj, 'doctor_profile', None)
        approval_status = getattr(doctor_profile, 'approval_status', DoctorProfile.ApprovalStatus.PENDING) if doctor_profile else DoctorProfile.ApprovalStatus.PENDING

        if approval_status == DoctorProfile.ApprovalStatus.PENDING:
            return Response(
                {
                    'error': 'Your doctor account is awaiting administrative verification. You will be able to access the Doctor Portal once your credentials have been verified by an administrator.',
                    'approval_status': 'PENDING',
                    'username': user_obj.username,
                    'email': user_obj.email
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if approval_status == DoctorProfile.ApprovalStatus.REJECTED:
            reason = f" Reason: {doctor_profile.rejection_reason}" if doctor_profile.rejection_reason else ""
            return Response(
                {
                    'error': f'Your clinical account registration was not approved.{reason} Please contact clinical administration.',
                    'approval_status': 'REJECTED'
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Account is an approved doctor. Authenticate credentials.
        user = authenticate(request, username=user_obj.username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid physician credentials or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'This physician account has been deactivated. Please contact clinical administration.'},
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Physician authentication successful.',
            'user': serializer.data
        })


class DoctorRegisterView(APIView):
    """
    Dedicated registration endpoint for licensed medical practitioners.
    Creates doctor account and profile with PENDING approval status.
    Requires administrative verification before access to clinical records is granted.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        full_name = request.data.get('fullName', '').strip() or request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')
        confirm_password = request.data.get('confirmPassword', '')
        clinical_license = request.data.get('clinicalLicense', '').strip() or request.data.get('licenseNumber', '').strip() or request.data.get('registrationNumber', '').strip()
        specialization = request.data.get('specialization', '').strip() or 'Kayachikitsa (Ayurvedic Internal Medicine)'
        qualification = request.data.get('qualification', '').strip() or 'BAMS, MD (Ayurveda)'
        clinic_institution = request.data.get('clinicInstitution', '').strip() or request.data.get('institution', '').strip()
        experience_years = request.data.get('experienceYears', 0)

        # 1. Required field validations
        if not full_name:
            return Response({'error': 'Physician full name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'error': 'Professional email address is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not clinical_license:
            return Response({'error': 'Medical registration / clinical license number is required for verification.'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'error': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Email format validation
        try:
            validate_email(email)
        except DjangoValidationError:
            return Response({'error': 'Please enter a valid professional email address.'}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Password confirmation validation
        if confirm_password and password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        # 4. Password policy validation (>= 8 chars & Django validators)
        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            password_validation.validate_password(password)
        except DjangoValidationError as val_err:
            return Response({'error': ' '.join(val_err.messages)}, status=status.HTTP_400_BAD_REQUEST)

        # 5. Experience years parsing
        try:
            exp_int = int(experience_years) if experience_years is not None and str(experience_years).strip() != '' else 0
            if exp_int < 0 or exp_int > 70:
                exp_int = 0
        except (ValueError, TypeError):
            exp_int = 0

        # 6. Uniqueness checks
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'error': f"An account with email '{email}' already exists. Please sign in or contact administration."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if DoctorProfile.objects.filter(clinical_license__iexact=clinical_license).exists():
            return Response(
                {'error': f"A doctor account with clinical license '{clinical_license}' is already registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = generate_unique_doctor_username(email, full_name)

        # 7. Transactional account & profile creation
        with transaction.atomic():
            user = User.objects.create(
                username=username,
                email=email,
                role=User.Role.DOCTOR,
                is_staff=False,
                is_superuser=False,
                is_active=True
            )
            user.set_password(password)
            user.save()

            profile = DoctorProfile.objects.create(
                user=user,
                professional_name=full_name,
                qualification=qualification,
                specialization=specialization,
                clinical_license=clinical_license,
                clinic_institution=clinic_institution,
                experience_years=exp_int,
                approval_status=DoctorProfile.ApprovalStatus.PENDING
            )

        # NOTE: Do NOT call login(request, user). Newly registered doctor must wait for approval.
        return Response({
            'message': 'Registration submitted successfully. Your doctor account is awaiting administrative verification.',
            'approval_status': 'PENDING',
            'doctor': {
                'username': user.username,
                'email': user.email,
                'name': profile.professional_name,
                'clinical_license': profile.clinical_license,
                'specialization': profile.specialization,
                'clinic_institution': profile.clinic_institution,
                'approval_status': profile.approval_status
            }
        }, status=status.HTTP_201_CREATED)


class AdminPendingDoctorsView(APIView):
    """
    Lists doctors pending administrative verification.
    Accessible only to staff/superusers (IsAdminUser).
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        pending_profiles = DoctorProfile.objects.filter(
            approval_status=DoctorProfile.ApprovalStatus.PENDING
        ).select_related('user').order_by('-created_at')

        data = []
        for p in pending_profiles:
            data.append({
                'id': p.id,
                'user_id': p.user_id,
                'username': p.user.username,
                'email': p.user.email,
                'professional_name': p.professional_name,
                'qualification': p.qualification,
                'specialization': p.specialization,
                'clinical_license': p.clinical_license,
                'clinic_institution': p.clinic_institution,
                'experience_years': p.experience_years,
                'approval_status': p.approval_status,
                'created_at': p.created_at
            })
        return Response({'pending_doctors': data, 'count': len(data)})


class AdminDoctorApprovalView(APIView):
    """
    Approves or rejects doctor accounts.
    Accessible only to staff/superusers (IsAdminUser).
    Strictly forbids self-approval.
    """
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            profile = DoctorProfile.objects.select_related('user').get(pk=pk)
        except DoctorProfile.DoesNotExist:
            return Response({'error': 'Doctor profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id == profile.user_id:
            return Response(
                {'error': 'Administrative self-approval is forbidden. Another administrator must verify this account.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        action = request.data.get('action', 'approve').lower()
        if action == 'approve':
            profile.approval_status = DoctorProfile.ApprovalStatus.APPROVED
            profile.approved_at = timezone.now()
            profile.approved_by = request.user
            profile.rejection_reason = ''
            profile.save()
            return Response({
                'message': f"Doctor '{profile.professional_name}' ({profile.user.email}) has been approved successfully.",
                'approval_status': 'APPROVED'
            })
        elif action == 'reject':
            reason = request.data.get('reason', 'Verification requirements not satisfied.').strip()
            profile.approval_status = DoctorProfile.ApprovalStatus.REJECTED
            profile.approved_at = timezone.now()
            profile.approved_by = request.user
            profile.rejection_reason = reason
            profile.save()
            return Response({
                'message': f"Doctor '{profile.professional_name}' has been rejected.",
                'approval_status': 'REJECTED',
                'reason': reason
            })
        else:
            return Response({'error': "Invalid action. Must be 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    Patient registration endpoint accepting complete intake demographic profile.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        full_name = request.data.get('fullName', '').strip()
        email = request.data.get('email', '').strip()
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        age = request.data.get('age')
        gender = request.data.get('gender', 'Unspecified')
        contact_phone = request.data.get('contactPhone', '').strip()

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

        from django.core.exceptions import ValidationError as DjangoValidationError
        try:
            password_validation.validate_password(password)
        except DjangoValidationError as val_err:
            return Response({'error': ' '.join(val_err.messages)}, status=status.HTTP_400_BAD_REQUEST)

        if not username:
            username = email.split('@')[0]

        # Check unique constraints
        if User.objects.filter(username__iexact=username).exists():
            return Response({'error': f"Username '{username}' is already taken. Please choose another username."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email__iexact=email).exists():
            return Response({'error': f"An account with email '{email}' already exists. Please sign in."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            role=User.Role.PATIENT
        )
        user.set_password(password)
        user.save()

        PatientProfile.objects.create(
            user=user,
            full_name=full_name or username,
            age=int(age) if age and str(age).isdigit() else None,
            gender=gender,
            contact_phone=contact_phone
        )

        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Patient registration successful.',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)



class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
        return Response({'message': 'Logged out successfully.'})


class DemoSwitchView(APIView):
    """
    Development-only convenience endpoint for clinical research testing.
    Strictly disabled in production configuration.
    Operates ONLY on designated isolated demo accounts, never on real patient records.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if not getattr(settings, 'DEMO_MODE', False) or not getattr(settings, 'DEBUG', False):
            return Response(
                {'error': 'Demo persona switching is strictly disabled in production configuration.'},
                status=status.HTTP_403_FORBIDDEN
            )

        target_role = request.data.get('role', 'DOCTOR').upper()
        if target_role not in ['DOCTOR', 'PATIENT']:
            return Response({'error': 'Invalid role specified.'}, status=status.HTTP_400_BAD_REQUEST)

        # Isolated demo personas
        target_username = 'demo.doctor' if target_role == 'DOCTOR' else 'demo.patient'
        user = User.objects.filter(username=target_username).first()

        if not user:
            # Create the dedicated demo persona
            user = User.objects.create(
                username=target_username,
                email=f"{target_username}@ayurag.example",
                role=target_role
            )
            user.set_password('demoPersona2026!')
            user.save()
            if target_role == 'DOCTOR':
                DoctorProfile.objects.create(
                    user=user,
                    professional_name='Dr. Demo Attending Physician',
                    qualification='BAMS, MD (Kayachikitsa)',
                    specialization='Ayurvedic Internal Medicine',
                    clinical_license='AYUSH-DEMO-2026',
                    approval_status=DoctorProfile.ApprovalStatus.APPROVED
                )
            else:
                PatientProfile.objects.create(
                    user=user,
                    full_name='Demo Patient (Aarav Mehta)',
                    age=28,
                    gender='Male',
                    contact_phone='+91 98765 43210'
                )

        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': f'Switched to dedicated {target_role} demo persona.',
            'user': serializer.data
        })

