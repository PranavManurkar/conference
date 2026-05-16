import logging
import time

from django.core.management.base import BaseCommand

from core.models import Registration, WorkshopRegistration
from core.utils.email_utils import (
    send_conference_approval_email,
    send_conference_rejection_email,
    send_workshop_payment_confirmation_email,
    send_workshop_payment_reminder_email,
    send_workshop_registration_email,
)


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Send onboarding emails to existing workshop/conference users based on current status"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview actions without sending emails",
        )
        parser.add_argument(
            "--type",
            choices=["workshop", "conference", "all"],
            default="all",
            help="Choose which records to process (default: all)",
        )
        parser.add_argument(
            "--include-pending",
            action="store_true",
            help="Include conference registrations with 'Under Process' status (send submission email)",
        )

    @staticmethod
    def _normalize_status(value):
        return (value or "").strip().lower()

    def _resolve_workshop_action(self, status):
        normalized = self._normalize_status(status)

        if normalized == self._normalize_status(WorkshopRegistration.STATUS_UNDER_PROCESS):
            return "workshop_registration", send_workshop_registration_email
        if normalized == self._normalize_status(WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT):
            return "workshop_payment_reminder", send_workshop_payment_reminder_email
        if normalized in {
            self._normalize_status(WorkshopRegistration.STATUS_PAYMENT_SUBMITTED),
            self._normalize_status(WorkshopRegistration.STATUS_ACCEPTED),
        }:
            return "workshop_payment_confirmation", send_workshop_payment_confirmation_email

        return None, None

    def _resolve_conference_action(self, status):
        normalized = self._normalize_status(status)

        if normalized == self._normalize_status(Registration.STATUS_ACCEPTED):
            return "conference_approval", send_conference_approval_email
        if normalized == self._normalize_status(Registration.STATUS_REJECTED):
            return "conference_rejection", send_conference_rejection_email
        if normalized == self._normalize_status(Registration.STATUS_UNDER):
            return "conference_pending_skip", None

        return None, None

    def _print_discovered_statuses(self):
        conference_statuses = sorted(
            {s for s in Registration.objects.values_list("status", flat=True).distinct() if s is not None}
        )
        workshop_statuses = sorted(
            {s for s in WorkshopRegistration.objects.values_list("status", flat=True).distinct() if s is not None}
        )

        self.stdout.write(f"Conference statuses found in DB: {conference_statuses}")
        self.stdout.write(f"Workshop statuses found in DB: {workshop_statuses}")

    def _process_workshop(self, dry_run):
        sent = 0
        failed = 0
        skipped = 0

        queryset = WorkshopRegistration.objects.all().order_by("created_at", "id")
        total = queryset.count()
        self.stdout.write(f"Processing workshop records: {total}")

        for idx, record in enumerate(queryset, 1):
            email = (record.email or "").strip()
            status = record.status or ""

            if not email:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] workshop id={record.id} email=<empty> status='{status}' reason=missing email"
                    )
                )
                skipped += 1
                continue

            action_name, action_fn = self._resolve_workshop_action(status)
            if action_fn is None:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] workshop id={record.id} email={email} status='{status}' reason=no mapping"
                    )
                )
                skipped += 1
                continue

            if dry_run:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] workshop id={record.id} email={email} status='{status}' action={action_name} dry-run"
                    )
                )
                skipped += 1
                continue

            try:
                ok = bool(action_fn(record))
                if ok:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"SENT [{idx}/{total}] workshop id={record.id} email={email} status='{status}' action={action_name}"
                        )
                    )
                    sent += 1
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f"FAILED [{idx}/{total}] workshop id={record.id} email={email} status='{status}' action={action_name}"
                        )
                    )
                    failed += 1
            except Exception:
                logger.exception("Workshop onboarding send failed for id=%s email=%s", record.id, email)
                self.stdout.write(
                    self.style.ERROR(
                        f"FAILED [{idx}/{total}] workshop id={record.id} email={email} status='{status}' action={action_name} exception"
                    )
                )
                failed += 1

            time.sleep(1)

        return sent, failed, skipped

    def _process_conference(self, dry_run):
        sent = 0
        failed = 0
        skipped = 0

        queryset = Registration.objects.all().order_by("created_at", "id")
        total = queryset.count()
        self.stdout.write(f"Processing conference records: {total}")

        for idx, record in enumerate(queryset, 1):
            email = (record.email or "").strip()
            status = record.status or ""

            if not email:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] conference id={record.id} email=<empty> status='{status}' reason=missing email"
                    )
                )
                skipped += 1
                continue

            action_name, action_fn = self._resolve_conference_action(status)
            # If pending and include_pending flag set, treat as submission email
            include_pending = bool(self._include_pending) if hasattr(self, '_include_pending') else False
            if action_name == "conference_pending_skip" and include_pending:
                action_name = "conference_submission"
                from core.utils.email_utils import send_conference_submission_email
                action_fn = send_conference_submission_email

            if action_name == "conference_pending_skip":
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] conference id={record.id} email={email} status='{status}' reason=pending"
                    )
                )
                skipped += 1
                continue

            if action_fn is None:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] conference id={record.id} email={email} status='{status}' reason=no mapping"
                    )
                )
                skipped += 1
                continue

            if dry_run:
                self.stdout.write(
                    self.style.WARNING(
                        f"SKIPPED [{idx}/{total}] conference id={record.id} email={email} status='{status}' action={action_name} dry-run"
                    )
                )
                skipped += 1
                continue

            try:
                ok = bool(action_fn(record))
                if ok:
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"SENT [{idx}/{total}] conference id={record.id} email={email} status='{status}' action={action_name}"
                        )
                    )
                    sent += 1
                else:
                    self.stdout.write(
                        self.style.ERROR(
                            f"FAILED [{idx}/{total}] conference id={record.id} email={email} status='{status}' action={action_name}"
                        )
                    )
                    failed += 1
            except Exception:
                logger.exception("Conference onboarding send failed for id=%s email=%s", record.id, email)
                self.stdout.write(
                    self.style.ERROR(
                        f"FAILED [{idx}/{total}] conference id={record.id} email={email} status='{status}' action={action_name} exception"
                    )
                )
                failed += 1

            time.sleep(1)

        return sent, failed, skipped

    def handle(self, *args, **options):
        dry_run = bool(options.get("dry_run"))
        record_type = options.get("type", "all")
        # store include_pending flag on instance for use during processing
        self._include_pending = bool(options.get("include_pending", False))

        self.stdout.write(f"Mode: {'DRY-RUN' if dry_run else 'LIVE'} | Type: {record_type}")
        self._print_discovered_statuses()

        total_sent = 0
        total_failed = 0
        total_skipped = 0

        if record_type in {"workshop", "all"}:
            sent, failed, skipped = self._process_workshop(dry_run=dry_run)
            total_sent += sent
            total_failed += failed
            total_skipped += skipped

        if record_type in {"conference", "all"}:
            sent, failed, skipped = self._process_conference(dry_run=dry_run)
            total_sent += sent
            total_failed += failed
            total_skipped += skipped

        self.stdout.write(f"Sent: {total_sent} | Failed: {total_failed} | Skipped: {total_skipped}")
        self.stdout.write("Check logs/sheets_errors.log for failures")
