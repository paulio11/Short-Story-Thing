from rest_framework import serializers
from django.utils import timezone
import datetime

from .models import Profile
from story.models import Story
from activity.models import Activity


# User profile serializer with extra fields for profile page
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="owner.username")
    stories_uploaded = serializers.SerializerMethodField()
    stories_read = serializers.SerializerMethodField()
    stories_rated = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    days_active = serializers.SerializerMethodField()
    current_streak = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = "__all__"

    def get_stories_uploaded(self, obj):
        return Story.objects.filter(owner=obj.owner).count()

    def get_stories_read(self, obj):
        return Activity.objects.filter(owner=obj.owner, progress=100.00).values(
            "story_id").distinct().count()

    def get_latest_activity(self, owner):
        return Activity.objects.filter(owner=owner).order_by("story_id", "-date").distinct("story_id")

    def get_stories_rated(self, obj):
        activities = list(self.get_latest_activity(
            obj.owner).filter(rating__gte=1))
        return len(activities)

    def get_average_rating(self, obj):
        activities = list(self.get_latest_activity(
            obj.owner).filter(rating__gte=1))
        if not activities:
            return 0
        total_rating = sum(activity.rating for activity in activities)
        return round(total_rating / len(activities), 1)

    def get_days_active(self, obj):
        unique_days = Activity.objects.filter(
            owner=obj.owner).dates('date', 'day')
        return unique_days.count()

    def get_current_streak(self, obj):
        # Get the set of unique dates when an activity occurred
        active_dates = set(
            Activity.objects.filter(owner=obj.owner).dates('date', 'day')
        )

        streak = 0

        # Today will continue streak
        today = timezone.now().date()
        if today in active_dates:
            streak += 1

        # Always count yesterday as 1 if activity exists
        yesterday = today - datetime.timedelta(days=1)
        if yesterday in active_dates:
            streak += 1

        # Continue to check previous days until it stops
        prev_day = yesterday - datetime.timedelta(days=1)
        while prev_day in active_dates:
            streak += 1
            prev_day -= datetime.timedelta(days=1)

        return streak
