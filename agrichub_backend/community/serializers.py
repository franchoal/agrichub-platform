from rest_framework import serializers

from .models import Post, Comment, Reaction, Connection


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_email = serializers.EmailField(
        source="author.email",
        read_only=True,
    )

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_name",
            "author_email",
            "content",
            "post_type",
            "location",
            "image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "author",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "author",
            "author_name",
            "content",
            "parent",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "author",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = [
            "id",
            "post",
            "user",
            "reaction_type",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "created_at",
        ]


class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = [
            "id",
            "follower",
            "following",
            "created_at",
        ]
        read_only_fields = [
            "follower",
            "created_at",
        ]