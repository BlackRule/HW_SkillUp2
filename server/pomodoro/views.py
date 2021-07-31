from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics, renderers
from rest_framework import permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from pomodoro.models import Todo
from pomodoro.serializers import UserSerializer, GroupSerializer, TodoSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


class TodoSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(createdBy=self.request.user)

    def perform_create(self, serializer):
        serializer.save(createdBy=self.request.user)

    @action(detail=False)
    def delete_all(self, request, *args, **kwargs):
        print(request.method)
        deleted, rowsCount = Todo.objects.filter(createdBy=self.request.user).delete()
        return Response(data={"rowsCount": rowsCount})
