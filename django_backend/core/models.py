# core/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)   # unique email for login
    is_mentor = models.BooleanField(default=False)

    def __str__(self):
        return self.email or self.username


class Registration(models.Model):
    STATUS_UNDER = "Under Process"
    STATUS_ACCEPTED = "Accepted"
    STATUS_REJECTED = "Rejected"

    STATUS_CHOICES = [
        (STATUS_UNDER, "Under Process"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="registrations")
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    institution_organization = models.CharField(max_length=255, blank=True)
    designation = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    delegate_type = models.CharField(max_length=100, blank=True)
    registration_period = models.CharField(max_length=100, blank=True)
    participant_region = models.CharField(max_length=100, blank=True)
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    payment_date = models.DateField(null=True, blank=True)
    abstract_title = models.CharField(max_length=500, null=True, blank=True)
    presentation_preference = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=STATUS_UNDER)
    admin_notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.email}) - {self.status}"
