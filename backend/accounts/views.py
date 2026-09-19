from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import User
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

        # Allow login by email or username
        if '@' in username:
            user_obj = User.objects.filter(email__iexact=username).first()
            if user_obj:
                username = user_obj.username

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({
                'message': 'Authentication successful.',
                'user': serializer.data
            })
        else:
            return Response(
                {'error': 'Invalid username or credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
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
