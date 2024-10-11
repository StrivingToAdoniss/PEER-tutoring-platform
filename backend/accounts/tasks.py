from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string

User = get_user_model()

EMAIL_FROM = "noreply@yourdomain.com"
PASSWORD_RESET_SUBJECT = "Password Reset for {title}"
NOTIFICATION_SUBJECT = "New notification for {username}"
APPROVED_MESSAGE_TEMPLATE = (
    "Dear Tutor {username}, admins have approved your application. "
    "You can log in with email {email}.")
DISAPPROVED_MESSAGE_TEMPLATE = (
    "Dear Tutor {username}, admins have disapproved your application."
    " We are sorry.")


def send_email(subject, message, recipient_email, html_message=None):
    msg = EmailMultiAlternatives(
        subject, message, EMAIL_FROM, [recipient_email])
    if html_message:
        msg.attach_alternative(html_message, "text/html")
    msg.send()


@shared_task
def reset_password(current_user_id, username, email, reset_password_url):
    try:
        current_user = User.objects.get(pk=current_user_id)
        context = {
            'current_user': current_user,
            'username': username,
            'email': email,
            'reset_password_url': reset_password_url
        }
        email_html_message = render_to_string(
            'templates/email/password_reset_email.html', context)
        email_plaintext_message = render_to_string(
            'templates/email/password_reset_email.txt', context)

        send_email(
            PASSWORD_RESET_SUBJECT.format(title="Your Website Title"),
            email_plaintext_message,
            email,
            email_html_message
        )

    except User.DoesNotExist:
        print("Error: User does not exist.")
    except Exception as e:
        print(f"Failed to reset password: {e}")


@shared_task
def send_notifications_email(username, email):
    try:
        tutor_message = (
            f"Dear Tutor {username}, admins will review your application soon. "
            f"Please wait for their response.")
        admin_message = f"<p>Dear admin {settings.EMAIL_HOST_USER}, tutor {username} with {email} awaits your response.</p>"

        for message, recipient in (
                (tutor_message, email), (admin_message, settings.EMAIL_HOST_USER)):
            send_mail(
                NOTIFICATION_SUBJECT.format(
                    username=username),
                message,
                settings.EMAIL_HOST_USER,
                [recipient])

    except Exception as e:
        print(f"Failed to send notifications email: {e}")


@shared_task
def send_result_email_to_tutor(username, email, is_approved):
    try:
        message = APPROVED_MESSAGE_TEMPLATE.format(
            username=username,
            email=email) if is_approved else DISAPPROVED_MESSAGE_TEMPLATE.format(
            username=username)

        send_mail(
            NOTIFICATION_SUBJECT.format(username=username),
            message,
            settings.EMAIL_HOST_USER,
            [email]
        )

    except Exception as e:
        print(f"Failed to send result email: {e}")
