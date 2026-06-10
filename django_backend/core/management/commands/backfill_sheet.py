# core/management/commands/backfill_sheet.py
import logging
import time # Added
from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import Registration
from core.utils.sheets_utils import append_approved_user_to_sheet

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Backfill Google Sheet with all approved registrations"
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-export even if registration already in sheet',
        )
    
    @transaction.atomic
    def handle(self, *args, **options):
        force = options.get('force', False)
        all_registrations = Registration.objects.all().order_by('-created_at')
        
        self.stdout.write(f"Found {all_registrations.count()} total registration(s)")
        if all_registrations.count() == 0:
            self.stdout.write(self.style.WARNING("No registrations to backfill"))
            return
        
        processed = 0
        skipped = 0
        failed = 0
        
        for idx, registration in enumerate(all_registrations, 1):
            try:
                self.stdout.write(
                    f"[{idx}/{all_registrations.count()}] Processing registration ID {registration.id} ({registration.status})... ",
                    ending=""
                )
                
                success = append_approved_user_to_sheet(registration)
                
                if success:
                    self.stdout.write(self.style.SUCCESS("done"))
                    processed += 1
                else:
                    self.stdout.write(self.style.WARNING("failed (check logs)"))
                    failed += 1
                
                time.sleep(1) # Crucial: sleep to honor Google Sheets 60/min API limit
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"error: {str(e)}"))
                logger.exception(f"Unexpected error processing registration {registration.id}")
                failed += 1
        
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS(f"Processed: {processed}"))
        self.stdout.write(self.style.WARNING(f"Skipped (already in sheet): {skipped}"))
        self.stdout.write(self.style.ERROR(f"Failed: {failed}"))
        self.stdout.write("="*60)