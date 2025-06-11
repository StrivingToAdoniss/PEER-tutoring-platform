from abc import ABC, abstractmethod

from .models import Profile


class BaseProfileStrategy(ABC):
    @abstractmethod
    def validate(self, data):
        pass

    @abstractmethod
    def fill(self, profile: Profile, data: dict):
        pass


class TutorProfileStrategy(BaseProfileStrategy):
    def validate(self, data):
        required = ['price_per_hour', 'location', 'mode']
        missing = [f for f in required if f not in data]
        if missing:
            raise ValueError(f"Missing tutor fields: {missing}")

    def fill(self, profile, data):
        profile.profile_type = Profile.Types.TUTOR
        profile.price_per_hour = data['price_per_hour']
        profile.university = data['university']
        profile.current_grade = data['current_grade']
        profile.location = data['location']
        profile.mode = data['mode']
        profile.about = data.get('about', '')


class StudentProfileStrategy(BaseProfileStrategy):
    def validate(self, data):
        required = ['university', 'current_grade', 'preferences_about_tutors']
        missing = [f for f in required if f not in data]
        if missing:
            raise ValueError(f"Missing student fields: {missing}")

    def fill(self, profile, data):
        profile.profile_type = Profile.Types.STUDENT
        profile.university = data['university']
        profile.current_grade = data['current_grade']
        profile.preferences_about_tutors = data['preferences_about_tutors']


class ProfileFactory:
    STRATEGIES = {
        Profile.Types.TUTOR: TutorProfileStrategy(),
        Profile.Types.STUDENT: StudentProfileStrategy(),
    }

    @classmethod
    def create(cls, user, data: dict) -> Profile:
        p = Profile(user=user)
        strat = cls.STRATEGIES[data['profile_type']]
        strat.validate(data)
        strat.fill(p, data)
        p.save()
        return p

    @classmethod
    def update(cls, instance: Profile, data: dict) -> Profile:
        strat = cls.STRATEGIES[data.get('profile_type', instance.profile_type)]
        strat.validate(data)
        strat.fill(instance, data)
        instance.save()
        return instance
