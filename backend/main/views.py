from dj_rest_auth.views import UserDetailsView
from .serializers import CurrentUserSerializer


class CustomUserDetailsView(UserDetailsView):
    serializer_class = CurrentUserSerializer
