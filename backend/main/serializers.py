from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer

from activity.models import Activity


# User serializer to replace default
class CurrentUserSerializer(UserDetailsSerializer):
    profile_id = serializers.ReadOnlyField(source="profile.id")
    is_staff = serializers.SerializerMethodField()
    last_reading = serializers.SerializerMethodField()

    def get_is_staff(self, obj):
        return obj.is_staff

    def get_last_reading(self, obj):
        last_activity = (
            Activity.objects
            .filter(owner=obj.pk, progress__gt=0)
            .first()
        )
        if last_activity:
            return {"story": last_activity.story.id, "progress": last_activity.progress}
        return None

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + \
            ('profile_id', 'is_staff', 'last_reading')
