from rest_framework import serializers

from .models import Story
from activity.models import Activity


class BaseStorySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    user_rating = serializers.SerializerMethodField()
    user_progress = serializers.SerializerMethodField()
    read_count = serializers.SerializerMethodField()
    word_count = serializers.SerializerMethodField()

    class Meta:
        model = Story

    def get_user_progress(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            user = request.user
            activity = Activity.objects.filter(
                story=obj.id,
                owner=user.id,
                progress__isnull=False
            ).exclude(progress=0).first()
            return activity.progress if activity else 0
        return None

    def get_user_rating(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            user = request.user
            activity = Activity.objects.filter(
                story=obj.id,
                owner=user.id,
                rating__isnull=False
            ).order_by("-date").first()
            return activity.rating if activity else None
        return None

    def get_read_count(self, obj):
        return Activity.objects.filter(story=obj.id).exclude(progress__lt=100).count()

    def get_word_count(self, obj):
        if not obj.content:
            return 0
        return len(obj.content.split())


# Story serializer for list views, excludes content field
class StoryListSerializer(BaseStorySerializer):
    class Meta(BaseStorySerializer.Meta):
        exclude = ("content",)


# Story serializer for reading/detail views, includes all fields
class StorySerializer(BaseStorySerializer):
    class Meta(BaseStorySerializer.Meta):
        fields = "__all__"
