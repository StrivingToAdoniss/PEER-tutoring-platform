import json
import os

from django.conf import settings


def parse_cities_data():
    file_path = os.path.join(settings.BASE_DIR, 'tutors_profiles', 'data', 'available_cities.json')
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
        return [(city, city) for city in data.get("available_cities", [])]