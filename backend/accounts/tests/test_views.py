import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

def create_user(**kwargs):
    user_data = {
        'username': 'testuser123',
        'password': 'Password@123',
        'email': 'testuser@example.com',
        'role': 'STUDENT',
        "university": "UCLouvain",
    }
    user_data.update(kwargs)
    user = User.objects.create_user(**user_data)
    return user


@pytest.mark.django_db
def test_user_registration_success(api_client):
    response = api_client.post('/api/v1/accounts/registration', {
        'username': 'testuser123',
        'password': 'Password@123',
        'email': 'testuser@example.com',
        'role': 'STUDENT',
        "university": "UCLouvain",
    })
    assert response.status_code == 201
    assert response.data['username'] == 'testuser123'


@pytest.mark.django_db
def test_user_registration_password_failure(api_client):
    response = api_client.post('/api/v1/accounts/registration', {
        'username': 'testuser123',
        'password': 'pass',  # Invalid password
        'email': 'testuser@example.com',
        'role': 'STUDENT',
        "university": "UCLouvain"
    })
    assert response.status_code == 400
    assert "Both password and username must contain at least 8 characters" in str(response.data)


@pytest.mark.django_db
def test_user_registration_university_failure(api_client):
    response = api_client.post('/api/v1/accounts/registration', {
        'username': 'testuser123',
        'password': 'pass',
        'email': 'testuser@example.com',
        'role': 'STUDENT',
        "university": "KPI" # Invalid university
    })
    assert response.status_code == 400
    assert '"KPI" is not a valid choice.' in str(response.data)


@pytest.mark.django_db
def test_user_login_success(api_client):
    user = create_user(password='Password@123')
    response = api_client.post('/api/v1/accounts/login', {
        'email': user.email,
        'password': 'Password@123'
    })
    assert response.status_code == 200
    assert 'tokens' in response.data


@pytest.mark.django_db
def test_user_login_failure(api_client):
    user = create_user(password='Password@123')
    response = api_client.post('/api/v1/accounts/login', {
        'email': user.email,
        'password': 'WrongPassword'
    })
    assert response.status_code == 400
    assert "No such user, or incorrect credentials provided." in str(response.data)


@pytest.mark.django_db
def test_user_logout_success(api_client):
    user = create_user()
    refresh = RefreshToken.for_user(user)
    api_client.force_authenticate(user=user)
    response = api_client.post('/api/v1/accounts/logout', {
        'refresh': str(refresh)
    })
    assert response.status_code == 205
    assert response.data['message'] == "You have successfully logged out"


@pytest.mark.django_db
def test_user_logout_failure(api_client):
    user = create_user()
    api_client.force_authenticate(user=user)
    response = api_client.post('/api/v1/accounts/logout', {
        'refresh': 'InvalidToken'
    })
    assert response.status_code == 400
    assert "error" in response.data


@pytest.mark.django_db
def test_user_registration_duplicate_email(api_client):
    # Create a user with the same email
    create_user(email="duplicate@example.com")
    response = api_client.post('/api/v1/accounts/registration', {
        'username': 'newuser',
        'password': 'Password@123',
        'email': 'duplicate@example.com',  # Duplicate email
        'role': 'STUDENT',
        "university": "UCLouvain",
    })
    assert response.status_code == 400
    assert "email" in response.data


@pytest.mark.django_db
def test_user_registration_missing_fields(api_client):
    response = api_client.post('/api/v1/accounts/registration', {
        'username': '',
        'password': 'Password@123',
        'email': '',  # Missing email
        'role': 'STUDENT',
        "university": "UCLouvain",
    })
    assert response.status_code == 400
    assert "email" in response.data


@pytest.mark.django_db
def test_user_login_unregistered_email(api_client):
    response = api_client.post('/api/v1/accounts/login', {
        'email': 'unregistered@example.com',
        'password': 'Password@123',
    })
    assert response.status_code == 400
    assert "No such user, or incorrect credentials provided." in str(response.data)


@pytest.mark.django_db
def test_user_login_missing_fields(api_client):
    response = api_client.post('/api/v1/accounts/login', {
        'email': '',  # Missing email
        'password': '',  # Missing password
    })
    assert response.status_code == 400
    assert "email" in response.data
    assert "password" in response.data


@pytest.mark.django_db
def test_user_logout_unauthenticated(api_client):
    response = api_client.post('/api/v1/accounts/logout', {
        'refresh': 'SomeToken'
    })
    assert response.status_code == 401
    assert "Authentication credentials were not provided." in str(response.data)


@pytest.mark.django_db
def test_user_login_with_inactive_account(api_client):
    user = create_user(is_active=False)  # Inactive user
    response = api_client.post('/api/v1/accounts/login', {
        'email': user.email,
        'password': 'Password@123'
    })
    assert response.status_code == 400
    assert "No such user, or incorrect credentials provided." in str(response.data)
