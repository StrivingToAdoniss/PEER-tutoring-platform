from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

schema_view = swagger_get_schema_view(
    openapi.Info(
        title="Peer platform",
        default_version='1.0.0',
        description="API documentation for Peer platform",
    ),
    public=True,
    permission_classes=[],
    authentication_classes=[],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/v1/tutor_profile/', include('tutors_profiles.urls')),
    path(
        'swagger/schema/',
        schema_view.with_ui(
            'swagger',
            cache_timeout=0),
        name='schema-swagger-ui'
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path(
            '__debug__/',
            include(
                debug_toolbar.urls)),
    ] + urlpatterns
