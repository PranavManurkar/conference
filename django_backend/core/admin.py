# core/admin.py
import logging
from django.contrib import admin
from django.contrib import messages
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from .models import CustomUser, Registration, WorkshopRegistration
from core.utils.sheets_utils import append_approved_user_to_sheet
from core.utils.email_utils import (
    send_conference_approval_email,
    send_conference_rejection_email,
    send_workshop_registration_email,
    send_workshop_payment_confirmation_email,
    send_workshop_payment_reminder_email,
)


logger = logging.getLogger(__name__)


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "is_staff", "is_mentor")

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "status", "created_at")
    list_filter = ("status", "participant_region", "delegate_type",'accompanying_persons')
    search_fields = ("full_name", "email", "transaction_id", "cmt_id", "abstract_id")
    readonly_fields = ("created_at",)
    actions = ["mark_accepted", "mark_rejected", "mark_under_process"]

    def save_model(self, request, obj, form, change):
        previous_status = None
        if change and obj.pk:
            previous_status = Registration.objects.filter(pk=obj.pk).values_list("status", flat=True).first()

        super().save_model(request, obj, form, change)

        if previous_status != obj.status:
            if obj.status == Registration.STATUS_ACCEPTED:
                try: send_conference_approval_email(obj)
                except Exception as e: logger.error("Approval email failed: %s", e)
            elif obj.status == Registration.STATUS_REJECTED:
                try: send_conference_rejection_email(obj)
                except Exception as e: logger.error("Rejection email failed: %s", e)
    
    def has_change_permission(self, request, obj=None):
        """Only main superuser can modify registration records."""
        return request.user.is_superuser
    
    def get_actions(self, request):
        """Only main superuser sees approval/rejection actions."""
        actions = super().get_actions(request)
        if not request.user.is_superuser:
            actions.clear()
        return actions
    
    @transaction.atomic
    def mark_accepted(self, request, queryset):
        """
        Approve registrations and export to Google Sheet.
        Sheet export failures do NOT block approval.
        """
        if not request.user.is_superuser:
            messages.error(
                request,
                "Only the main administrator can approve or reject registrations."
            )
            return
        
        updated_count = 0
        export_count = 0
        
        for registration in queryset:
            # Update status first
            registration.status = Registration.STATUS_ACCEPTED
            registration.save(update_fields=["status"])
            updated_count += 1
            
            # Attempt sheet export (non-blocking) via signal
            try:
                if append_approved_user_to_sheet(registration):
                    export_count += 1
                    logger.info(f"Registration {registration.id} approved and exported successfully")
                else:
                    logger.warning(f"Registration {registration.id} approved but export failed (check logs)")
                    
            except Exception as e:
                # Log error but don't raise - approval must succeed even if export fails
                logger.error(f"Unexpected error exporting registration {registration.id}: {str(e)}")
            try: send_conference_approval_email(registration)
            except Exception as e: logger.error("Approval email failed: %s", e)
        
        self.message_user(request, f"{updated_count} registration(s) marked as Accepted. {export_count} successfully exported to sheet.")
    
    mark_accepted.short_description = "Mark selected registrations as Accepted and export to Google Sheet"
    
    @transaction.atomic
    def mark_rejected(self, request, queryset):
        """Reject registrations and export to Google Sheet."""
        if not request.user.is_superuser:
            messages.error(
                request,
                "Only the main administrator can approve or reject registrations."
            )
            return
        
        updated_count = 0
        export_count = 0
        
        for registration in queryset:
            registration.status = Registration.STATUS_REJECTED
            registration.save(update_fields=["status"])
            updated_count += 1
            
            # Attempt sheet export (non-blocking) via signal
            try:
                if append_approved_user_to_sheet(registration):
                    export_count += 1
                    logger.info(f"Registration {registration.id} rejected and exported successfully")
                else:
                    logger.warning(f"Registration {registration.id} rejected but export failed (check logs)")
            except Exception as e:
                logger.error(f"Unexpected error exporting rejected registration {registration.id}: {str(e)}")
            try: send_conference_rejection_email(registration)
            except Exception as e: logger.error("Rejection email failed: %s", e)
        
        self.message_user(request, f"{updated_count} registration(s) marked as Rejected. {export_count} successfully exported to sheet.")
    
    mark_rejected.short_description = "Mark selected registrations as Rejected and export to Google Sheet"
    
    @transaction.atomic
    def mark_under_process(self, request, queryset):
        """Mark registrations as Under Process and export to Google Sheet."""
        if not request.user.is_superuser:
            messages.error(
                request,
                "Only the main administrator can approve or reject registrations."
            )
            return
        
        updated_count = 0
        export_count = 0
        
        for registration in queryset:
            registration.status = Registration.STATUS_UNDER
            registration.save(update_fields=["status"])
            updated_count += 1
            
            # Attempt sheet export (non-blocking) via signal
            try:
                if append_approved_user_to_sheet(registration):
                    export_count += 1
                    logger.info(f"Registration {registration.id} marked Under Process and exported successfully")
                else:
                    logger.warning(f"Registration {registration.id} marked Under Process but export failed (check logs)")
            except Exception as e:
                logger.error(f"Unexpected error exporting Under Process registration {registration.id}: {str(e)}")
        
        self.message_user(request, f"{updated_count} registration(s) marked as Under Process. {export_count} successfully exported to sheet.")
    
    mark_under_process.short_description = "Mark selected registrations as Under Process and export to Google Sheet"


