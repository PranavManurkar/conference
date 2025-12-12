"""
Django Admin configuration for managing registrations.
Provides a powerful interface for reviewing and updating registration statuses.
"""
from django.contrib import admin
from django.utils.html import format_html
from django import forms
from .models import Registration


class RejectionForm(forms.Form):
    """Form for rejecting registrations with a required reason."""
    rejection_reason = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4, 'cols': 60}),
        label="Rejection Reason",
        help_text="This message will be shown to the participant explaining why their registration was rejected."
    )


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    """
    Admin interface for managing conference registrations.
    """
    list_display = [
        'full_name', 
        'email', 
        'delegate_type', 
        'participant_region',
        'payment_amount_display',
        'payment_status',
        'status_badge', 
        'created_at'
    ]
    
    list_filter = [
        'status', 
        'delegate_type', 
        'registration_period',
        'participant_region',
        'created_at'
    ]
    
    search_fields = [
        'full_name', 
        'email', 
        'phone', 
        'institution_organization',
        'payment_reference_number'
    ]
    
    readonly_fields = [
        'id',
        'user_id',
        'created_at', 
        'updated_at',
        'full_name',
        'email',
        'phone',
        'institution_organization',
        'designation',
        'country',
        'delegate_type',
        'registration_period',
        'participant_region',
        'payment_amount',
        'payment_reference_number',
        'payment_date',
        'abstract_title',
        'presentation_preference',
    ]
    
    fieldsets = (
        ('Personal Information', {
            'fields': (
                'full_name', 
                'email', 
                'phone', 
                'institution_organization',
                'designation',
                'country'
            )
        }),
        ('Delegate Information', {
            'fields': (
                'delegate_type',
                'registration_period',
                'participant_region',
            )
        }),
        ('Payment Information', {
            'fields': (
                'payment_amount',
                'payment_reference_number',
                'payment_date',
            )
        }),
        ('Abstract Submission', {
            'fields': (
                'abstract_title',
                'presentation_preference',
            ),
            'classes': ('collapse',),
        }),
        ('Verification Status', {
            'fields': (
                'status',
                'admin_notes',
            ),
            'description': 'Update the registration status. For rejections, the admin notes will be shown to the participant as the rejection reason.'
        }),
        ('Metadata', {
            'fields': (
                'id',
                'user_id',
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',),
        }),
    )
    
    actions = ['mark_accepted', 'mark_rejected_with_reason', 'mark_under_process']
    
    def status_badge(self, obj):
        """Display status as a colored badge."""
        colors = {
            'Under Process': '#fbbf24',  # Yellow
            'Accepted': '#22c55e',       # Green
            'Rejected': '#ef4444',       # Red
        }
        bg_colors = {
            'Under Process': '#fef3c7',
            'Accepted': '#dcfce7',
            'Rejected': '#fee2e2',
        }
        color = colors.get(obj.status, '#6b7280')
        bg = bg_colors.get(obj.status, '#f3f4f6')
        return format_html(
            '<span style="background-color: {}; color: {}; padding: 4px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 12px;">{}</span>',
            bg, color, obj.status
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def payment_amount_display(self, obj):
        """Display payment amount with currency."""
        if obj.participant_region == 'Indian':
            return f"₹{obj.payment_amount:,.0f}"
        return f"${obj.payment_amount:,.0f}"
    payment_amount_display.short_description = 'Amount'
    payment_amount_display.admin_order_field = 'payment_amount'
    
    def payment_status(self, obj):
        """Display payment verification status."""
        if obj.payment_reference_number:
            return format_html(
                '<span style="color: #22c55e; font-weight: 600;">✓ Submitted</span>'
            )
        return format_html(
            '<span style="color: #ef4444;">✗ Pending</span>'
        )
    payment_status.short_description = 'Payment'
    
    @admin.action(description='Mark selected registrations as Accepted')
    def mark_accepted(self, request, queryset):
        updated = queryset.update(status='Accepted')
        self.message_user(request, f'{updated} registration(s) marked as Accepted.')
    
    @admin.action(description='Reject selected registrations (with reason)')
    def mark_rejected_with_reason(self, request, queryset):
        from django.shortcuts import render
        from django.http import HttpResponseRedirect
        
        if 'apply' in request.POST:
            form = RejectionForm(request.POST)
            if form.is_valid():
                rejection_reason = form.cleaned_data['rejection_reason']
                updated = queryset.update(
                    status='Rejected',
                    admin_notes=rejection_reason
                )
                self.message_user(
                    request, 
                    f'{updated} registration(s) rejected with reason: "{rejection_reason[:50]}..."'
                )
                return HttpResponseRedirect(request.get_full_path())
        else:
            form = RejectionForm()
        
        return render(
            request,
            'admin/rejection_intermediate.html',
            context={
                'title': 'Reject Registrations',
                'registrations': queryset,
                'form': form,
                'opts': self.model._meta,
                'action_checkbox_name': admin.helpers.ACTION_CHECKBOX_NAME,
            }
        )
    
    @admin.action(description='Mark selected registrations as Under Process')
    def mark_under_process(self, request, queryset):
        updated = queryset.update(status='Under Process')
        self.message_user(request, f'{updated} registration(s) marked as Under Process.')
    
    def has_add_permission(self, request):
        """Disable adding registrations from admin (should be done via frontend)."""
        return False
    
    def has_delete_permission(self, request, obj=None):
        """Disable deleting registrations for safety."""
        return False


# Customize the admin site
admin.site.site_header = '2D MatTech Global 2026 - Conference Admin'
admin.site.site_title = '2D MatTech Admin'
admin.site.index_title = 'Registration Management'
