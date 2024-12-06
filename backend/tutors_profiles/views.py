from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser

from .filters import TutorProfileFilter
from .models import TutorProfile
from .serializers import TutorProfileSerializer


class TutorCustomPagination(PageNumberPagination):
    page_size = 10


class BaseTutorView(generics.GenericAPIView):
    pagination_class = TutorCustomPagination
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = TutorProfileSerializer

    def get_queryset(self):
        raise NotImplementedError("Subclasses must implement 'get_queryset'.")


class TutorListView(BaseTutorView, generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = TutorProfileFilter

    def get_queryset(self):
        return (
            TutorProfile.objects.filter(tutor__is_approved=False)
            .prefetch_related('tutor')
            .order_by('price_per_hour', 'id')
        )


class TutorProtectedBaseView(BaseTutorView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not hasattr(self.request.user, 'tutors_more'):
            raise PermissionDenied("You must be a tutor to access this data.")
        return TutorProfile.objects.filter(tutor=self.request.user.tutors_more).prefetch_related('tutor')


class TutorProtectedListView(TutorProtectedBaseView, generics.ListCreateAPIView):
    def perform_create(self, serializer):
        if not hasattr(self.request.user, 'tutors_more'):
            raise PermissionDenied("Only tutors can create a tutor profile.")
        serializer.save(tutor=self.request.user.tutors_more)


class TutorProtectedUpdateView(TutorProtectedBaseView, generics.RetrieveUpdateAPIView):
    def perform_update(self, serializer):
        if not hasattr(self.request.user, 'tutors_more'):
            raise PermissionDenied("Only tutors can update a tutor profile.")
        serializer.save(tutor=self.request.user.tutors_more)
