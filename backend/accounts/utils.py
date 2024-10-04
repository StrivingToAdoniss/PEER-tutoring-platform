import json


def parse_university_data():
    with open('accounts/data/universities.json', 'r') as json_file:
        data = json.load(json_file)
        return [(university, university) for university in data.get("universities", [])]
