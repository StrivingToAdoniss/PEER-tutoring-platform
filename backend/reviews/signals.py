from django.db.models import Avg
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Review


@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_profile_rating(sender, instance, **kwargs):
    profile = instance.profile
    agg = profile.reviews.aggregate(avg_rating=Avg("rating"))
    profile.avg_rating = agg["avg_rating"] or 0
    profile.save(update_fields=["avg_rating"])
