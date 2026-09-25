from rest_framework import serializers

from .models import Post, Comment, Reaction, Connection


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_email = serializers.EmailField(
        source="author.email",
        read_only=True,
    )
    author_photo = serializers.ImageField(
        source="author.profile.photo",
        read_only=True,
    )
    author_connection_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_name",
            "author_email",
            "author_photo",
            "author_connection_count",
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

    def get_author_connection_count(self, obj):
        return (
            Connection.objects.filter(
                follower=obj.author,
                status=Connection.ACCEPTED,
            ).count()
            + Connection.objects.filter(
                following=obj.author,
                status=Connection.ACCEPTED,
            ).count()
        )


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
            "id",
            "post",
            "author",
            "author_name",
            "created_at",
            "updated_at",
        ]

    def get_author_name(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}".strip()

    def validate_content(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Comment cannot be empty."
            )

        return value


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
            "id",
            "user",
            "created_at",
        ]


class ConnectionSerializer(serializers.ModelSerializer):
    follower_name = serializers.SerializerMethodField()
    following_name = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = [
            "id",
            "follower",
            "follower_name",
            "following",
            "following_name",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "follower",
            "follower_name",
            "status",
            "created_at",
            "updated_at",
        ]

    def get_follower_name(self, obj):
        return (
            f"{obj.follower.first_name} "
            f"{obj.follower.last_name}"
        ).strip()

    def get_following_name(self, obj):
        return (
            f"{obj.following.first_name} "
            f"{obj.following.last_name}"
        ).strip()