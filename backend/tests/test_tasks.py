import pytest
from unittest.mock import patch, MagicMock
from django.contrib.auth import get_user_model

from accounts.tasks import reset_password, send_notifications_email, send_result_email_to_tutor
from backend import settings

User = get_user_model()


@pytest.mark.django_db
@patch("accounts.tasks.send_email")
@patch("accounts.tasks.render_to_string")
def test_reset_password_success(mock_render_to_string, mock_send_email):
    # Mock user
    user = User.objects.create(username="testuser", email="test@example.com")
    mock_render_to_string.side_effect = [
        "<html>HTML message</html>",
        "Plain text message"
    ]

    # Call the task
    reset_password(
        current_user_id=user.id,
        username="testuser",
        email="test@example.com",
        reset_password_url="http://example.com/reset"
    )

    # Assertions
    mock_send_email.assert_called_once_with(
        "Password Reset for Your Website Title",
        "Plain text message",
        "test@example.com",
        "<html>HTML message</html>"
    )


@pytest.mark.django_db
@patch("accounts.tasks.print")
def test_reset_password_user_does_not_exist(mock_print):
    reset_password(
        current_user_id=999,  # Non-existent user
        username="nonuser",
        email="test@example.com",
        reset_password_url="http://example.com/reset"
    )

    mock_print.assert_called_once_with("Error: User does not exist.")


@patch("accounts.tasks.send_mail")
def test_send_notifications_email_success(mock_send_mail):
    send_notifications_email("testuser", "test@example.com")

    # Assertions
    assert mock_send_mail.call_count == 2

    tutor_message = (
        f"Dear Tutor testuser, admins will review application soon. "
        f"Please wait for their response."
    )
    admin_message = (
        f"<p>Dear admin {settings.EMAIL_HOST_USER}, tutor testuser with test@example.com "
        f"awaits your response.</p>"
    )

    mock_send_mail.assert_any_call(
        "New notification for testuser",
        tutor_message,
        settings.EMAIL_HOST_USER,
        ["test@example.com"]
    )
    mock_send_mail.assert_any_call(
        "New notification for testuser",
        admin_message,
        settings.EMAIL_HOST_USER,
        [settings.EMAIL_HOST_USER]
    )


@patch("accounts.tasks.send_mail")
@pytest.mark.parametrize("is_approved, expected_message", [
    (True, "Dear Tutor testuser, admins have approved your application. "
           "You can log in with email test@example.com."),
    (False, "Dear Tutor testuser, admins have disapproved your application. We are sorry.")
])
def test_send_result_email_to_tutor(mock_send_mail, is_approved, expected_message):
    send_result_email_to_tutor("testuser", "test@example.com", is_approved)

    mock_send_mail.assert_called_once_with(
        "New notification for testuser",
        expected_message,
        settings.EMAIL_HOST_USER,
        ["test@example.com"]
    )
