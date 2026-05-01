# core/serializers.py
from rest_framework import serializers
from .models import CustomUser, Registration, WorkshopRegistration
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
    status = serializers.CharField(read_only=True)
    admin_notes = serializers.CharField(read_only=True)

    is_presenter = serializers.BooleanField(required=False)
    abstract_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cmt_id = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    presentation_type = serializers.ChoiceField(
        required=False,
        allow_blank=True,
        allow_null=True,
        choices=Registration.PRESENTATION_CHOICES,
    )
    transaction_screenshot = serializers.ImageField(required=False, allow_null=True)
    food_preference = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    beverage_choice = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Registration
        read_only_fields = ("id", "user", "status", "admin_notes", "created_at")
        fields = "__all__"

    def validate(self, attrs):
        request = self.context.get("request")
        presentation_choice_values = dict(Registration.PRESENTATION_CHOICES)

        # Prevent multiple active registrations
        if request and request.method == "POST" and request.user.is_authenticated:
            existing = Registration.objects.filter(user=request.user).exclude(
                status=Registration.STATUS_REJECTED
            ).exists()
            if existing:
                raise serializers.ValidationError(
                    "You already have a registration in process or accepted."
                )

        # Get values (handle partial update)
        is_presenter = attrs.get("is_presenter")
        abstract_id = attrs.get("abstract_id")
        cmt_id = attrs.get("cmt_id")
        presentation_type = attrs.get("presentation_type")
        oral = attrs.get("oral_presentation")
        poster = attrs.get("poster_presentation")
        transaction_screenshot = attrs.get("transaction_screenshot")

        if self.instance is not None:
            if is_presenter is None:
                is_presenter = self.instance.is_presenter
            if abstract_id is None:
                abstract_id = self.instance.abstract_id
            if cmt_id is None:
                cmt_id = self.instance.cmt_id or self.instance.abstract_id
            if presentation_type is None:
                presentation_type = self.instance.presentation_type
            if oral is None:
                oral = self.instance.oral_presentation
            if poster is None:
                poster = self.instance.poster_presentation

        if not cmt_id:
            cmt_id = abstract_id

        selected_presentation = (presentation_type or "").strip().lower() if presentation_type else ""
        if not selected_presentation:
            if oral:
                selected_presentation = Registration.PRESENTATION_ORAL
            elif poster:
                selected_presentation = Registration.PRESENTATION_POSTER

        if selected_presentation == Registration.PRESENTATION_ORAL:
            oral = True
            poster = False
        elif selected_presentation == Registration.PRESENTATION_POSTER:
            oral = False
            poster = True
        elif selected_presentation == Registration.PRESENTATION_THESIS:
            oral = False
            poster = False

        # Defaults
        oral = bool(oral)
        poster = bool(poster)

        if request and request.method == "POST" and not transaction_screenshot:
            raise serializers.ValidationError({
                "transaction_screenshot": "Transaction screenshot is required with the transaction ID."
            })

        # ---------------- PRESENTER LOGIC ----------------
        if is_presenter:
            # Require abstract_id
            if not cmt_id:
                raise serializers.ValidationError({
                    "cmt_id": "Required when is_presenter is true."
                })

            # Require a presentation type
            if selected_presentation not in presentation_choice_values:
                raise serializers.ValidationError({
                    "presentation_type": "Select oral, poster, or thesis presentation."
                })

            attrs["cmt_id"] = cmt_id
            attrs["abstract_id"] = abstract_id or cmt_id
            attrs["presentation_type"] = selected_presentation
            attrs["oral_presentation"] = oral
            attrs["poster_presentation"] = poster

        else:
            # Not presenter → clear everything
            attrs["abstract_id"] = None
            attrs["cmt_id"] = None
            attrs["presentation_type"] = None
            attrs["oral_presentation"] = False
            attrs["poster_presentation"] = False

        # ---- FOOD PREFERENCES VALIDATION ----
        food_preference = attrs.get("food_preference", "").strip()
        beverage_choice = attrs.get("beverage_choice", "").strip()
        
        valid_food_prefs = ["Veg", "Non-Veg"]
        valid_beverages = ["Alcoholic", "Non-Alcoholic"]

        if request and request.method == "POST":
            # Require food preferences on creation
            if not food_preference:
                raise serializers.ValidationError({
                    "food_preference": "Food preference is required."
                })
            if not beverage_choice:
                raise serializers.ValidationError({
                    "beverage_choice": "Beverage choice is required."
                })

        if food_preference and food_preference not in valid_food_prefs:
            raise serializers.ValidationError({
                "food_preference": f"Invalid choice. Must be one of: {', '.join(valid_food_prefs)}"
            })

        if beverage_choice and beverage_choice not in valid_beverages:
            raise serializers.ValidationError({
                "beverage_choice": f"Invalid choice. Must be one of: {', '.join(valid_beverages)}"
            })

        attrs["food_preference"] = food_preference
        attrs["beverage_choice"] = beverage_choice

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["user"] = request.user
            if not validated_data.get("email"):
                validated_data["email"] = request.user.email
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get("is_presenter") is False:
            validated_data["abstract_id"] = None
            validated_data["oral_presentation"] = False
            validated_data["poster_presentation"] = False
        return super().update(instance, validated_data)


class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    registration_id = serializers.SerializerMethodField(read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = WorkshopRegistration
        fields = (
            "id",
            "registration_id",
            "workshop_id",
            "workshop_title",
            "full_name",
            "email",
            "phone",
            "institution",
            "designation",
            "participant_type",
            "fee_amount",
            "transaction_id",
            "transaction_screenshot",
            "status",
            "status_display",
            "admin_notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "registration_id",
            "fee_amount",
            "status",
            "status_display",
            "admin_notes",
            "created_at",
            "updated_at",
        )

    def get_registration_id(self, obj):
        return obj.registration_reference

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        workshop_id = attrs.get("workshop_id")
        email = attrs.get("email")

        if self.instance is None and workshop_id and email:
            existing = WorkshopRegistration.objects.filter(
                workshop_id=workshop_id,
                email__iexact=email,
            ).exclude(status=WorkshopRegistration.STATUS_REJECTED)
            if existing.exists():
                raise serializers.ValidationError({
                    "email": "You already have a workshop registration in progress or approved."
                })

        participant_type = attrs.get("participant_type")
        if self.instance is not None and participant_type is None:
            participant_type = self.instance.participant_type

        if participant_type not in dict(WorkshopRegistration.PARTICIPANT_CHOICES):
            raise serializers.ValidationError({"participant_type": "Select a valid participant type."})

        return attrs

    def create(self, validated_data):
        validated_data["status"] = WorkshopRegistration.STATUS_UNDER_PROCESS
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if validated_data.get("transaction_id") and instance.status == WorkshopRegistration.STATUS_APPROVED_FOR_PAYMENT:
            validated_data["status"] = WorkshopRegistration.STATUS_PAYMENT_SUBMITTED
        return super().update(instance, validated_data)