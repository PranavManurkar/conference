# core/signals.py
import logging
from django.dispatch import receiver
from django.db.models.signals import post_delete
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
