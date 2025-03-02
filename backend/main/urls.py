from django.contrib import admin
from django.urls import path, include

from .views import CustomUserDetailsView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("story/", include("story.urls")),
    path("activity/", include("activity.urls")),
    path("dj-rest-auth/user/", CustomUserDetailsView.as_view()),
    path("dj-rest-auth/", include("dj_rest_auth.urls")),
    path("dj-rest-auth/registration/", include("dj_rest_auth.registration.urls"))
]
