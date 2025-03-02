from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend

from main.permissions import IsOwnerOrReadOnly
from .serializers import ActivitySerializer
from .models import Activity


class ActivityQuerySetMixin:
    # Queryset is restricted to show only public activity
    # Includes all logged in user's activity regardless of public/private
    def get_queryset(self):
        user = self.request.user
        public_activity = Activity.objects.filter(is_public=True)
        if user.is_authenticated:
            return public_activity | Activity.objects.filter(owner=user)
        return public_activity


class ActivityList(ActivityQuerySetMixin, generics.ListCreateAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        "owner__username": ["exact"],
        "story": ["exact"]
    }

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ActivityDetail(ActivityQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsOwnerOrReadOnly]
