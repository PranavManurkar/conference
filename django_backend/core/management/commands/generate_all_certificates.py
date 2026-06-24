"""
Pre-generate and cache certificates for all accepted registrations.

Usage:
  python3 manage.py generate_all_certificates           # generate all missing
  python3 manage.py generate_all_certificates --dry-run # list who would get one, no writes
  python3 manage.py generate_all_certificates --force   # regenerate even if cached
"""
from django.conf import settings
from django.core.management.base import BaseCommand

from core.models import Registration
from core.utils.certificate_utils import generate_certificate


class Command(BaseCommand):
    help = "Pre-generate and cache PNG certificates for all Accepted registrations."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would happen without writing any files.",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Regenerate even if a cached file already exists.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        force   = options["force"]

        registrations = Registration.objects.filter(status="Accepted")
        total = registrations.count()
        self.stdout.write(f"Found {total} Accepted registration(s).\n")

        generated = 0
        cached    = 0
        failed    = 0

        for reg in registrations:
            cache_path = settings.BASE_DIR / "certificates" / f"{reg.id}.png"

            if cache_path.exists() and not force:
                if dry_run:
                    self.stdout.write(f"[WOULD SKIP - CACHED] ID {reg.id} — {reg.full_name}")
                else:
                    self.stdout.write(f"[CACHED] ID {reg.id} — {reg.full_name}")
                cached += 1
                continue

            if dry_run:
                self.stdout.write(f"[WOULD GENERATE] ID {reg.id} — {reg.full_name}")
                generated += 1
                continue

            try:
                name      = reg.full_name
                institute = reg.institution_organization or "N/A"
                mode      = reg.presentation_type or "N/A"
                title     = reg.abstract_title or "N/A"

                png_bytes = generate_certificate(name, institute, mode, title)
                cache_path.parent.mkdir(parents=True, exist_ok=True)
                cache_path.write_bytes(png_bytes)
                self.stdout.write(f"[GENERATED] ID {reg.id} — {reg.full_name}")
                generated += 1
            except Exception as exc:
                self.stderr.write(f"[FAILED] ID {reg.id} — {reg.full_name} — {exc}")
                failed += 1

        prefix = "Would generate" if dry_run else "Summary"
        self.stdout.write(
            self.style.SUCCESS(
                f"\n{prefix}: {generated} generated, "
                f"{cached} already cached (skipped), "
                f"{failed} failed"
            )
        )
