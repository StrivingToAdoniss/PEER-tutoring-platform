from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if not (extra_fields.get('is_staff')
                and not extra_fields.get('is_superuser')):
            raise ValueError(
                'Superuser must have is_staff=True and is_superuser=True')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Roles(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        TUTOR = 'TUTOR', 'Tutor'

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.STUDENT)
    name = models.CharField(max_length=255, required=True, unique=True)
    email = models.EmailField(max_length=255, required=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f'{self.email}'
