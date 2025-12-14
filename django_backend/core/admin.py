# core/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Registration

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("username", "email", "is_staff", "is_mentor")

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "status", "created_at")
    list_filter = ("status", "participant_region", "delegate_type")
    search_fields = ("full_name", "email", "transaction_id")
    readonly_fields = ("created_at",)
