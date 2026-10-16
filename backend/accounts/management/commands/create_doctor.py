import secrets
import string
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone
from accounts.models import User, DoctorProfile
from accounts.views import generate_unique_doctor_username


class Command(BaseCommand):
    help = 'Securely creates a doctor account for development, testing, or clinical administration'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, required=True, help='Doctor professional email address')
        parser.add_argument('--name', type=str, required=True, help='Doctor full name and title (e.g. Dr. Jane Doe)')
        parser.add_argument('--license', type=str, required=True, help='Medical registration or clinical license number')
        parser.add_argument('--password', type=str, default=None, help='Password for the doctor (if omitted, a secure password is generated)')
        parser.add_argument('--specialization', type=str, default='Kayachikitsa (Ayurvedic Internal Medicine)', help='Clinical specialization')
        parser.add_argument('--qualification', type=str, default='BAMS, MD (Ayurveda)', help='Medical qualifications')
        parser.add_argument('--clinic', type=str, default='', help='Clinic or hospital institution')
        parser.add_argument('--experience', type=int, default=10, help='Years of clinical experience')
        parser.add_argument('--approved', action='store_true', help='Approve the doctor account immediately')

    def handle(self, *args, **options):
        email = options['email'].strip()
        name = options['name'].strip()
        license_no = options['license'].strip()
        password = options['password']
        specialization = options['specialization'].strip()
        qualification = options['qualification'].strip()
        clinic = options['clinic'].strip()
        experience = options['experience']
        approved = options['approved']

        try:
            validate_email(email)
        except DjangoValidationError:
            raise CommandError(f"Invalid email address: '{email}'")

        if User.objects.filter(email__iexact=email).exists():
            raise CommandError(f"A user with email '{email}' already exists.")

        if DoctorProfile.objects.filter(clinical_license__iexact=license_no).exists():
            raise CommandError(f"A doctor profile with clinical license '{license_no}' already exists.")

        # Generate password if not supplied
        generated_password = False
        if not password:
            alphabet = string.ascii_letters + string.digits + '!@#$%'
            password = ''.join(secrets.choice(alphabet) for _ in range(16))
            generated_password = True

        if len(password) < 8:
            raise CommandError("Password must be at least 8 characters long.")

        username = generate_unique_doctor_username(email, name)
        status_val = DoctorProfile.ApprovalStatus.APPROVED if approved else DoctorProfile.ApprovalStatus.PENDING

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
                professional_name=name,
                qualification=qualification,
                specialization=specialization,
                clinical_license=license_no,
                clinic_institution=clinic,
                experience_years=experience,
                approval_status=status_val,
                approved_at=timezone.now() if approved else None
            )

        self.stdout.write(self.style.SUCCESS(
            f"Successfully created doctor account for '{profile.professional_name}'!\n"
            f"  Username: {user.username}\n"
            f"  Email: {user.email}\n"
            f"  License: {profile.clinical_license}\n"
            f"  Approval Status: {profile.approval_status}\n"
            f"  Password: {password if generated_password else '[USER SUPPLIED]'}"
        ))
