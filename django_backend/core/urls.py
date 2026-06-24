# core/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CheckByEmailView,
    AdminUpdateStatusView,
    register_view,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    RegistrationViewSet,
    LogoutView,
    WorkshopRegistrationCreateView,
    WorkshopRegistrationLookupView,
    WorkshopTransactionSubmitView,
    MyCertificateView,
    ConferenceInfoView,
)

router = DefaultRouter()
router.register(r"registrations", RegistrationViewSet, basename="registration")

urlpatterns = [
    path("", include(router.urls)),
    path("registrations/check-by-email/", CheckByEmailView.as_view(), name="check-by-email"),
    path("registrations/<int:pk>/admin-update-status/", AdminUpdateStatusView.as_view(), name="admin-update-status"),
    path("workshop-registrations/", WorkshopRegistrationCreateView.as_view(), name="workshop-registration-create"),
    path("workshop-registrations/lookup/", WorkshopRegistrationLookupView.as_view(), name="workshop-registration-lookup"),
    path("workshop-registrations/submit-transaction/", WorkshopTransactionSubmitView.as_view(), name="workshop-transaction-submit"),
    path("auth/register/", register_view, name="register"),
    path("auth/password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("certificates/my-certificate/", MyCertificateView.as_view(), name="my-certificate"),
    path("conference-info/", ConferenceInfoView.as_view(), name="conference-info"),
]
