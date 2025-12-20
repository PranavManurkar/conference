# core/apps.py
from django.apps import AppConfig

class CoreConfig(AppConfig):
    name = "core"

    def ready(self):
        # import signals to register receivers
        from . import signals  # noqa
