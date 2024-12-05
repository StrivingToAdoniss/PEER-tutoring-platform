from django_filters import rest_framework as filters
from .models import TutorProfile

class TutorProfileFilter(filters.FilterSet):
    tutor_university = filters.CharFilter(field_name='tutor__user__university',lookup_expr='icontains')
    tutor_subject = filters.CharFilter(field_name='tutor__subject',lookup_expr='icontains')

    class Meta:
        model = TutorProfile
        fields = ['tutor_subject', 'tutor_university', 'location', 'mode', 'price_per_hour']