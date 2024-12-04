from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.db import models

from .utils import parse_university_data


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
                and extra_fields.get('is_superuser')):
            raise ValueError(
                'Superuser must have is_staff=True and is_superuser=True')
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser, PermissionsMixin):
    class Roles(models.TextChoices):
        STUDENT = 'STUDENT', 'Student'
        TUTOR = 'TUTOR', 'Tutor'

    class CurrentGrade(models.IntegerChoices):
        FIRST = 1, 'First year'
        SECOND = 2, 'Second year'
        THIRD = 3, 'Third year'
        FOURTH = 4, 'Fourth year'

    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.STUDENT)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    current_grade = models.IntegerField(
        choices=CurrentGrade.choices,
        default=CurrentGrade.FIRST)
    university = models.CharField(
        max_length=255,
        choices=parse_university_data())
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return f'{self.email}'


class StudentManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=User.Roles.STUDENT)


class TutorManager(models.Manager):
    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).filter(role=User.Roles.TUTOR)


class StudentMore(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='students_more')


class Student(User):
    objects = StudentManager()
    base_role = User.Roles.STUDENT

    @property
    def more(self):
        return self.students_more

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)


def upload_to(instance, filename):
    return f'images/{filename}'


def file_upload_to(instance, filename):
    return f'confirmation_files/{filename}'


class TutorMore(models.Model):
    class Subject(models.TextChoices):
        MATH = 'Math', 'Math'
        PHYSICS = 'Physics', 'Physics'
        ENGLISH = 'English', 'English'
        CHEMISTRY = 'Chemistry', 'Chemistry'
        BIOLOGY = 'Biology', 'Biology'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='tutors_more')
    students = models.ManyToManyField(Student, blank=True)
    is_approved = models.BooleanField(default=False)
    photo_url = models.ImageField(upload_to=upload_to)
    confirmation_file = models.FileField(upload_to=file_upload_to)
    subject = models.CharField(choices=Subject.choices, default=Subject.MATH)
    specialization = models.TextField(max_length=1024, default='Math')


class Tutor(User):
    objects = TutorManager()
    base_role = User.Roles.TUTOR

    @property
    def more(self):
        return self.tutors_more

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        if not self.pk:
            self.role = self.base_role
        return super().save(*args, **kwargs)
