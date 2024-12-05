from rest_framework import serializers

from accounts.models import TutorMore
from accounts.serializers import UserNestedSerializer
from .models import TutorProfile


class TutorMoreSerializer(serializers.ModelSerializer):
    user = UserNestedSerializer(read_only=True)

    class Meta:
        model = TutorMore
        fields = [
            'id',
            'is_approved',
            'photo_url',
            'subject',
            'specialization',
            'user'
        ]
        depth = 1


class TutorProfileSerializer(serializers.ModelSerializer):
    tutor = TutorMoreSerializer(read_only=True)

    class Meta:
        model = TutorProfile
        fields = ['id', 'tutor', 'price_per_hour', 'location', 'mode', 'about_tutor']
