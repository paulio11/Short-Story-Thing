from rest_framework import serializers

from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")
    title = serializers.ReadOnlyField(source="story.title")
    author = serializers.ReadOnlyField(source="story.author")

    class Meta:
        model = Activity
        fields = "__all__"
