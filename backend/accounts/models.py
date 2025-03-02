from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save


# User profile model, can be added to if necessary later
class Profile(models.Model):
    owner = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="profile"
    )
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner}'s profile"


# Function to create user profile
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(owner=instance)


# Connection to create profile on creation of a new user
post_save.connect(create_profile, sender=User)
