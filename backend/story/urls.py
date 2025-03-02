from django.urls import path
from .views import StoryList, StoryDetail, StoryCreate, RandomUnreadStory


urlpatterns = [
    path("list/", StoryList.as_view()),
    path("<int:pk>", StoryDetail.as_view()),
    path("random/", RandomUnreadStory.as_view()),
    path("create/", StoryCreate.as_view())
]
