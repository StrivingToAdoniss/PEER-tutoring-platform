from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from accounts.models import TutorMore
from .utils import parse_cities_data


class TutorProfile(models.Model):
    class AvailableModes(models.TextChoices):
        ONLINE = 'Online', 'Online'
        OFFLINE = 'Offline', 'Offline'

    tutor = models.OneToOneField(TutorMore, on_delete=models.CASCADE, related_name='tutor_profile')
    price_per_hour = models.IntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(50)])
    location = models.CharField(max_length=100, choices=parse_cities_data())
    mode = models.CharField(choices=AvailableModes.choices, default=AvailableModes.ONLINE, max_length=100)
    about_tutor = models.TextField(blank=True, max_length=2056)
