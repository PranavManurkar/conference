"""
Django REST Framework serializers for the Registration model.
"""
from rest_framework import serializers
from .models import Registration


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializer for Registration model."""
    
    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = [
            'id', 'user_id', 'created_at', 'updated_at',
            'full_name', 'email', 'phone', 'institution_organization',
            'designation', 'country', 'delegate_type', 'registration_period',
            'participant_region', 'payment_amount', 'payment_reference_number',
            'payment_date', 'abstract_title', 'presentation_preference'
        ]


class RegistrationStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating registration status only."""
    
    class Meta:
        model = Registration
        fields = ['status', 'admin_notes']


class RegistrationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing registrations."""
    
    class Meta:
        model = Registration
        fields = [
            'id', 'full_name', 'email', 'delegate_type',
            'participant_region', 'payment_amount', 'payment_reference_number',
            'status', 'created_at'
        ]
