"""
Registration models for 2D MatTech Global 2026 Conference.
This model mirrors the Supabase registrations table.
"""
from django.db import models
import uuid


class Registration(models.Model):
    """
    Registration model that connects to the existing Supabase 'registrations' table.
    """
    STATUS_CHOICES = [
        ('Under Process', 'Under Process'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    DELEGATE_TYPE_CHOICES = [
        ('UG/PG Student', 'UG/PG Student'),
        ('Research Scholar', 'Research Scholar'),
        ('Faculty', 'Faculty'),
        ('Industry', 'Industry'),
    ]

    REGISTRATION_PERIOD_CHOICES = [
        ('Early Bird', 'Early Bird'),
        ('Final', 'Final'),
    ]

    PARTICIPANT_REGION_CHOICES = [
        ('Indian', 'Indian'),
        ('SAARC', 'SAARC'),
        ('Non-SAARC', 'Non-SAARC'),
    ]

    PRESENTATION_PREFERENCE_CHOICES = [
        ('Oral', 'Oral'),
        ('Poster', 'Poster'),
        ('No Preference', 'No Preference'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)
    
    # Personal Information
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    institution_organization = models.CharField(max_length=255)
    designation = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100)
    
    # Delegate Information
    delegate_type = models.CharField(max_length=50, choices=DELEGATE_TYPE_CHOICES)
    registration_period = models.CharField(max_length=20, choices=REGISTRATION_PERIOD_CHOICES)
    participant_region = models.CharField(max_length=20, choices=PARTICIPANT_REGION_CHOICES)
    
    # Payment Information
    payment_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_reference_number = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    
    # Abstract Information
    abstract_title = models.CharField(max_length=500, blank=True, null=True)
    presentation_preference = models.CharField(
        max_length=20, 
        choices=PRESENTATION_PREFERENCE_CHOICES,
        blank=True, 
        null=True
    )
    
    # Status and Admin
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Under Process')
    admin_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'registrations'  # Use the existing Supabase table
        managed = False  # Don't let Django manage this table (it exists in Supabase)
        ordering = ['-created_at']
        verbose_name = 'Registration'
        verbose_name_plural = 'Registrations'

    def __str__(self):
        return f"{self.full_name} - {self.delegate_type} ({self.status})"
