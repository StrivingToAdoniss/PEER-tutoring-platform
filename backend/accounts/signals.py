from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

from .tasks import reset_password
from .tasks import send_notifications_email

User = get_user_model()


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    reset_password_url = "{}?token={}".format(
        instance.request.build_absolute_uri(
            reverse('password_reset:reset-password-confirm')),
        reset_password_token.key)
    current_user_id = reset_password_token.user.id
    username = reset_password_token.user.username
    email = reset_password_token.user.email
    reset_password.delay(current_user_id=current_user_id, username=username, email=email,
                         reset_password_url=reset_password_url)


@receiver(post_save, sender=User)
def notify_admin_of_tutor_request_created(sender, instance, created, **kwargs):
    if created and instance.role == "TUTOR":
        send_notifications_email.delay(username=instance.username, email=instance.email)
