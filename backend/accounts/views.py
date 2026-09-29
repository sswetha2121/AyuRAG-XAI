from django.contrib.auth import authenticate, login, logout
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

        if len(password) < 4:
            return Response({'error': 'Password must be at least 4 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

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
    Convenience endpoint for clinical research testing.
    Switches session between Doctor and Patient personas.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        target_role = request.data.get('role', 'DOCTOR').upper()
        if target_role not in ['DOCTOR', 'PATIENT']:
            return Response({'error': 'Invalid role.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(role=target_role).first()
        if not user:
            return Response({'error': f'No demo user found with role {target_role}.'}, status=status.HTTP_404_NOT_FOUND)

        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'message': f'Switched to {target_role} persona.',
            'user': serializer.data
        })
