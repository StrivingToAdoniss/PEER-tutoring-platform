from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, permissions

from .models import Profile
from .serializers import ProfileCreateSerializer, ProfileSerializer
from .permissions import IsMatchingRole


class ProfileListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProfileSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['profile_type']
    queryset = Profile.objects.all()


class ProfileDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()


class ProfileProtectedView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, IsMatchingRole]
    serializer_class = ProfileCreateSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


class ProfileCreateView(ProfileProtectedView, generics.CreateAPIView):
    def perform_create(self, serializer):
        serializer.save()


class ProfileUpdateView(ProfileProtectedView, generics.UpdateAPIView):
    def perform_update(self, serializer):
        serializer.save()
