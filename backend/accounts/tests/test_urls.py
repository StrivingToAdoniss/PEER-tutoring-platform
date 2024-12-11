import pytest
from django.urls import reverse, resolve
from rest_framework_simplejwt.views import TokenRefreshView
from accounts.views import UserRegistrationView, UserLoginView, UserLogoutView

pytestmark = pytest.mark.django_db

def test_token_refresh_url():
    url = reverse('token-refresh')
    assert resolve(url).func.view_class == TokenRefreshView

def test_registration_url():
    url = reverse('register-user')
    assert resolve(url).func.view_class == UserRegistrationView

def test_login_url():
    url = reverse('login-user')
    assert resolve(url).func.view_class == UserLoginView

def test_logout_url():
    url = reverse('logout-user')
    assert resolve(url).func.view_class == UserLogoutView
