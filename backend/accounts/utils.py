import os
import json
from django.conf import settings

def parse_university_data():
    file_path = os.path.join(settings.BASE_DIR, 'accounts', 'data', 'universities.json')
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
        return [(university, university) for university in data.get("universities", [])]
