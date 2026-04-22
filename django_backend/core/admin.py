# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Registration, WorkshopRegistration

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "is_staff", "is_mentor")

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "status", "created_at")
    list_filter = ("status", "participant_region", "delegate_type",'accompanying_persons')
    search_fields = ("full_name", "email", "transaction_id")
    readonly_fields = ("created_at",)


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

    def mark_approved_for_payment(self, request, queryset):
        for registration in queryset:
            registration.status = WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT
            registration.save(update_fields=["status", "updated_at"])
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
    mark_accepted.short_description = "Accept selected workshop registrations"
