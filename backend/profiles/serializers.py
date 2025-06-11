from rest_framework import serializers

from .models import Profile
from .services import ProfileFactory


class ProfileCreateSerializer(serializers.Serializer):
    profile_type = serializers.ChoiceField(choices=Profile.Types.choices)
    price_per_hour = serializers.IntegerField(required=False)
    location = serializers.ChoiceField(choices=[c[0] for c in Profile._meta.get_field('location').choices],
                                       required=False)
    mode = serializers.ChoiceField(choices=Profile.AvailableModes.choices, required=False)
    about = serializers.CharField(required=False, allow_blank=True)
    university = serializers.ChoiceField(choices=[c[0] for c in Profile._meta.get_field('university').choices],
                                         required=False)
    current_grade = serializers.IntegerField(required=False)
    preferences_about_tutors = serializers.CharField(required=False)

    def validate(self, attrs):
        ProfileFactory.STRATEGIES[attrs['profile_type']].validate(attrs)
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        return ProfileFactory.create(user, validated_data)

    def update(self, instance, validated_data):
        return ProfileFactory.update(instance, validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['id', 'profile_type', 'price_per_hour', 'location', 'mode', 'about', 'university', 'current_grade',
                  'preferences_about_tutors']
