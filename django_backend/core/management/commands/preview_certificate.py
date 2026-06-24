# TEMPORARY — DESIGN STAGE ONLY
# This command exists solely to quickly generate test certificates for visual review
# during the design iteration phase.  Remove or repurpose once the final visual
# design is confirmed and the production endpoint is built.
#
# Usage:
#   python manage.py preview_certificate
#   python manage.py preview_certificate --name "Dr. Ananya Sharma" \
#       --institute "IIT Bombay" --mode "Oral" --title "My Paper Title"

import datetime
import re
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from core.utils.certificate_utils import generate_certificate, TEMPLATE_PATH


class Command(BaseCommand):
    help = (
        "DESIGN-STAGE ONLY: Generate a preview certificate PNG and PDF "
        "for visual comparison against the reference image."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--name",
            default="Dr. Priya Raghunathan",
            help="Participant name to embed (default: 'Dr. Priya Raghunathan')",
        )
        parser.add_argument(
            "--institute",
            default="Indian Institute of Technology Indore",
            help="Institute name to embed",
        )
        parser.add_argument(
            "--mode",
            default=None,
            dest="presentation_mode",
            help="Presentation mode string, e.g. 'Oral', 'Poster'. Omit to show 'N/A'.",
        )
        parser.add_argument(
            "--title",
            default=None,
            help="Abstract/paper title. Omit to show 'N/A'.",
        )

    def handle(self, *args, **options):
        name              = options["name"]
        institute         = options["institute"]
        presentation_mode = options["presentation_mode"]
        title             = options["title"]

        # ── Sanity-check template exists ───────────────────────────────────
        if not TEMPLATE_PATH.exists():
            self.stderr.write(self.style.ERROR(
                f"\nTemplate image not found: {TEMPLATE_PATH}\n"
                "Place certificate_template.png in core/static/ first.\n"
            ))
            return

        self.stdout.write(f"Template:          {TEMPLATE_PATH}")
        self.stdout.write(f"Name:              {name!r}")
        self.stdout.write(f"Institute:         {institute!r}")
        self.stdout.write(f"Presentation mode: {presentation_mode!r}")
        self.stdout.write(f"Title:             {title!r}")
        self.stdout.write("")

        # ── Output directory ───────────────────────────────────────────────
        out_dir = Path(settings.BASE_DIR) / "certificate_previews"
        out_dir.mkdir(exist_ok=True)

        # Filename slug: timestamp + sanitised name
        ts    = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        slug  = re.sub(r"[^\w]", "_", name)[:30].strip("_")
        stem  = f"{ts}_{slug}"

        png_path = out_dir / f"{stem}.png"

        # ── Generate ───────────────────────────────────────────────────────
        self.stdout.write("Generating…")
        try:
            png_bytes = generate_certificate(
                name=name,
                institute=institute,
                presentation_mode=presentation_mode,
                title=title,
            )
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"Generation failed: {exc}"))
            raise

        png_path.write_bytes(png_bytes)

        self.stdout.write(self.style.SUCCESS("\nDone! Output file:"))
        self.stdout.write(f"  PNG -> {png_path}")
