from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions

from profiles.models import Profile
from .models import Review
from .permissions import IsStudent, IsOwnerOrReadOnly
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get_queryset(self):
        return Review.objects.filter(
            profile_id=self.kwargs['profile_pk']
        ).order_by('-created_at')

    def perform_create(self, serializer):
        profile = get_object_or_404(Profile, pk=self.kwargs['profile_pk'], profile_type=Profile.Types.TUTOR)

        serializer.save(student=self.request.user, profile=profile)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(
            profile_id=self.kwargs['profile_pk']
        )
