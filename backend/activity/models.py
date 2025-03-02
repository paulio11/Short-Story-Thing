from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

from story.models import Story


class Activity(models.Model):
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="activity"
    )
    story = models.ForeignKey(
        Story, on_delete=models.CASCADE, related_name="activity"
    )
    progress = models.DecimalField(blank=True, null=True, max_digits=5, decimal_places=2, validators=[
        MinValueValidator(Decimal("0.00")), MaxValueValidator(
            Decimal("100.00"))
    ])
    date = models.DateTimeField(auto_now_add=True)
    note = models.TextField(max_length=500, blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True, validators=[
        MinValueValidator(0), MaxValueValidator(5)
    ])
    is_public = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Activity"
        ordering = ["-date"]
