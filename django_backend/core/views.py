# core/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import Registration, WorkshopRegistration
from .serializers import (
    RegisterSerializer,
    RegistrationSerializer,
    EmailTokenObtainPairSerializer,
    WorkshopRegistrationSerializer,
)
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.conf import settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework_simplejwt.views import TokenViewBase
from rest_framework.views import APIView

User = get_user_model()

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

    def get_queryset(self):
        # staff can see all, normal users only their registrations
        user = self.request.user
        if user.is_staff:
            return Registration.objects.all()
        return Registration.objects.filter(user=user)

    def perform_create(self, serializer):
        # attach authenticated user
        serializer.save(user=self.request.user)


class WorkshopRegistrationCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = WorkshopRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        return Response(WorkshopRegistrationSerializer(registration).data, status=status.HTTP_201_CREATED)


class WorkshopRegistrationLookupView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        registration_id = request.query_params.get("registration_id")
        registration_reference = request.query_params.get("registration_reference")
        email = request.query_params.get("email")

        queryset = WorkshopRegistration.objects.all()

        if registration_reference:
            reference = registration_reference.strip()
            if reference.upper().startswith("WS") and "-" in reference:
                maybe_pk = reference.rsplit("-", 1)[-1]
                if maybe_pk.isdigit():
                    queryset = queryset.filter(pk=int(maybe_pk))
                else:
                    queryset = queryset.none()
            elif reference.isdigit():
                queryset = queryset.filter(pk=int(reference))
            else:
                queryset = queryset.none()
        elif registration_id:
            reference = registration_id.strip()
            if reference.isdigit():
                queryset = queryset.filter(pk=int(reference))
            elif reference.upper().startswith("WS") and "-" in reference:
                maybe_pk = reference.rsplit("-", 1)[-1]
                if maybe_pk.isdigit():
                    queryset = queryset.filter(pk=int(maybe_pk))
                else:
                    queryset = queryset.none()
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

    def patch(self, request):
        registration_id = request.data.get("registration_id")
        email = request.data.get("email", "").strip().lower()
        transaction_id = request.data.get("transaction_id", "").strip()

        if not registration_id or not email or not transaction_id:
            return Response(
                {"detail": "registration_id, email, and transaction_id are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration = get_object_or_404(WorkshopRegistration, pk=registration_id, email__iexact=email)

        if registration.status != WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT:
            return Response(
                {"detail": "Transaction ID can only be submitted after approval for payment."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration.transaction_id = transaction_id
        registration.status = WorkshopRegistration.STATUS_PAYMENT_SUBMITTED
        registration.save(update_fields=["transaction_id", "status", "updated_at"])

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


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        generic_response = {
            "detail": "If this email exists, password reset instructions have been sent."
        }

        if not email:
            # Keep response generic to avoid account enumeration.
            return Response(generic_response, status=status.HTTP_200_OK)

        user = User.objects.filter(email__iexact=email).first()
        if not user:
            return Response(generic_response, status=status.HTTP_200_OK)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_BASE_URL.rstrip('/')}/auth/reset-password?uid={uid}&token={token}"

        subject = "2D MatTech Global 2026 - Password Reset"
        message = (
            "We received a request to reset your password for your 2D MatTech Global account.\n\n"
            f"Reset your password using this link:\n{reset_url}\n\n"
            f"This link expires in {settings.PASSWORD_RESET_TIMEOUT // 60} minutes. "
            "If you did not request this, you can ignore this email."
        )

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception:
            # Return generic response even if email fails, to avoid leaking account state.
            pass

        return Response(generic_response, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uid or not token or not new_password:
            return Response(
                {"detail": "uid, token, and new_password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"detail": "Invalid reset link."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired reset link."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response({"detail": exc.messages[0]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])

        # Invalidate all outstanding refresh tokens for security after password change.
        outstanding_tokens = OutstandingToken.objects.filter(user=user)
        for outstanding_token in outstanding_tokens:
            BlacklistedToken.objects.get_or_create(token=outstanding_token)

        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
        
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