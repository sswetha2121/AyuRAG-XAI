from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from accounts.models import User, DoctorProfile


class Command(BaseCommand):
    help = 'Approves or rejects a registered doctor account by username, email, or license'

    def add_arguments(self, parser):
        parser.add_argument('identifier', type=str, help='Doctor username, email, or clinical license')
        parser.add_argument('--reject', action='store_true', help='Reject the doctor account instead of approving')
        parser.add_argument('--reason', type=str, default='', help='Reason for rejection')

    def handle(self, *args, **options):
        ident = options['identifier'].strip()
        reject = options['reject']
        reason = options['reason'].strip()

        # Find user or doctor profile
        user = User.objects.filter(username__iexact=ident).first() or User.objects.filter(email__iexact=ident).first()
        if user:
            profile = getattr(user, 'doctor_profile', None)
        else:
            profile = DoctorProfile.objects.filter(clinical_license__iexact=ident).first()

        if not profile:
            raise CommandError(f"Doctor matching '{ident}' was not found.")

        if reject:
            profile.approval_status = DoctorProfile.ApprovalStatus.REJECTED
            profile.rejection_reason = reason or 'Administrative verification criteria not met.'
            profile.approved_at = timezone.now()
            profile.save()
            self.stdout.write(self.style.WARNING(
                f"Doctor '{profile.professional_name}' ({profile.user.email}) has been REJECTED. Reason: {profile.rejection_reason}"
            ))
        else:
            profile.approval_status = DoctorProfile.ApprovalStatus.APPROVED
            profile.rejection_reason = ''
            profile.approved_at = timezone.now()
            profile.save()
            self.stdout.write(self.style.SUCCESS(
                f"Doctor '{profile.professional_name}' ({profile.user.email}) has been successfully APPROVED."
            ))
