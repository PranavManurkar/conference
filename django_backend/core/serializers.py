# core/serializers.py
from rest_framework import serializers
from .models import CustomUser, Registration
from django.contrib.auth import get_user_model,authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "is_mentor", "first_name", "last_name"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "password")
        read_only_fields = ("id",)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # create_user ensures password is hashed and user is created properly
        email = validated_data["email"]
        password = validated_data["password"]
        user = User.objects.create_user(username=email, email=email, password=password)
        return 
    
class EmailTokenObtainPairSerializer(serializers.Serializer):
    """
    Accepts { email, password } OR { username, password }.
    Returns { access, refresh, user } on success.
    """
    email = serializers.CharField(required=False, write_only=True)
    username = serializers.CharField(required=False, write_only=True)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        password = attrs.get("password")
        email = attrs.get("email")
        username = attrs.get("username")

        user = None
        # Try email lookup first if provided
        if email:
            try:
                user_obj = User.objects.get(email__iexact=email)
                username_to_auth = getattr(user_obj, User.USERNAME_FIELD)
                user = authenticate(self.context.get("request"), username=username_to_auth, password=password)
            except User.DoesNotExist:
                user = None

        # Fallback to username authenticate if provided or email lookup failed
        if user is None and username:
            user = authenticate(self.context.get("request"), username=username, password=password)

        if user is None:
            raise serializers.ValidationError("No active account found with the given credentials")

        # Build tokens
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)
        refresh_str = str(refresh)

        return {
            "access": access,
            "refresh": refresh_str,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": getattr(user, "first_name", ""),
                "last_name": getattr(user, "last_name", ""),
            },
        }
        
class RegistrationSerializer(serializers.ModelSerializer):
    
    id = serializers.IntegerField(read_only=True)
    status = serializers.CharField(read_only=True)        # server-controlled
    admin_notes = serializers.CharField(read_only=True)   # server-controlled

    class Meta:
        model = Registration
        read_only_fields = ("id", "user", "status", "admin_notes", "created_at")
        fields = "__all__"

    def validate(self, attrs):
        """
        Prevent creating a second active registration for the same user.
        Allow creation only if user has no registration or their latest registration is Rejected.
        """
        request = self.context.get("request")
        # We only enforce on creation (no instance)
        if request and request.method in ("POST",) and request.user and request.user.is_authenticated:
            user = request.user
            # Query user's registrations excluding 'Rejected'
            existing = Registration.objects.filter(user=user).exclude(status=Registration.STATUS_REJECTED).exists()
            if existing:
                raise serializers.ValidationError(
                    "You already have a registration in process or accepted. You cannot submit another until it is rejected or deleted."
                )
        return super().validate(attrs)

    def create(self, validated_data):
        # If viewset already passed `user` via serializer.save(user=request.user), it will be in validated_data
        # Otherwise attach request.user if present.
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data["user"] = validated_data.get("user", request.user)
            if not validated_data.get("email"):
                validated_data["email"] = request.user.email
        return super().create(validated_data)