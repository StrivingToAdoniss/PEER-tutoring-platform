from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path(
        'token-refresh',
        TokenRefreshView.as_view(),
        name='token-refresh'),
    path(
        'registration',
        views.UserRegistrationView.as_view(),
        name='register-user'),
]
