from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView


urlpatterns = [
    path('profiles/<int:profile_pk>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('profiles/<int:profile_pk>/reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]