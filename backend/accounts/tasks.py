import json

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string

User = get_user_model()


@shared_task
def reset_password(current_user_id, username, email, reset_password_url):
    try:
        current_user = User.objects.get(pk=current_user_id)
        context = {
            'current_user': current_user,
            'username': username,
            'email': email,
            'reset_password_url': reset_password_url}
        email_html_message = render_to_string('templates/email/password_reset_email.html', context)
        email_plaintext_message = render_to_string('templates/email/password_reset_email.txt', context)
        msg = EmailMultiAlternatives(
            "Password Reset for {title}".format(title="Your Website Title"),
            email_plaintext_message,
            "noreply@yourdomain.com",
            [email]
        )
        msg.attach_alternative(email_html_message, "text/html")
        msg.send()

    except User.DoesNotExist:
        return json.dumps({"error": "User does not exist"})

    except Exception as e:
        return json.dumps({"Failded to reset password": str(e)})


@shared_task
def send_notifications_email(username, email):
    TUTOR_EMAIL_MESSAGE = {"message": f"""Dear Tutor {username}, admins will review your application soon, wait for their response 
    """, "email": email}

    ADMIN_EMAIL_MESSAGE = {
        "message": f"""<p> Dear admin {settings.EMAIL_HOST_USER}, tutor {username} with {email} awaits your response</p>""",
        "email": settings.EMAIL_HOST_USER}

    try:
        for message in (TUTOR_EMAIL_MESSAGE, ADMIN_EMAIL_MESSAGE):
            send_mail(f"New notification for {username}", message.get('message'), settings.EMAIL_HOST_USER,
                      [message.get('email')])

    except Exception as e:
        return json.dumps({"Failded to send emails": str(e)})
