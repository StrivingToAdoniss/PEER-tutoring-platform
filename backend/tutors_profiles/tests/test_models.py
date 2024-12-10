import pytest
from django.core.exceptions import ValidationError
from unittest.mock import MagicMock
from accounts.models import TutorMore, User
from ..models import TutorProfile


@pytest.mark.django_db
class TestTutorProfile:
    @pytest.fixture
    def tutor(self):
        """Fixture to create a Tutor user and their associated TutorMore."""
        mocked_photo = MagicMock(spec="django.db.models.fields.files.FieldFile")
        mocked_photo.name = "images/mock_photo.jpg"

        mocked_confirmation_file = MagicMock(spec="django.db.models.fields.files.FieldFile")
        mocked_confirmation_file.name = "confirmation_files/mock_confirmation.pdf"

        user = User.objects.create_user(
            email="tutor@example.com",
            username="tutoruser",
            password="strongpassword",
            university="KU Leuven"
        )
        user.role = User.Roles.TUTOR
        user.save()

        tutor_more = TutorMore.objects.create(
            user=user,
            is_approved=True,
            photo_url=mocked_photo,
            confirmation_file=mocked_confirmation_file,
            subject=TutorMore.Subject.MATH,
            specialization="Advanced Math Techniques"
        )
        return tutor_more


    def test_tutor_profile_creation(self, tutor):
        """Test if a TutorProfile can be successfully created."""
        profile = TutorProfile.objects.create(
            tutor=tutor,
            price_per_hour=10,
            location="Aalst",
            mode=TutorProfile.AvailableModes.ONLINE,
            about_tutor="Experienced in various subjects."
        )
        assert profile.tutor == tutor
        assert profile.price_per_hour == 10
        assert profile.location == "Aalst"
        assert profile.mode == TutorProfile.AvailableModes.ONLINE
        assert profile.about_tutor == "Experienced in various subjects."

    def test_price_per_hour_validation(self, tutor):
        """Test the `price_per_hour` field validation."""
        profile = TutorProfile(
            tutor=tutor,
            price_per_hour=51,  # Invalid value (greater than 50)
            location="Invalid City",
            mode=TutorProfile.AvailableModes.ONLINE,
        )
        with pytest.raises(ValidationError):
            profile.full_clean()  # This triggers field validation

    def test_invalid_location(self, tutor):
        """Test validation for invalid location."""
        profile = TutorProfile(
            tutor=tutor,
            price_per_hour=20,
            location="Sample City",  # Not in `parse_cities_data`
            mode=TutorProfile.AvailableModes.ONLINE,
        )
        with pytest.raises(ValidationError):
            profile.full_clean()

    def test_default_mode(self, tutor):
        """Test if the default mode is set correctly."""
        profile = TutorProfile.objects.create(
            tutor=tutor,
            price_per_hour=15,
            location="Sample City",
        )
        assert profile.mode == TutorProfile.AvailableModes.ONLINE

    def test_blank_about_tutor(self, tutor):
        """Test if `about_tutor` can be left blank."""
        profile = TutorProfile.objects.create(
            tutor=tutor,
            price_per_hour=10,
            location="Sample City",
            mode=TutorProfile.AvailableModes.ONLINE,
        )
        assert profile.about_tutor == ""
