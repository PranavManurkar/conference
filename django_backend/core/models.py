# core/models.py
import logging
import secrets
from decimal import Decimal

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.mail import send_mail
from django.db import models


logger = logging.getLogger(__name__)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)   # unique email for login
    is_mentor = models.BooleanField(default=False)

    def __str__(self):
        return self.email or self.username


class Registration(models.Model):
    STATUS_UNDER = "Under Process"
    STATUS_ACCEPTED = "Accepted"
    STATUS_REJECTED = "Rejected"

    PRESENTATION_ORAL = "oral"
    PRESENTATION_POSTER = "poster"
    PRESENTATION_THESIS = "thesis"

    PRESENTATION_CHOICES = [
        (PRESENTATION_ORAL, "Oral"),
        (PRESENTATION_POSTER, "Poster"),
        (PRESENTATION_THESIS, "Thesis"),
    ]

    STATUS_CHOICES = [
        (STATUS_UNDER, "Under Process"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="registrations")
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    is_presenter = models.BooleanField(default=False)
    abstract_id = models.CharField(max_length=255, null=True, blank=True)
    cmt_id = models.CharField(max_length=255, null=True, blank=True)
    poster_presentation = models.BooleanField(default=False)
    oral_presentation = models.BooleanField(default=False)
    presentation_type = models.CharField(max_length=20, choices=PRESENTATION_CHOICES, null=True, blank=True)
    institution_organization = models.CharField(max_length=255, blank=True)
    designation = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    delegate_type = models.CharField(max_length=100, blank=True)
    registration_period = models.CharField(max_length=100, blank=True)
    participant_region = models.CharField(max_length=100, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    transaction_screenshot = models.ImageField(upload_to="conference_transactions/", null=True, blank=True)
    payment_date = models.DateField(null=True, blank=True)
    abstract_title = models.CharField(max_length=500, null=True, blank=True)
    accompanying_persons = models.IntegerField(default=0)
    presentation_preference = models.CharField(max_length=100, null=True, blank=True)
    food_preference = models.CharField(max_length=50, blank=True, default="")
    beverage_choice = models.CharField(max_length=50, blank=True, default="")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=STATUS_UNDER)
    admin_notes = models.TextField(null=True, blank=True)
    certificate_override = models.BooleanField(
        default=False,
        help_text=(
            "⚠️ TESTING ONLY — set to True only for test registrations. "
            "Always reset to False after testing. Never enable for real participants."
        ),
    )
    certificate_blob = models.BinaryField(
        null=True,
        blank=True,
        editable=False,
        help_text="Pre-generated certificate PNG bytes."
    )
    certificate_template_hash = models.CharField(
        max_length=32,
        null=True,
        blank=True,
        editable=False,
        help_text="MD5 hash of template at generation time."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.status}"


class WorkshopRegistration(models.Model):
    WORKSHOP_1 = 1
    WORKSHOP_2 = 2

    WORKSHOP_CHOICES = [
        (WORKSHOP_1, "Workshop 1 - XRD & XRF Characterization"),
        (WORKSHOP_2, "Workshop 2 - Synchrotron-Based Techniques for Materials Characterization"),
    ]

    PARTICIPANT_STUDENT = "student"
    PARTICIPANT_OTHER = "other"

    PARTICIPANT_CHOICES = [
        (PARTICIPANT_STUDENT, "Student - INR 1000"),
        (PARTICIPANT_OTHER, "Others - INR 2000"),
    ]

    STATUS_UNDER_PROCESS = "Under Process"
    STATUS_APPROVED_FOR_PAYMENT = "Approved for Payment"
    STATUS_PAYMENT_SUBMITTED = "Payment Submitted"
    STATUS_ACCEPTED = "Accepted"
    STATUS_REJECTED = "Rejected"

    STATUS_CHOICES = [
        (STATUS_UNDER_PROCESS, "Under Process"),
        (STATUS_APPROVED_FOR_PAYMENT, "Approved for Payment"),
        (STATUS_PAYMENT_SUBMITTED, "Payment Submitted"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    ]

    workshop_id = models.PositiveIntegerField(choices=WORKSHOP_CHOICES, default=WORKSHOP_1)
    workshop_title = models.CharField(max_length=255, default="Workshop 1 - XRD & XRF Characterization")
    registration_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    institution = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, blank=True)
    participant_type = models.CharField(max_length=20, choices=PARTICIPANT_CHOICES, default=PARTICIPANT_STUDENT)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("1000.00"))
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    transaction_screenshot = models.ImageField(upload_to="workshop_transactions/", null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=STATUS_UNDER_PROCESS)
    admin_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["workshop_id", "email"], name="unique_workshop_registration_email")
        ]

    def __str__(self):
        return f"{self.full_name} ({self.email}) - Workshop {self.workshop_id} - {self.status}"

    @property
    def registration_reference(self):
        if self.registration_code:
            return self.registration_code
        if self.pk:
            return f"WS{self.workshop_id}-{self.pk}"
        return ""

    def _generate_registration_code(self):
        # Keep legacy WS{workshop_id}-{pk} references intact by avoiding pk collisions.
        max_attempts = 25
        for _ in range(max_attempts):
            token = secrets.randbelow(100_000_000)
            code = f"WS{self.workshop_id}-{token:08d}"

            if WorkshopRegistration.objects.filter(registration_code__iexact=code).exists():
                continue

            # Avoid conflicts with legacy references like WS1-1, WS1-39, etc.
            if WorkshopRegistration.objects.filter(pk=token, workshop_id=self.workshop_id, registration_code__isnull=True).exists():
                continue

            return code

        raise ValueError("Could not generate a unique workshop registration code.")

    @classmethod
    def get_workshop_title(cls, workshop_id):
        return dict(cls.WORKSHOP_CHOICES).get(workshop_id, "Workshop")

    def calculate_fee_amount(self):
        if self.participant_type == self.PARTICIPANT_STUDENT:
            return Decimal("1000.00")
        return Decimal("2000.00")

    def _send_status_email(self, previous_status=None):
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@tdmtg.iiti.ac.in")
        subject = None
        body = None

        if previous_status is None:
            subject = "Workshop registration received"
            body = (
                f"Dear {self.full_name},\n\n"
                f"We have received your registration for {self.workshop_title}.\n"
                f"Your registration reference is {self.registration_reference}.\n"
                f"Current status: {self.status}.\n\n"
                "Your application is under review. We will email you again once a decision is made.\n\n"
                "Regards,\nWorkshop Committee"
            )
        elif self.status == self.STATUS_APPROVED_FOR_PAYMENT:
            subject = "Workshop registration approved for payment"
            body = (
                f"Dear {self.full_name},\n\n"
                f"Your registration for {self.workshop_title} has been approved for payment.\n"
                f"Registration reference: {self.registration_reference}\n"
                f"Fee payable: INR {self.fee_amount}\n\n"
                "Please visit your workshop dashboard and submit your transaction ID after payment.\n"
                "The admin will verify the transaction and mark your registration accordingly.\n\n"
                "Regards,\nWorkshop Committee"
            )
        elif self.status == self.STATUS_PAYMENT_SUBMITTED:
            subject = "Workshop payment details received"
            body = (
                f"Dear {self.full_name},\n\n"
                f"We have received your transaction ID for {self.workshop_title}.\n"
                f"Registration reference: {self.registration_reference}\n"
                f"Transaction ID: {self.transaction_id or 'N/A'}\n\n"
                "Your payment is now awaiting final verification by the admin team.\n\n"
                "Regards,\nWorkshop Committee"
            )
        elif self.status == self.STATUS_ACCEPTED:
            subject = "Workshop registration confirmed"
            body = (
                f"Dear {self.full_name},\n\n"
                f"Your registration for {self.workshop_title} has been confirmed.\n"
                f"Registration reference: {self.registration_reference}\n\n"
                "We look forward to seeing you at the workshop.\n\n"
                "Regards,\nWorkshop Committee"
            )
        elif self.status == self.STATUS_REJECTED:
            subject = "Workshop registration update"
            body = (
                f"Dear {self.full_name},\n\n"
                f"We are unable to confirm your registration for {self.workshop_title}.\n"
                f"Registration reference: {self.registration_reference}\n\n"
                "If you need clarification, please contact the workshop team.\n\n"
                "Regards,\nWorkshop Committee"
            )

        if subject and body:
            try:
                send_mail(subject, body, from_email, [self.email], fail_silently=False)
            except Exception:
                logger.exception("Failed to send workshop registration email for %s", self.email)

    def save(self, *args, **kwargs):
        previous_status = None
        if self.pk:
            previous_status = type(self).objects.filter(pk=self.pk).values_list("status", flat=True).first()

        self.workshop_title = self.get_workshop_title(self.workshop_id)

        self.fee_amount = self.calculate_fee_amount()

        # Only generate new-style codes for brand new registrations.
        if self.pk is None and not self.registration_code:
            self.registration_code = self._generate_registration_code()
        super().save(*args, **kwargs)
