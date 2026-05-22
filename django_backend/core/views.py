# core/views.py
import logging

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Registration, WorkshopRegistration
from .serializers import (
    RegisterSerializer,
    RegistrationSerializer,
    EmailTokenObtainPairSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    WorkshopRegistrationSerializer,
)
from core.utils.email_utils import send_conference_submission_email, send_workshop_registration_email
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.views import APIView
from .throttles import WorkshopLookupThrottle, WorkshopSubmitThrottle

User = get_user_model()
logger = logging.getLogger(__name__)

class EmailTokenObtainPairView(TokenViewBase):
    serializer_class = EmailTokenObtainPairSerializer

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_view(request):
    """
    Create a user and immediately return access+refresh tokens.
    """
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    # ---> UPDATED: Use the custom serializer method to generate tokens
    # This ensures the 'email' claim is added to the token payload immediately
    refresh = EmailTokenObtainPairSerializer.get_token(user)

    data = {
        "user": {
            "id": user.id,
            "email": user.email,
        },
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }
    return Response(data, status=status.HTTP_201_CREATED)


def get_frontend_base_url(request):
    base_url = getattr(settings, "FRONTEND_BASE_URL", "").strip()
    if base_url:
        return base_url.rstrip("/")
    if getattr(settings, "DEBUG", False):
        return "http://localhost:3000"
    if request is not None:
        return request.build_absolute_uri("/").rstrip("/")
    return ""


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        form = PasswordResetForm({"email": email})

        if form.is_valid():
            frontend_base_url = get_frontend_base_url(request)
            reset_url_base = f"{frontend_base_url}/auth/reset-password" if frontend_base_url else "/auth/reset-password"

            form.save(
                request=request,
                use_https=request.is_secure(),
                from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
                subject_template_name="core/emails/password_reset_subject.txt",
                email_template_name="core/emails/password_reset_email.txt",
                html_email_template_name="core/emails/password_reset_email.html",
                extra_email_context={
                    "reset_url_base": reset_url_base,
                    "support_email": getattr(settings, "CONFERENCE_CONTACT_EMAIL", "contact@conference.com"),
                },
            )

        return Response(
            {"detail": "If an account exists, a reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow access if the user is the owner (registration.user) or is staff.
    """
    def has_object_permission(self, request, view, obj):
        return request.user and (request.user.is_staff or obj.user == request.user)

# public-ish endpoint the frontend uses: check-by-email but only returns the registration if it belongs to the current user (or staff)
class CheckByEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        email = request.query_params.get("email")
        if not email:
            return Response({"detail": "email query param required"}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_staff:
            reg = Registration.objects.filter(email__iexact=email).first()
        else:
            reg = Registration.objects.filter(email__iexact=email, user=request.user).first()

        if not reg:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RegistrationSerializer(reg)
        return Response(serializer.data)

# Admin-only endpoint to change status and admin_notes
class AdminUpdateStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        reg = get_object_or_404(Registration, pk=pk)
        status_value = request.data.get("status")
        admin_notes = request.data.get("admin_notes", "")
        
        if status_value not in dict(Registration.STATUS_CHOICES):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            
        reg.status = status_value
        reg.admin_notes = admin_notes
        reg.save()
        return Response(RegistrationSerializer(reg).data)
    
class RegistrationViewSet(viewsets.ModelViewSet):
    """
    /api/registrations/  -> list/create (authenticated)
    /api/registrations/<id>/ -> retrieve/update/partial_update/destroy (owner or staff)
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def get_queryset(self):
        # staff can see all, normal users only their registrations
        user = self.request.user
        if user.is_staff:
            return Registration.objects.all()
        return Registration.objects.filter(user=user)

    def perform_create(self, serializer):
        # attach authenticated user
        registration = serializer.save(user=self.request.user)
        try: send_conference_submission_email(registration)
        except Exception as e: logger.error("Conference submission email failed: %s", e)


class WorkshopRegistrationCreateView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        serializer = WorkshopRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        try: send_workshop_registration_email(registration)
        except Exception as e: logger.error("Workshop reg email failed: %s", e)
        return Response(WorkshopRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)


class WorkshopRegistrationLookupView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [WorkshopLookupThrottle]

    def get(self, request):
        registration_id = request.query_params.get("registration_id")
        registration_reference = request.query_params.get("registration_reference")
        email = request.query_params.get("email")

        queryset = WorkshopRegistration.objects.all()

        reference = (registration_reference or registration_id or "").strip()
        if not reference or not email:
            return Response({"detail": "registration_reference and email are required"}, status=status.HTTP_400_BAD_REQUEST)
        if reference:
            # 1) Prefer new registration_code lookups.
            by_code = queryset.filter(registration_code__iexact=reference)
            if by_code.exists():
                queryset = by_code
            else:
                # 2) Fallback to legacy WS{workshop_id}-{pk} or raw pk.
                parsed_pk = None
                ref_upper = reference.upper()
                if ref_upper.startswith("WS") and "-" in reference:
                    maybe_pk = reference.rsplit("-", 1)[-1]
                    if maybe_pk.isdigit():
                        parsed_pk = int(maybe_pk)
                elif reference.isdigit():
                    parsed_pk = int(reference)

                if parsed_pk is not None:
                    queryset = queryset.filter(pk=parsed_pk)
                else:
                    queryset = queryset.none()
        if email:
            queryset = queryset.filter(email__iexact=email.strip())

        registration = queryset.first()
        if not registration:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(WorkshopRegistrationSerializer(registration).data)


class WorkshopTransactionSubmitView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    throttle_classes = [WorkshopSubmitThrottle]

    def patch(self, request):
        registration_id = request.data.get("registration_id")
        email = request.data.get("email", "").strip().lower()
        transaction_id = request.data.get("transaction_id", "").strip()
        transaction_screenshot = request.FILES.get("transaction_screenshot") or request.data.get("transaction_screenshot")

        if not registration_id or not email or not transaction_id or not transaction_screenshot:
            return Response(
                {"detail": "registration_id, email, transaction_id, and transaction_screenshot are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration = get_object_or_404(WorkshopRegistration, pk=registration_id, email__iexact=email)

        if registration.status != WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT:
            return Response(
                {"detail": "Transaction ID can only be submitted after approval for payment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration.transaction_id = transaction_id
        registration.transaction_screenshot = transaction_screenshot
        registration.status = WorkshopRegistration.STATUS_PAYMENT_SUBMITTED
        registration.save(update_fields=["transaction_id", "transaction_screenshot", "status", "updated_at"])

        return Response(WorkshopRegistrationSerializer(registration).data)
        
# from django.db import transaction
# @api_view(["POST"])
# @permission_classes([AllowAny])
# def register_view(request):
#     with transaction.atomic():
#         serializer = RegisterSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()

#         refresh = EmailTokenObtainPairSerializer.get_token(user)

#         return Response(
#             {
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                 },
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#             },
#             status=status.HTTP_201_CREATED,
#         )
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Expects: { "refresh": "<refresh_token>" } in body.
        Blacklists the provided refresh token.
        """
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()  # Requires token_blacklist app
            return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        except Exception:
            # token could already be blacklisted/invalid — still clear client tokens
            return Response({"detail": "Invalid token or already logged out"}, status=status.HTTP_400_BAD_REQUEST)
        
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

@api_view(['GET'])
def visit_counter(request):
    ip = get_client_ip(request)
    # Create a unique key for this specific user
    user_key = f"seen_{ip}"

    # 1. Check if we just counted this user recently (last 2 seconds)
    if cache.get(user_key):
        # If yes, just return the current count WITHOUT incrementing
        total_visits = cache.get('site_visits') or 700
        return Response({'visits': total_visits})

    # 2. If not, increment the counter safely
    try:
        total_visits = cache.incr('site_visits', delta=1)
    except ValueError:
        # Initialize if it doesn't exist
        cache.set('site_visits', 701, timeout=None)
        total_visits = 701

    # 3. Mark this user as "counted" for 5 seconds
    # This blocks the "double fetch" from React Strict Mode
    cache.set(user_key, 'true', timeout=5)

    return Response({'visits': total_visits})