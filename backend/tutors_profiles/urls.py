from django.urls import path
from . import views

urlpatterns = [
    path('profile', views.TutorListView.as_view(), name='tutor_profile_list'),
]