# core/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes,authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Registration
from .serializers import RegisterSerializer, RegistrationSerializer, EmailTokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
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