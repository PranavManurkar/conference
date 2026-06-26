from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import Registration
from core.utils.certificate_utils import generate_certificate, get_template_hash
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Pre-generate certificates for all eligible registrations."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force", action="store_true",
            help="Regenerate even if blob is already fresh.",
        )
        parser.add_argument(
            "--id", type=int, dest="reg_id",
            help="Generate for a single registration ID only.",
        )

    def handle(self, *args, **options):
        force  = options["force"]
        reg_id = options.get("reg_id")

        current_hash = get_template_hash()
        self.stdout.write(f"Template hash: {current_hash[:12]}…")

        qs = Registration.objects.filter(status="Accepted")
        if reg_id:
            qs = qs.filter(id=reg_id)
        if not force:
            qs = qs.exclude(
                certificate_blob__isnull=False,
                certificate_template_hash=current_hash,
            )

        total = qs.count()
        self.stdout.write(f"Found {total} registration(s) to process.")

        success = failed = 0
        for reg in qs.iterator():
            try:
                png_bytes = generate_certificate(
                    name=reg.full_name,
                    institute=reg.institution_organization or None,
                    presentation_mode=reg.presentation_type or None,
                    title=reg.abstract_title or None,
                )
                with transaction.atomic():
                    reg.certificate_blob = png_bytes
                    reg.certificate_template_hash = current_hash
                    reg.save(update_fields=[
                        "certificate_blob",
                        "certificate_template_hash",
                    ])
                success += 1
                self.stdout.write(f"  ✓ [{reg.id}] {reg.full_name}")
            except Exception as e:
                failed += 1
                self.stderr.write(f"  ✗ [{reg.id}] {reg.full_name} — {e}")

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. {success} generated, {failed} failed out of {total}."
        ))
