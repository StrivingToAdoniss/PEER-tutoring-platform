from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

from .tasks import reset_password, send_notifications_email

User = get_user_model()


@receiver(reset_password_token_created)
def handle_password_reset_token(
        sender,
        instance,
        reset_password_token,
        *args,
        **kwargs):
    reset_url = instance.request.build_absolute_uri(
        reverse('password_reset:reset-password-confirm')
    )
    reset_password_url = f"{reset_url}?token={reset_password_token.key}"

    reset_password.delay(
        current_user_id=reset_password_token.user.id,
        username=reset_password_token.user.username,
        email=reset_password_token.user.email,
        reset_password_url=reset_password_url
    )


@receiver(post_save, sender=User)
def notify_admin_on_tutor_creation(sender, instance, created, **kwargs):
    if created and instance.role == "TUTOR":
        send_notifications_email.delay(
            username=instance.username,
            email=instance.email
        )
