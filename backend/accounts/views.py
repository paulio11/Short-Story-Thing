from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404

from main.permissions import IsOwnerOrReadOnly
from .serializers import ProfileSerializer
from .models import Profile


class ProfileList(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]
    queryset = Profile.objects.all()
    search_fields = ["owner__username"]
    filter_backends = [SearchFilter]


class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()
    lookup_field = "owner__username"
    lookup_url_kwarg = "username"


class DeleteAccount(APIView):
    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({"detail:" "Account deleted successfully."})
