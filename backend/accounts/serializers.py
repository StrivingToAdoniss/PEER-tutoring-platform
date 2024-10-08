import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import TutorMore, StudentMore

UserCustomModel = get_user_model()

ERROR_MESSAGE = "Both password and username must contain at least 8 characters, and the password must contain at least one uppercase letter and one special character."


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCustomModel
        fields = '__all__'

    def validate(self, validated_data):
        username = validated_data.get('username')
        password = validated_data.get('password')
        if not (self.regex_password_validator(
                password) and len(username) >= 8):
            raise serializers.ValidationError(ERROR_MESSAGE)
        return validated_data

    def create(self, validated_data):
        validated_data = validated_data.dict()
        validated_data.pop('photo_url', None)
        validated_data.pop('confirmation_file', None)
        request_data = self.context.get('request')
        created_user = UserCustomModel.objects.create(**validated_data)
        if created_user.role == 'TUTOR':
            self.create_tutor_specific_data(created_user, request_data)
        elif created_user.role == 'STUDENT':
            self.create_student_specific_data(created_user, request_data)
        created_user.set_password(validated_data.get('password'))
        created_user.save()

        return created_user

    @staticmethod
    def regex_password_validator(password):
        pattern = r'^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        return bool(re.match(pattern, password))

    @staticmethod
    def create_tutor_specific_data(created_user, request_data):
        try:
            photo_url = request_data.FILES.get('photo_url')
            confirmation_file = request_data.FILES.get('confirmation_file')
            TutorMore.objects.create(
                user=created_user,
                photo_url=photo_url,
                confirmation_file=confirmation_file)
        except Exception as e:
            raise serializers.ValidationError(
                f"Failed to create Tutor data: {str(e)}")

    @staticmethod
    def create_student_specific_data(created_user, request_data):
        try:
            StudentMore.objects.create(user=created_user, **request_data.data)
        except Exception as e:
            raise serializers.ValidationError(
                f"Failed to create Student data: {str(e)}")
