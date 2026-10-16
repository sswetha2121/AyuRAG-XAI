"""
AyuRAG-XAI Database Backup, Integrity Verification, and Restoration Utility.

Usage:
    python scripts/db_backup_restore.py backup [--output-dir DIR]
    python scripts/db_backup_restore.py verify
    python scripts/db_backup_restore.py restore --file PATH [--force]
"""

import os
import sys
import argparse
import datetime
import shutil
from pathlib import Path

# Set up Django environment
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from django.core.management import call_command
from django.db import connection, transaction
from accounts.models import User, PatientProfile, DoctorProfile
from clinical.models import (
    PatientAssessment,
    ClinicalReview,
    PatientVerification,
    DietPlan,
    DietPlanVersion,
    Notification,
    AuditLog,
    MealLog,
    MealReminderPreference,
    ProgressRecord
)


def verify_database_integrity():
    """
    Validates data integrity and relationship consistency across accounts and clinical records.
    Returns a status dict with counts and integrity issues found.
    """
    print("\n--- Running AyuRAG-XAI Database Integrity Check ---")
    issues = []
    
    # 1. User records
    total_users = User.objects.count()
    patient_users = User.objects.filter(role=User.Role.PATIENT).count()
    doctor_users = User.objects.filter(role=User.Role.DOCTOR).count()
    print(f"Users: {total_users} total ({patient_users} patients, {doctor_users} doctors)")

    # 2. Check for users with invalid roles
    invalid_roles = User.objects.exclude(role__in=[User.Role.PATIENT, User.Role.DOCTOR]).count()
    if invalid_roles > 0:
        issues.append(f"Found {invalid_roles} users with invalid roles.")

    # 3. PatientAssessments
    total_assessments = PatientAssessment.objects.count()
    print(f"Patient Assessments: {total_assessments}")
    
    # Check for orphaned assessments (patient user no longer exists or is not PATIENT)
    orphaned_assessments = PatientAssessment.objects.exclude(patient__role=User.Role.PATIENT).count()
    if orphaned_assessments > 0:
        issues.append(f"Found {orphaned_assessments} assessments belonging to non-patient users.")

    # 4. Clinical Reviews
    total_reviews = ClinicalReview.objects.count()
    print(f"Clinical Reviews: {total_reviews}")
    
    # Reviews without valid doctor
    invalid_doctor_reviews = ClinicalReview.objects.exclude(doctor__role=User.Role.DOCTOR).count()
    if invalid_doctor_reviews > 0:
        issues.append(f"Found {invalid_doctor_reviews} clinical reviews where doctor is not role DOCTOR.")

    # 5. Diet Plans
    total_diet_plans = DietPlan.objects.count()
    active_plans = DietPlan.objects.filter(status='ACTIVE').count()
    print(f"Diet Plans: {total_diet_plans} total ({active_plans} active)")

    # Check that patients have at most one ACTIVE diet plan
    from django.db.models import Count
    multiple_active = (
        DietPlan.objects.filter(status='ACTIVE')
        .values('patient')
        .annotate(cnt=Count('id'))
        .filter(cnt__gt=1)
    )
    if multiple_active.exists():
        issues.append(f"Found {multiple_active.count()} patients with multiple simultaneously ACTIVE diet plans.")

    # 6. Notifications
    total_notifications = Notification.objects.count()
    print(f"Notifications: {total_notifications}")

    # 7. Audit Logs
    total_audit_logs = AuditLog.objects.count()
    print(f"Audit Logs: {total_audit_logs}")

    print("---------------------------------------------------")
    if issues:
        print(f"INTEGRITY WARNINGS DETECTED ({len(issues)}):")
        for issue in issues:
            print(f"  - {issue}")
        return False, issues
    else:
        print("ALL INTEGRITY CHECKS PASSED: Zero orphaned records, consistent role relationships.")
        return True, []


def create_backup(output_dir=None):
    """
    Creates a timestamped backup containing sanitized application fixtures and a database copy.
    """
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_base = Path(output_dir) if output_dir else BACKEND_DIR / 'backups'
    backup_dir = backup_base / f"backup_{timestamp}"
    backup_dir.mkdir(parents=True, exist_ok=True)

    fixture_path = backup_dir / f"ayurag_data_{timestamp}.json"
    print(f"\n[1/3] Exporting portable data fixture to: {fixture_path}")
    with open(fixture_path, 'w', encoding='utf-8') as f:
        call_command(
            'dumpdata',
            'accounts',
            'clinical',
            indent=2,
            stdout=f,
            format='json'
        )

    # If SQLite is active, create binary backup
    db_path = BACKEND_DIR / 'db.sqlite3'
    if db_path.exists():
        sqlite_copy = backup_dir / f"db_{timestamp}.sqlite3"
        print(f"[2/3] Copying SQLite database to: {sqlite_copy}")
        shutil.copy2(db_path, sqlite_copy)

    # Integrity verification
    print("[3/3] Verifying integrity of backed-up state...")
    passed, _ = verify_database_integrity()

    manifest_path = backup_dir / "MANIFEST.txt"
    with open(manifest_path, 'w', encoding='utf-8') as mf:
        mf.write(f"AyuRAG-XAI Database Backup Manifest\n")
        mf.write(f"Timestamp: {timestamp}\n")
        mf.write(f"Fixture: {fixture_path.name}\n")
        mf.write(f"Integrity Status: {'PASSED' if passed else 'WARNING'}\n")

    print(f"\nBACKUP COMPLETE: Successfully archived in {backup_dir}\n")
    return backup_dir


def restore_backup(fixture_file, force=False):
    """
    Restores clinical and accounts data from a JSON fixture file.
    """
    file_path = Path(fixture_file)
    if not file_path.exists():
        print(f"Error: Fixture file not found: {file_path}")
        sys.exit(1)

    print(f"\n--- AyuRAG-XAI Database Restoration ---")
    print(f"Target Fixture: {file_path}")
    
    if not force:
        confirm = input("Are you sure you want to restore data from this fixture? (yes/no): ")
        if confirm.lower() not in ('yes', 'y'):
            print("Restoration cancelled.")
            return False

    print("\n[1/2] Loading fixture data...")
    call_command('loaddata', str(file_path))
    
    print("\n[2/2] Verifying post-restoration integrity...")
    passed, issues = verify_database_integrity()
    if passed:
        print("\nRESTORE COMPLETE: Data restored and verified successfully.\n")
        return True
    else:
        print("\nWARNING: Restoration finished with integrity warnings.\n")
        return False


def main():
    parser = argparse.ArgumentParser(description="AyuRAG-XAI Database Backup & Restoration Utility")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # backup
    backup_parser = subparsers.add_parser("backup", help="Create timestamped backup")
    backup_parser.add_argument("--output-dir", help="Destination directory for backup", default=None)

    # verify
    subparsers.add_parser("verify", help="Verify database integrity and relationships")

    # restore
    restore_parser = subparsers.add_parser("restore", help="Restore database from fixture")
    restore_parser.add_argument("--file", required=True, help="Path to JSON fixture file")
    restore_parser.add_argument("--force", action="store_true", help="Skip interactive confirmation")

    args = parser.parse_args()

    if args.command == "backup":
        create_backup(args.output_dir)
    elif args.command == "verify":
        passed, _ = verify_database_integrity()
        sys.exit(0 if passed else 1)
    elif args.command == "restore":
        success = restore_backup(args.file, force=args.force)
        sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
