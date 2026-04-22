# Generated manually for the workshop-specific registration flow.
from decimal import Decimal

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_registration_accompanying_persons"),
    ]

    operations = [
        migrations.CreateModel(
            name="WorkshopRegistration",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "workshop_id",
                    models.PositiveIntegerField(
                        choices=[(1, "Workshop 1 - XRD & XRF Characterization")],
                        default=1,
                    ),
                ),
                (
                    "workshop_title",
                    models.CharField(default="Workshop 1 - XRD & XRF Characterization", max_length=255),
                ),
                ("full_name", models.CharField(max_length=255)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(max_length=50)),
                ("institution", models.CharField(max_length=255)),
                ("designation", models.CharField(blank=True, max_length=255)),
                (
                    "participant_type",
                    models.CharField(
                        choices=[("student", "Student - INR 1000"), ("other", "Others - INR 2000")],
                        default="student",
                        max_length=20,
                    ),
                ),
                ("fee_amount", models.DecimalField(decimal_places=2, default=Decimal("1000.00"), max_digits=10)),
                ("transaction_id", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("Under Process", "Under Process"),
                            ("Approved for Payment", "Approved for Payment"),
                            ("Payment Submitted", "Payment Submitted"),
                            ("Accepted", "Accepted"),
                            ("Rejected", "Rejected"),
                        ],
                        default="Under Process",
                        max_length=50,
                    ),
                ),
                ("admin_notes", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="workshopregistration",
            constraint=models.UniqueConstraint(fields=("workshop_id", "email"), name="unique_workshop_registration_email"),
        ),
    ]
