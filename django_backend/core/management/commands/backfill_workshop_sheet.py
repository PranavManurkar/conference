import time
from django.core.management.base import BaseCommand

from core.models import WorkshopRegistration
from core.utils.sheets_utils import (
    append_workshop_to_google_sheet,
    get_existing_workshop_ids,
    get_sheets_service,
)


class Command(BaseCommand):
    help = "Backfill Workshop registrations into the Google Sheet"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="List records that would be processed without writing",
        )

    def handle(self, *args, **options):
        dry_run = options.get("dry_run", False)
        queryset = WorkshopRegistration.objects.order_by("id")
        total = queryset.count()

        self.stdout.write(f"Found {total} workshop registrations")

        existing_ids = set()
        try:
            service = get_sheets_service()
            existing_ids = get_existing_workshop_ids(service)
        except Exception as e:
            self.stderr.write(f"Failed to read existing Workshop IDs: {e}")

        added_count = 0
        updated_count = 0
        failed_count = 0

        for index, registration in enumerate(queryset, start=1):
            registration_id = str(registration.id)
            was_existing = registration_id in existing_ids

            if dry_run:
                action = "UPDATED" if was_existing else "ADDED"
                self.stdout.write(
                    f"[ {index} / {total} ] ID:{registration_id} {registration.email} -> {action} (dry-run)"
                )
                if was_existing:
                    updated_count += 1
                else:
                    added_count += 1
                continue

            try:
                result = append_workshop_to_google_sheet(registration)
                if result:
                    action = "UPDATED" if was_existing else "ADDED"
                    self.stdout.write(
                        f"[ {index} / {total} ] ID:{registration_id} {registration.email} -> {action}"
                    )
                    if was_existing:
                        updated_count += 1
                    else:
                        added_count += 1
                        existing_ids.add(registration_id)
                else:
                    failed_count += 1
                    self.stdout.write(
                        f"[ {index} / {total} ] ID:{registration_id} {registration.email} -> FAILED"
                    )
            except Exception as e:
                failed_count += 1
                self.stderr.write(
                    f"[ {index} / {total} ] ID:{registration_id} {registration.email} -> FAILED ({e})"
                )

            time.sleep(1)

        if dry_run:
            self.stdout.write(
                f"Complete: {added_count} added, {updated_count} updated, {failed_count} failed (dry-run)"
            )
        else:
            self.stdout.write(
                f"Complete: {added_count} added, {updated_count} updated, {failed_count} failed"
            )

        self.stdout.write("Check logs/sheets_errors.log for failures")
