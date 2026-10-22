from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Seeds realistic Ayurvedic clinical data, doctors, patients, assessments, XAI and RAG evidence'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force seeding even in non-development environments'
        )

    def handle(self, *args, **options):
        self.stdout.write('Delegating to seed_demo_data...')
        call_command('seed_demo_data', *args, **options)
