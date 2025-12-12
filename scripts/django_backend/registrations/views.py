"""
API views for managing registrations from Django.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Count, Sum
from .models import Registration
from .serializers import (
    RegistrationSerializer,
    RegistrationStatusUpdateSerializer,
    RegistrationListSerializer
)


class RegistrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing registrations.
    Only admin users can access these endpoints.
    """
    queryset = Registration.objects.all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RegistrationListSerializer
        if self.action in ['update_status', 'partial_update']:
            return RegistrationStatusUpdateSerializer
        return RegistrationSerializer
    
    def get_queryset(self):
        queryset = Registration.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by delegate type
        delegate_type = self.request.query_params.get('delegate_type')
        if delegate_type:
            queryset = queryset.filter(delegate_type=delegate_type)
        
        # Filter by region
        region = self.request.query_params.get('region')
        if region:
            queryset = queryset.filter(participant_region=region)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                full_name__icontains=search
            ) | queryset.filter(
                email__icontains=search
            ) | queryset.filter(
                institution_organization__icontains=search
            )
        
        return queryset
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update only the status and admin_notes of a registration."""
        registration = self.get_object()
        serializer = RegistrationStatusUpdateSerializer(
            registration,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get registration statistics for dashboard."""
        total = Registration.objects.count()
        by_status = Registration.objects.values('status').annotate(count=Count('id'))
        by_delegate_type = Registration.objects.values('delegate_type').annotate(count=Count('id'))
        by_region = Registration.objects.values('participant_region').annotate(count=Count('id'))
        total_revenue = Registration.objects.filter(
            status='Accepted'
        ).aggregate(total=Sum('payment_amount'))
        
        return Response({
            'total_registrations': total,
            'by_status': {item['status']: item['count'] for item in by_status},
            'by_delegate_type': {item['delegate_type']: item['count'] for item in by_delegate_type},
            'by_region': {item['participant_region']: item['count'] for item in by_region},
            'total_revenue': total_revenue['total'] or 0,
        })
    
    @action(detail=False, methods=['post'])
    def bulk_update_status(self, request):
        """Bulk update status for multiple registrations."""
        ids = request.data.get('ids', [])
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        if not ids or not new_status:
            return Response(
                {'error': 'ids and status are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in ['Under Process', 'Accepted', 'Rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated = Registration.objects.filter(id__in=ids).update(
            status=new_status,
            admin_notes=admin_notes
        )
        
        return Response({'updated': updated})
