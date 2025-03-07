from django.db.models import Func, Q, Subquery, Value, IntegerField, OuterRef
from django.db.models.functions import Coalesce, Length, Trim
from rest_framework import generics, permissions, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
import random

from .serializers import StoryListSerializer, StorySerializer
from .models import Story
from activity.models import Activity
from main.permissions import IsOwnerOrReadOnly


# Calculates word count
class WordCount(Func):
    template = (
        "CASE WHEN TRIM(%(expressions)s) = '' THEN 0 "
        "ELSE LENGTH(TRIM(%(expressions)s)) - LENGTH(REPLACE(TRIM(%(expressions)s), ' ', '')) + 1 END"
    )
    output_field = IntegerField()


# Filter used by frontend form for filtering story list
class StoryFilter(filters.FilterSet):
    is_public = filters.BooleanFilter()
    user_progress = filters.MultipleChoiceFilter(
        method='filter_user_progress',
        choices=(
            ('0', '0'),
            ('100', '100'),
            ('inbetween', 'Everything in Between'),
        )
    )
    owner = filters.CharFilter(field_name='owner', lookup_expr='exact')

    class Meta:
        model = Story
        fields = ['is_public', 'user_progress', 'owner']

    # Provides options for read (100), reading (inbetween), and not read (0)
    def filter_user_progress(self, queryset, name, values):
        q = Q()
        if '0' in values:
            q |= Q(user_progress=0)
        if '100' in values:
            q |= Q(user_progress=100)
        if 'inbetween' in values:
            q |= Q(user_progress__gt=0, user_progress__lt=100)
        return queryset.filter(q)


class StoryPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 10
    page_query_param = "page"


class StoryList(generics.ListAPIView):
    # StoryListSerializer excludes story content field
    serializer_class = StoryListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'author']
    ordering_fields = ['user_progress', 'user_rating',
                       'title', 'word_count', 'created']
    filterset_class = StoryFilter
    ordering = ['-created']
    pagination_class = StoryPagination

    def get_queryset(self):
        user = self.request.user
        qs = Story.objects.all()

        if user.is_authenticated:
            qs = qs.filter(Q(owner=user) | Q(is_public=True))
            qs = qs.annotate(
                user_rating=Subquery(
                    Activity.objects.filter(
                        story=OuterRef('pk'),
                        owner=user
                    ).values('rating')[:1]
                ),
                user_progress=Coalesce(
                    Subquery(
                        Activity.objects.filter(
                            story=OuterRef('pk'),
                            owner=user
                        ).values('progress')[:1]
                    ),
                    Value(0),
                    output_field=IntegerField()
                ),
                # Annotate with computed word count
                word_count=WordCount('content')
            )
        else:
            qs = qs.filter(is_public=True).annotate(
                word_count=WordCount('content')
            )
        return qs


class StoryCreate(generics.CreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class StoryDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StorySerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Story.objects.filter(Q(is_public=True) | Q(owner=user))
        return Story.objects.filter(is_public=True)


# View returns ID of a random unread or in progress story
class RandomUnreadStory(generics.ListAPIView):
    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Story.objects.none()

        qs = Story.objects.annotate(
            user_progress=Coalesce(
                Subquery(
                    Activity.objects.filter(story=OuterRef(
                        'pk'), owner=user).values('progress')[:1]
                ),
                None
            )
        )

        return qs.filter(user_progress__isnull=True).filter(Q(is_public=True) | Q(owner=user))

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        count = queryset.count()

        if count == 0:
            return Response(
                {"detail": "No unread stories found."},
                status=status.HTTP_404_NOT_FOUND
            )

        random_story = queryset.order_by('?').first()

        return Response({"id": random_story.id}, status=status.HTTP_200_OK)
