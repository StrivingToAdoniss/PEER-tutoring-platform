from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

from .filters import TutorProfileFilter
from .models import TutorProfile
from .serializers import TutorProfileSerializer


class TutorCustomPagination(PageNumberPagination):
    page_size = 10


class TutorListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    pagination_class = TutorCustomPagination
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = TutorProfileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = TutorProfileFilter

    def get_queryset(self):
        return (
            TutorProfile.objects.filter(tutor__is_approved=False)
            .prefetch_related('tutor')
            .order_by('price_per_hour', 'id')
        )
