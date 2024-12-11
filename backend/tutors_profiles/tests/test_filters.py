import pytest
from tutors_profiles.models import TutorProfile
from tutors_profiles.filters import TutorProfileFilter
from accounts.models import TutorMore
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

@pytest.fixture
def create_tutor_profile():
    def _create_tutor_profile(**kwargs):
        unique_username = kwargs.get('username', f'testuser_{uuid.uuid4().hex[:8]}')
        user = User.objects.create_user(
            username=unique_username,
            email=kwargs.get('email', f'{unique_username}@example.com'),
            password=kwargs.get('password', 'Password@123'),
            university=kwargs.get('university', 'Test University'),
        )
        tutor_more = TutorMore.objects.create(
            user=user,
            is_approved=True,
            subject=kwargs.get('subject', 'Math'),
            specialization=kwargs.get('specialization', 'Mathematics'),
        )
        return TutorProfile.objects.create(
            tutor=tutor_more,
            price_per_hour=kwargs.get('price_per_hour', 30),
            location=kwargs.get('location', 'City A'),
            mode=kwargs.get('mode', 'Online'),
            about_tutor=kwargs.get('about_tutor', 'Experienced tutor.'),
        )
    return _create_tutor_profile


@pytest.mark.django_db
def test_tutor_profile_filter_by_university(create_tutor_profile):
    create_tutor_profile(university="KU Leuven")
    create_tutor_profile(university="Ghent University")

    queryset = TutorProfile.objects.all()
    filter_data = {'tutor_university': 'KU Leuven'}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 1
    assert filtered.first().tutor.user.university == "KU Leuven"


@pytest.mark.django_db
def test_tutor_profile_filter_by_partial_university_name(create_tutor_profile):
    create_tutor_profile(university="University of Namur")
    create_tutor_profile(university="University of Luxembourg")
    create_tutor_profile(university="University of Salzburg")
    create_tutor_profile(university="Ghent University")

    queryset = TutorProfile.objects.all()
    filter_data = {'tutor_university': 'university'}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 4


@pytest.mark.django_db
def test_tutor_profile_filter_by_subject(create_tutor_profile):
    create_tutor_profile(subject="Math")
    create_tutor_profile(subject="Physics")

    queryset = TutorProfile.objects.all()
    filter_data = {'tutor_subject': 'math'}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 1
    assert filtered.first().tutor.subject == "Math"


@pytest.mark.django_db
def test_tutor_profile_filter_by_location(create_tutor_profile):
    create_tutor_profile(location="Brussels")
    create_tutor_profile(location="Ghent")

    queryset = TutorProfile.objects.all()
    filter_data = {'location': 'Brussels'}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 1
    assert filtered.first().location == "Brussels"


@pytest.mark.django_db
def test_tutor_profile_filter_by_mode(create_tutor_profile):
    create_tutor_profile(mode="Online")
    create_tutor_profile(mode="Offline")

    queryset = TutorProfile.objects.all()
    filter_data = {'mode': 'Online'}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 1
    assert filtered.first().mode == "Online"


@pytest.mark.django_db
def test_tutor_profile_filter_by_price(create_tutor_profile):
    create_tutor_profile(price_per_hour=25)
    create_tutor_profile(price_per_hour=50)

    queryset = TutorProfile.objects.all()
    filter_data = {'price_per_hour': 25}
    filtered = TutorProfileFilter(filter_data, queryset=queryset).qs

    assert len(filtered) == 1
    assert filtered.first().price_per_hour == 25
