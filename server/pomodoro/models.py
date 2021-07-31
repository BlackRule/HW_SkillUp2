from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Todo(models.Model):
    created = models.DateTimeField(default=timezone.now)
    #TODO why  created = models.DateTimeField(auto_now_add=True) doesnt work?!
    createdBy = models.ForeignKey(User,on_delete=models.CASCADE)
    text = models.TextField()
    done = models.BooleanField()
    class Meta:
        ordering = ['created']