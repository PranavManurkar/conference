# core/signals.py
import logging
import threading
from django.dispatch import receiver
from django.db.models.signals import post_delete, post_save
from django.contrib.auth import get_user_model
from django.db import transaction, connection  # <-- Added connection

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

def _async_export_registration(instance_id):
    """Background thread to export without blocking the HTTP response/DB transaction."""
    try:
        from core.models import Registration
        from core.utils.sheets_utils import append_approved_user_to_sheet
        
        # STRICTLY DB READ: Fetching instance; no DB writes are performed
        instance = Registration.objects.get(id=instance_id)
        append_approved_user_to_sheet(instance)
    except Exception as e:
        logger.error(f"Async export failed for Registration {instance_id}: {e}")
    finally:
        # CRITICAL: Clean up thread's DB connection to prevent pool exhaustion
        connection.close()

def export_registration_to_sheet(sender, instance, created, **kwargs):
    from django.conf import settings

    if getattr(settings, 'GOOGLE_SHEETS_ID', None):
        # Wait for DB locks to release completely before executing network requests
        transaction.on_commit(lambda: threading.Thread(
            target=_async_export_registration, 
            args=(instance.id,)
        ).start())

# Use string reference to avoid AppRegistryNotReady and NameError on boot
post_save.connect(export_registration_to_sheet, sender='core.Registration')


def _async_export_workshop(instance_id):
    """Background thread to export workshop registration."""
    try:
        from core.models import WorkshopRegistration
        from core.utils.sheets_utils import append_workshop_to_google_sheet
        
        # STRICTLY DB READ: Fetching instance; no DB writes are performed
        instance = WorkshopRegistration.objects.get(id=instance_id)
        append_workshop_to_google_sheet(instance)
    except Exception as e:
        logger.error(f"Async export failed for Workshop {instance_id}: {e}")
    finally:
        # CRITICAL: Clean up thread's DB connection to prevent pool exhaustion
        connection.close()

def export_workshop_registration_to_sheet(sender, instance, created, **kwargs):
    from django.conf import settings

    if getattr(settings, 'GOOGLE_SHEETS_ID', None):
        transaction.on_commit(lambda: threading.Thread(
            target=_async_export_workshop, 
            args=(instance.id,)
        ).start())

# Use string reference to avoid AppRegistryNotReady and NameError on boot
post_save.connect(export_workshop_registration_to_sheet, sender='core.WorkshopRegistration')