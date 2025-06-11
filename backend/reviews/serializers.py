# serializers.py

from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "student", "rating", "comment", "created_at"]
        read_only_fields = ["id", "student", "created_at"]
