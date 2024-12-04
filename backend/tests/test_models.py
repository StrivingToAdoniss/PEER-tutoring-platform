import pytest
from accounts.models import User, Student, Tutor, TutorMore


@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(
        email="test@example.com",
        password="testpassword123",
        username="testuser",
    )
    assert user.email == "test@example.com"
    assert user.check_password("testpassword123")
    assert user.role == User.Roles.STUDENT
    assert user.is_active
    assert not user.is_staff
    assert not user.is_superuser


@pytest.mark.django_db
def test_create_superuser():
    superuser = User.objects.create_superuser(
        email="admin@example.com",
        password="adminpassword123",
        username="adminuser"
    )
    assert superuser.email == "admin@example.com"
    assert superuser.check_password("adminpassword123")
    assert superuser.is_staff
    assert superuser.is_superuser


@pytest.mark.django_db
def test_user_without_email_raises_error():
    with pytest.raises(ValueError, match="Users must have an email address"):
        User.objects.create_user(
            email="",
            password="password",
            username="nouser"
        )


@pytest.mark.django_db
def test_student_proxy_model():
    # Create a user and set it up as a Student
    user = User.objects.create_user(
        email="student@example.com",
        password="studentpassword123",
        username="studentuser"
    )
    user.role = User.Roles.STUDENT
    user.save()

    # Retrieve as a Student proxy
    student = Student.objects.get(email="student@example.com")
    assert student.role == User.Roles.STUDENT
    assert isinstance(student, Student)


@pytest.mark.django_db
def test_tutor_proxy_model():
    # Create a user and set it up as a Tutor
    user = User.objects.create_user(
        email="tutor@example.com",
        password="tutorpassword123",
        username="tutoruser"
    )
    user.role = User.Roles.TUTOR
    user.save()

    # Retrieve as a Tutor proxy
    tutor = Tutor.objects.get(email="tutor@example.com")
    assert tutor.role == User.Roles.TUTOR
    assert isinstance(tutor, Tutor)


@pytest.mark.django_db
def test_tutor_more_model():
    # Create a user and set it up as a Tutor
    user = User.objects.create_user(
        email="tutor2@example.com",
        password="tutorpassword123",
        username="tutoruser2"
    )
    user.role = User.Roles.TUTOR
    user.save()

    # Create TutorMore instance
    tutor_more = TutorMore.objects.create(user=user, is_approved=True)
    assert tutor_more.user == user
    assert tutor_more.is_approved


@pytest.mark.django_db
def test_student_manager_filter():
    # Create users and set roles
    user1 = User.objects.create_user(
        email="student1@example.com",
        password="studentpassword1",
        username="studentuser1",
    )
    user1.role = User.Roles.STUDENT
    user1.save()

    user2 = User.objects.create_user(
        email="student2@example.com",
        password="studentpassword2",
        username="studentuser2",

    )
    user2.role = User.Roles.STUDENT
    user2.save()

    tutor_user = User.objects.create_user(
        email="tutor@example.com",
        password="tutorpassword123",
        username="tutoruser",

    )
    tutor_user.role = User.Roles.TUTOR
    tutor_user.save()

    # Test StudentManager
    students = Student.objects.all()
    assert len(students) == 2
    assert user1 in students
    assert user2 in students
    assert tutor_user not in students


@pytest.mark.django_db
def test_tutor_manager_filter():
    # Create users and set roles
    tutor1 = User.objects.create_user(
        email="tutor1@example.com",
        password="tutorpassword1",
        username="tutoruser1",

    )
    tutor1.role = User.Roles.TUTOR
    tutor1.save()

    tutor2 = User.objects.create_user(
        email="tutor2@example.com",
        password="tutorpassword2",
        username="tutoruser2"

    )
    tutor2.role = User.Roles.TUTOR
    tutor2.save()

    student_user = User.objects.create_user(
        email="student@example.com",
        password="studentpassword123",
        username="studentuser",

    )
    student_user.role = User.Roles.STUDENT
    student_user.save()

    # Test TutorManager
    tutors = Tutor.objects.all()
    assert len(tutors) == 2
    assert tutor1 in tutors
    assert tutor2 in tutors
    assert student_user not in tutors
