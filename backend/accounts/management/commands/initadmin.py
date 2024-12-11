from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError


User = get_user_model()

class Command(BaseCommand):
    help = "Creates admin user if not exists"
    def handle(self, *args, **options):
        try:
            User.objects.create_superuser('admin@gmail.com', 'Django@2004')
            print("Superuser created successfully")
        except IntegrityError:
            print("Superuser already exists")
