from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for user notifications.
    """

    user = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = [
            "id",
            "user",
            "title",
            "message",
            "notification_type",
            "reference_id",
            "is_read",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "reference_id",
            "created_at",
        ]