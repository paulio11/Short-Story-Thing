from django.urls import path

from .views import ProfileList, ProfileDetail, DeleteAccount


urlpatterns = [
    path("list/", ProfileList.as_view()),
    path("<str:username>", ProfileDetail.as_view()),
    path("delete/", DeleteAccount.as_view())
]
