from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from .utils import parse_cities_data, parse_university_data

User = get_user_model()


class Profile(models.Model):
    class Types(models.TextChoices):
        TUTOR = "TUTOR", "Tutor"
        STUDENT = "STUDENT", "Student"

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    profile_type = models.CharField(max_length=20, choices=Types.choices)

    price_per_hour = models.IntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(50)],
        null=True,
        blank=True,
    )
    location = models.CharField(
        max_length=100, choices=parse_cities_data(), null=True, blank=True
    )

    class AvailableModes(models.TextChoices):
        ONLINE = "Online", "Online"
        OFFLINE = "Offline", "Offline"

    mode = models.CharField(
        choices=AvailableModes.choices,
        default=AvailableModes.ONLINE,
        max_length=100,
        null=True,
        blank=True,
    )
    about = models.TextField(blank=True, max_length=2056)

    university = models.CharField(
        max_length=255, choices=parse_university_data(), null=True, blank=True
    )
    current_grade = models.IntegerField(
        choices=User.CurrentGrade.choices, null=True, blank=True
    )
    preferences_about_tutors = models.TextField(blank=True, null=True, max_length=2056)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} ({self.profile_type})"
