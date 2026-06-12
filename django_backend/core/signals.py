# core/signals.py
import logging
import queue
import threading

from django.contrib.auth import get_user_model
from django.db import connection, transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

User = get_user_model()
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Auth: blacklist tokens when a user is deleted
# ---------------------------------------------------------------------------

@receiver(post_delete, sender=User)
def blacklist_tokens_on_user_delete(sender, instance, **kwargs):
    try:
        tokens = OutstandingToken.objects.filter(user=instance)
        for t in tokens:
            BlacklistedToken.objects.get_or_create(token=t)
        logger.info("Blacklisted %d tokens for deleted user id=%s", tokens.count(), instance.pk)
    except Exception:
        logger.exception("Error blacklisting tokens for deleted user id=%s", instance.pk)


# ---------------------------------------------------------------------------
# Serialized sheet-sync workers (one queue per sheet tab)
#
# WHY: spawning a raw thread per save() causes a race:
#   Thread A and Thread B both call get_existing_registration_ids() before
#   either appends, so both see "ID not found" and both append — duplicate row.
#
# FIX: a single daemon worker thread per tab drains a FIFO queue, so the
#   read-existing-IDs → append-or-update sequence for a given tab is never
#   interleaved with another sync job for that same tab.
# ---------------------------------------------------------------------------

class _SheetSyncWorker:
    """
    Wraps a Queue + a single background daemon thread.
    Callers enqueue (func, args) tuples; the worker processes them serially.
    """
    def __init__(self, name: str):
        self._queue: queue.Queue = queue.Queue()
        self._thread = threading.Thread(target=self._run, name=name, daemon=True)
        self._thread.start()

    def enqueue(self, func, *args):
        self._queue.put((func, args))

    def _run(self):
        while True:
            func, args = self._queue.get()
            try:
                func(*args)
            except Exception:
                logger.exception("Sheet sync worker unhandled error")
            finally:
                # Always close this thread's DB connection after each job so
                # Django does not exhaust the connection pool.
                try:
                    connection.close()
                except Exception:
                    pass
                self._queue.task_done()


# One worker per sheet tab — module-level singletons, created on first import.
_registration_worker = _SheetSyncWorker("sheet-sync-approvals")
_workshop_worker = _SheetSyncWorker("sheet-sync-workshop")


# ---------------------------------------------------------------------------
# Registration sync
# ---------------------------------------------------------------------------

def _sync_registration(instance_id: int):
    """Executed serially by _registration_worker."""
    from core.models import Registration
    from core.utils.sheets_utils import append_approved_user_to_sheet

    try:
        instance = Registration.objects.get(id=instance_id)
        append_approved_user_to_sheet(instance)
    except Registration.DoesNotExist:
        logger.warning("Registration %s no longer exists; skipping sheet sync", instance_id)
    except Exception:
        logger.exception("Sheet sync failed for Registration %s", instance_id)


def export_registration_to_sheet(sender, instance, created, **kwargs):
    from django.conf import settings

    if getattr(settings, "GOOGLE_SHEETS_ID", None):
        # Enqueue AFTER the DB transaction commits so the worker always reads
        # the freshly persisted state.
        transaction.on_commit(
            lambda: _registration_worker.enqueue(_sync_registration, instance.id)
        )


post_save.connect(export_registration_to_sheet, sender="core.Registration")


# ---------------------------------------------------------------------------
# WorkshopRegistration sync
# ---------------------------------------------------------------------------

def _sync_workshop(instance_id: int):
    """Executed serially by _workshop_worker."""
    from core.models import WorkshopRegistration
    from core.utils.sheets_utils import append_workshop_to_google_sheet

    try:
        instance = WorkshopRegistration.objects.get(id=instance_id)
        append_workshop_to_google_sheet(instance)
    except WorkshopRegistration.DoesNotExist:
        logger.warning("WorkshopRegistration %s no longer exists; skipping sheet sync", instance_id)
    except Exception:
        logger.exception("Sheet sync failed for WorkshopRegistration %s", instance_id)


def export_workshop_registration_to_sheet(sender, instance, created, **kwargs):
    from django.conf import settings

    if getattr(settings, "GOOGLE_SHEETS_ID", None):
        transaction.on_commit(
            lambda: _workshop_worker.enqueue(_sync_workshop, instance.id)
        )


post_save.connect(export_workshop_registration_to_sheet, sender="core.WorkshopRegistration")
