import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from accounts.models import TutorMore
from tutors_profiles.models import TutorProfile

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()


def create_user(**kwargs):
    user_data = {
        'username': 'testuser123',
        'password': 'Password@123',
        'email': 'testuser@example.com',
    }
    user_data.update(kwargs)
    user = User.objects.create_user(**user_data)
    return user


def create_tutor_more(user, **kwargs):
    tutor_data = {
        'user': user,
        'is_approved': False,
        'subject': 'Math',
        'specialization': 'Algebra',
    }
    tutor_data.update(kwargs)
    return TutorMore.objects.create(**tutor_data)


def create_tutor_profile(tutor_more, **kwargs):
    profile_data = {
        'tutor': tutor_more,
        'price_per_hour': 50,
        'location': 'Aalst',
        'mode': 'Online',
        'about_tutor': 'Experienced Math tutor',
    }
    profile_data.update(kwargs)
    return TutorProfile.objects.create(**profile_data)


@pytest.mark.django_db
def test_tutor_list_view(api_client):
    tutor_more = create_tutor_more(create_user())
    create_tutor_profile(tutor_more)

    response = api_client.get('/api/v1/tutor_profile/tutor-profiles')
    assert response.status_code == 200
    assert len(response.data['results']) == 1
    assert response.data['results'][0]['price_per_hour'] == 50


@pytest.mark.django_db
def test_create_tutor_profile_authenticated(api_client):
    user = create_user()
    tutor_more = create_tutor_more(user)

    api_client.force_authenticate(user=user)
    response = api_client.post('/api/v1/tutor_profile/create-tutor-profile', {
        'price_per_hour': 40,
        'location': 'Aalst',
        'mode': 'Offline',
        'about_tutor': 'New tutor profile',
    })
    assert response.status_code == 201
    assert TutorProfile.objects.filter(price_per_hour=40, tutor=tutor_more).exists()


@pytest.mark.django_db
def test_create_tutor_profile_unauthenticated(api_client):
    response = api_client.post('/api/v1/tutor_profile/create-tutor-profile', {
        'price_per_hour': 40,
        'location': 'Aalst',
        'mode': 'Offline',
        'about_tutor': 'New tutor profile',
    })
    assert response.status_code == 401
    assert "Authentication credentials were not provided." in str(response.data)


@pytest.mark.django_db
def test_update_tutor_profile(api_client):
    user = create_user()
    tutor_more = create_tutor_more(user)
    tutor_profile = create_tutor_profile(tutor_more)

    api_client.force_authenticate(user=user)
    response = api_client.patch(f'/api/v1/tutor_profile/retrieve-update-tutor-profile/{tutor_profile.id}', {
        'price_per_hour': 20,
    })
    assert response.status_code == 200
    tutor_profile.refresh_from_db()
    assert tutor_profile.price_per_hour == 20


@pytest.mark.django_db
def test_update_tutor_profile_invalid_user(api_client):
    user = create_user()
    another_user = create_user(username='anotheruser', email='another@example.com')
    tutor_more = create_tutor_more(user)
    tutor_profile = create_tutor_profile(tutor_more)

    api_client.force_authenticate(user=another_user)
    response = api_client.patch(f'/api/v1/tutor_profile/retrieve-update-tutor-profile/{tutor_profile.id}', {
        'price_per_hour': 40,
    }, format='json')
    assert response.status_code == 403
    assert response.data['detail'] == "You must be a tutor to access this data."
