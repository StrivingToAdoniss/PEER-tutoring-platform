from django.urls import path

from . import views

urlpatterns = [
    path('tutor-profiles', views.TutorListView.as_view(), name='tutor_profile_list'),
    path('create-tutor-profile', views.TutorProtectedListView.as_view(), name='create-user-profile'),
    path('retrieve-update-tutor-profile/<int:pk>', views.TutorProtectedUpdateView.as_view(),
         name='retrieve-update-user-profile'),

]
