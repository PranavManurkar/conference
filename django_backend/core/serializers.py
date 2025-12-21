# core/serializers.py
from rest_framework import serializers
from .models import CustomUser, Registration
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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
        
        # We explicitly set username=email to ensure consistency
        user = User.objects.create_user(username=email, email=email, password=password)
        
        # ---> FIX 1: RETURN THE USER OBJECT <---
        return user

class EmailTokenObtainPairSerializer(serializers.Serializer):
    """
    Accepts { email, password } OR { username, password }.
    Returns { access, refresh, user } on success.
    """
    email = serializers.CharField(required=False, write_only=True)
    username = serializers.CharField(required=False, write_only=True)
    password = serializers.CharField(write_only=True)

    # ---> NEW: Helper method to generate tokens with Email Claim
    @classmethod
    def get_token(cls, user):
        token = RefreshToken.for_user(user)
        # Add email to the token so frontend can decode it
        token['email'] = user.email 
        token['username'] = user.username
        return token

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

        # ---> FIX 2: Use the helper method to include email in token
        refresh = self.get_token(user)
        
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

    # explicitly declare to control requirements/blank behavior
    is_presenter = serializers.BooleanField(required=False)
    abstract_id = serializers.CharField(
        required=False, allow_blank=True, allow_null=True
    )

    class Meta:
        model = Registration
        read_only_fields = ("id", "user", "status", "admin_notes", "created_at")
        fields = "__all__"

    def validate(self, attrs):
        """
        - Prevent creating a second active registration for the same user.
        - Enforce: if is_presenter True -> abstract_id must be provided.
        - If is_presenter False -> clear any abstract_id.
        """
        request = self.context.get("request")

        # Enforce unique-in-progress registration on creation (existing logic)
        if request and request.method in ("POST",) and request.user and request.user.is_authenticated:
            user = request.user
            existing = Registration.objects.filter(user=user).exclude(status=Registration.STATUS_REJECTED).exists()
            if existing:
                raise serializers.ValidationError(
                    "You already have a registration in process or accepted. You cannot submit another until it is rejected or deleted."
                )

        # Now handle presenter/abstract logic:
        is_presenter = attrs.get("is_presenter")
        abstract_id = attrs.get("abstract_id")

        # If this is an update (partial) and the field is not provided, we must consider instance
        if self.instance is not None:
            # For partial updates if `is_presenter` not provided, use current value
            if is_presenter is None:
                is_presenter = getattr(self.instance, "is_presenter", False)
            # If abstract_id not provided in payload, keep existing value for presenter,
            # but if is_presenter is False, we'll clear it below.
            if "abstract_id" not in attrs:
                abstract_id = getattr(self.instance, "abstract_id", None)

        # If user *is* a presenter, abstract_id must exist and be non-empty
        if is_presenter:
            if not abstract_id:
                raise serializers.ValidationError({"abstract_id": "This field is required when is_presenter is true."})
        else:
            # Clear abstract_id when not a presenter
            attrs["abstract_id"] = None

        return super().validate(attrs)

    def create(self, validated_data):
        # Attach authenticated user if available
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            validated_data["user"] = validated_data.get("user", request.user)
            if not validated_data.get("email"):
                validated_data["email"] = request.user.email

        # Ensure abstract_id logic already enforced in validate(); just create
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # If is_presenter was set False, ensure abstract_id is cleared
        if validated_data.get("is_presenter") is False:
            validated_data["abstract_id"] = None
        return super().update(instance, validated_data)