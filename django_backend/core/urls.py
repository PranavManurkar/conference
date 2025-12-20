# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CheckByEmailView, AdminUpdateStatusView,register_view,RegistrationViewSet,LogoutView

router = DefaultRouter()
router.register(r"registrations", RegistrationViewSet, basename="registration")

urlpatterns = [
    path("", include(router.urls)),
    path("registrations/check-by-email/", CheckByEmailView.as_view(), name="check-by-email"),
    path("registrations/<int:pk>/admin-update-status/", AdminUpdateStatusView.as_view(), name="admin-update-status"),
    path("auth/register/", register_view, name="register"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
]
