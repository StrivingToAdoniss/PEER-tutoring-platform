# urls.py
from django.urls import path
from .views import (
    ProfileListView,
    ProfileCreateView,
    ProfileDetailView,
    ProfileUpdateView,
)

urlpatterns = [
    path("profiles/", ProfileListView.as_view(), name="profile-list"),
    path("new_profile/", ProfileCreateView.as_view(), name="profile-create"),
    path("my_profile/<int:pk>/", ProfileDetailView.as_view(), name="profile-detail"),
    path(
        "update_profile/<int:pk>/", ProfileUpdateView.as_view(), name="profile-update"
    ),
]
