from django.contrib.auth.models import User, Group
from rest_framework import serializers
from pomodoro.models import Todo


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class TodoSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    created = serializers.DateTimeField(required=False)
    createdBy = serializers.PrimaryKeyRelatedField(read_only=True)
    text = serializers.CharField()
    done = serializers.BooleanField()

    def create(self, validated_data):
        return Todo.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.text = validated_data.get('text', instance.text)
        instance.done = validated_data.get('done', instance.done)
        instance.save()
        return instance

