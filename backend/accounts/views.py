from django.conf import settings
from django.contrib.auth import authenticate, login, logout, password_validation
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import User, PatientProfile, DoctorProfile
from .serializers import UserSerializer

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
    Strictly verifies DOCTOR role authorization.
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

        clean_username = str(username).strip()
        user_obj = User.objects.filter(email__iexact=clean_username).first() or User.objects.filter(username__iexact=clean_username).first()
        if user_obj:
            clean_username = user_obj.username

        user = authenticate(request, username=clean_username, password=password)
        if user is None:
            return Response(
                {'error': 'Invalid physician credentials or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if user.role != User.Role.DOCTOR:
            return Response(
                {'error': 'Access Denied: This portal is restricted to authorized physicians and clinical staff only. Please use the Patient Portal.'},
                status=status.HTTP_403_FORBIDDEN
            )

        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': 'Physician authentication successful.',
            'user': serializer.data
        })


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
                    clinical_license='AYUSH-DEMO-2026'
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

