# core/management/commands/backfill_sheet.py
import logging
import os
import time
from django.conf import settings
from django.core.management.base import BaseCommand
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

from core.models import Registration
from core.utils.sheets_utils import (
    get_sheets_service,
    build_header_row,
    build_data_row,
    append_approved_user_to_sheet
)

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = "Backfill or rebuild Main Conference registrations in Google Sheets and/or Excel"

    def add_arguments(self, parser):
        parser.add_argument(
            "--target",
            choices=["google", "excel", "both"],
            default="google",
            help="Where to write the registration data.",
        )
        parser.add_argument(
            "--rebuild",
            action="store_true",
            help="Clear the target sheet and completely rebuild from the Database.",
        )

    def handle(self, *args, **options):
        target = options.get("target", "google")
        rebuild = options.get("rebuild", False)

        # Removed @transaction.atomic so we don't lock the DB during long API calls!
        queryset = Registration.objects.all().order_by("-created_at")
        total = queryset.count()

        self.stdout.write(f"Found {total} total registration(s) in the database.")

        if total == 0:
            return

        if rebuild:
            self.stdout.write("REBUILD MODE ACTIVE: Extracting all data...")
            header_row = build_header_row()
            data_rows = [build_data_row(obj) for obj in queryset]

            if target in ("excel", "both"):
                self._rebuild_excel(header_row, data_rows)

            if target in ("google", "both"):
                self._rebuild_google(header_row, data_rows)
            return

        # Standard line-by-line backfill if --rebuild is not used
        self.stdout.write("Running standard line-by-line sync...")
        for idx, registration in enumerate(queryset, 1):
            if target in ("google", "both"):
                append_approved_user_to_sheet(registration)
                time.sleep(1)  # Respect Google's 60/min API limit
                self.stdout.write(f"[{idx}/{total}] Processed ID {registration.id}")

    def _rebuild_excel(self, header_row, data_rows):
        exports_dir = settings.BASE_DIR / "exports"
        os.makedirs(exports_dir, exist_ok=True)
        excel_path = exports_dir / "Main_Conference_Registrations.xlsx"

        wb = Workbook()
        ws = wb.active
        ws.title = "Registrations"
        
        ws.append(header_row)
        for row in data_rows:
            ws.append(row)

        # Make header bold
        from openpyxl.styles import Font
        bold = Font(bold=True)
        for cell in ws[1]:
            cell.font = bold

        wb.save(excel_path)
        self.stdout.write(self.style.SUCCESS(f"✅ Excel sheet successfully built at: {excel_path}"))

    def _rebuild_google(self, header_row, data_rows):
        if not getattr(settings, 'GOOGLE_SHEETS_ID', None):
            self.stdout.write(self.style.WARNING("GOOGLE_SHEETS_ID not configured; skipping Google Sheets"))
            return

        try:
            service = get_sheets_service()
            sheet_id = settings.GOOGLE_SHEETS_ID
            range_name = settings.GOOGLE_SHEETS_RANGE
            sheet_name = range_name.split('!')[0]
            end_col = get_column_letter(len(header_row))

            # 1. Clear the entire sheet to remove ghost rows
            self.stdout.write("Clearing existing Google Sheet data...")
            service.spreadsheets().values().clear(
                spreadsheetId=sheet_id,
                range=f"{sheet_name}!A1:ZZ",
                body={},
            ).execute()

            # 2. Batch write all rows at once
            self.stdout.write("Writing fresh database rows to Google Sheet...")
            rows = [header_row] + data_rows
            
            # Write in chunks to ensure no payload limits are hit
            batch_size = 500
            start_row = 1
            for idx in range(0, len(rows), batch_size):
                chunk = rows[idx:idx + batch_size]
                end_row = start_row + len(chunk) - 1
                update_range = f"{sheet_name}!A{start_row}:{end_col}{end_row}"

                service.spreadsheets().values().update(
                    spreadsheetId=sheet_id,
                    range=update_range,
                    valueInputOption="USER_ENTERED",
                    body={"values": chunk},
                ).execute()
                start_row = end_row + 1

            self.stdout.write(self.style.SUCCESS("✅ Google Sheets successfully rebuilt with all DB records."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Google Sheets rebuild failed: {str(e)}"))