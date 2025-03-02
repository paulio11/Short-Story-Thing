from django.db import models
from django.contrib.auth.models import User


class Story(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="story"
    )
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=400)
    author = models.CharField(max_length=200)
    content = models.TextField()
    is_public = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Stories"
        ordering = ["-created"]
