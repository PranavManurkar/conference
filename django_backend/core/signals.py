# core/signals.py
import logging
from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

User = get_user_model()
logger = logging.getLogger(__name__)

@receiver(post_delete, sender=User)
def blacklist_tokens_on_user_delete(sender, instance, **kwargs):
    # avoid raising — just log any problems
    try:
        tokens = OutstandingToken.objects.filter(user=instance)
        for t in tokens:
            # create BlacklistedToken if not exists
            BlacklistedToken.objects.get_or_create(token=t)
        logger.info("Blacklisted %d tokens for deleted user id=%s", tokens.count(), instance.pk)
    except Exception:
        logger.exception("Error blacklisting tokens for deleted user id=%s", instance.pk)

# ============================================================================
# GOOGLE SHEETS INTEGRATION - Auto-export on registration state changes
# ============================================================================

def export_registration_to_sheet(sender, instance, created, **kwargs):
    """
    Signal handler: Auto-export registrations to Google Sheets on creation
    or status changes. Handles ALL statuses (Under Process, Accepted, Rejected).
    
    This ensures complete audit trail in Google Sheets.
    """
    # Check if this is a Registration model
    from .models import Registration
    if sender != Registration:
        return
    
    try:
        # Skip if no Google Sheets ID configured
        from django.conf import settings
        if not settings.GOOGLE_SHEETS_ID:
            logger.debug("GOOGLE_SHEETS_ID not configured. Skipping export.")
            return
        
        from core.utils.sheets_utils import append_approved_user_to_sheet
        
        # Export to Google Sheet (all statuses tracked)
        if append_approved_user_to_sheet(instance):
            logger.info(
                f"✅ Registration {instance.id} (Status: {instance.status}) "
                f"exported to Google Sheet successfully"
            )
        else:
            logger.warning(
                f"⚠️  Registration {instance.id} (Status: {instance.status}) "
                f"export failed (check logs for details)"
            )
            
    except Exception as e:
        # Log error but don't raise - must not block registration save
        logger.error(
            f"❌ Unexpected error exporting registration {instance.id}: {str(e)}",
            exc_info=True
        )

# Register the signal
from django.db.models.signals import post_save
from .models import Registration
post_save.connect(export_registration_to_sheet, sender=Registration)