@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "registration_reference",
        "full_name",
        "email",
        "participant_type",
        "fee_amount",
        "status",
        "transaction_id",
        "created_at",
    )
    list_filter = ("status", "participant_type", "workshop_id")
    search_fields = ("full_name", "email", "transaction_id")
    readonly_fields = ("fee_amount", "created_at", "updated_at")
    actions = ["mark_approved_for_payment", "mark_rejected", "mark_accepted"]

    def save_model(self, request, obj, form, change):
        previous_status = None
        if change and obj.pk:
            previous_status = WorkshopRegistration.objects.filter(pk=obj.pk).values_list("status", flat=True).first()

        super().save_model(request, obj, form, change)

        if not change:
            try: send_workshop_registration_email(obj)
            except Exception as e: logger.error("Workshop reg email failed: %s", e)

        if previous_status != obj.status:
            if obj.status == WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT:
                try: send_workshop_payment_reminder_email(obj)
                except Exception as e: logger.error("Payment reminder email failed: %s", e)
            elif obj.status == WorkshopRegistration.STATUS_ACCEPTED:
                try: send_workshop_payment_confirmation_email(obj)
                except Exception as e: logger.error("Payment confirmation email failed: %s", e)

    def mark_approved_for_payment(self, request, queryset):
        for registration in queryset:
            registration.status = WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT
            registration.save(update_fields=["status", "updated_at"])
            try: send_workshop_payment_reminder_email(registration)
            except Exception as e: logger.error("Payment reminder email failed: %s", e)
    mark_approved_for_payment.short_description = "Mark selected workshop registrations as approved for payment"

    def mark_rejected(self, request, queryset):
        for registration in queryset:
            registration.status = WorkshopRegistration.STATUS_REJECTED
            registration.save(update_fields=["status", "updated_at"])
    mark_rejected.short_description = "Reject selected workshop registrations"

    def mark_accepted(self, request, queryset):
        for registration in queryset:
            registration.status = WorkshopRegistration.STATUS_ACCEPTED
            registration.save(update_fields=["status", "updated_at"])
            try: send_workshop_payment_confirmation_email(registration)
            except Exception as e: logger.error("Payment confirmation email failed: %s", e)
    mark_accepted.short_description = "Accept selected workshop registrations"
