import pytest
from django.urls import reverse, resolve
from tutors_profiles.views import TutorListView, TutorProtectedListView, TutorProtectedUpdateView

pytestmark = pytest.mark.django_db

def test_tutor_profile_list_url():
    url = reverse('tutor_profile_list')
    assert resolve(url).func.view_class == TutorListView

def test_create_user_profile_url():
    url = reverse('create-user-profile')
    assert resolve(url).func.view_class == TutorProtectedListView

def test_retrieve_update_user_profile_url():
    url = reverse('retrieve-update-user-profile', kwargs={'pk': 1})
    assert resolve(url).func.view_class == TutorProtectedUpdateView
