from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification

from .models import Post, Comment, Reaction, Connection
from .serializers import (
    PostSerializer,
    CommentSerializer,
    ReactionSerializer,
    ConnectionSerializer,
)


def require_complete_profile(user):
    if not hasattr(user, "profile") or not user.profile.is_complete:
        raise permissions.PermissionDenied(
            "Please complete your profile before participating in the community."
        )


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.select_related("author").all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        require_complete_profile(self.request.user)

        serializer.save(
            author=self.request.user
        )


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.select_related("author").all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        if self.get_object().author != self.request.user:
            raise permissions.PermissionDenied(
                "You can only edit your own posts."
            )

        require_complete_profile(self.request.user)

        serializer.save()

    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            raise permissions.PermissionDenied(
                "You can only delete your own posts."
            )

        instance.delete()


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Comment.objects.filter(
            post_id=self.kwargs["post_id"]
        ).select_related("author")

    def perform_create(self, serializer):
        require_complete_profile(self.request.user)

        serializer.save(
            author=self.request.user,
            post_id=self.kwargs["post_id"],
        )


class ReactionListCreateView(generics.ListCreateAPIView):
    serializer_class = ReactionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Reaction.objects.filter(
            post_id=self.kwargs["post_id"]
        ).select_related("user")

    def perform_create(self, serializer):
        require_complete_profile(self.request.user)

        serializer.save(
            user=self.request.user,
            post_id=self.kwargs["post_id"],
        )


class ConnectionListCreateView(generics.ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(
            Q(
                follower=self.request.user,
                status=Connection.ACCEPTED,
            )
            | Q(
                following=self.request.user,
                status=Connection.ACCEPTED,
            )
        ).select_related(
            "follower",
            "following",
        )

    def perform_create(self, serializer):
        require_complete_profile(self.request.user)

        following = serializer.validated_data["following"]

        if following == self.request.user:
            raise ValidationError(
                "You cannot connect with yourself."
            )

        existing = Connection.objects.filter(
            Q(
                follower=self.request.user,
                following=following,
            )
            | Q(
                follower=following,
                following=self.request.user,
            )
        ).first()

        if existing:
            if existing.status == Connection.ACCEPTED:
                raise ValidationError(
                    "You are already connected with this user."
                )

            existing.follower = self.request.user
            existing.following = following
            existing.status = Connection.ACCEPTED
            existing.save(
                update_fields=[
                    "follower",
                    "following",
                    "status",
                    "updated_at",
                ]
            )

            connection = existing

        else:
            connection = serializer.save(
                follower=self.request.user,
                status=Connection.ACCEPTED,
            )

        Notification.objects.create(
            user=following,
            title="New connection",
            message=(
                f"{self.request.user.first_name} "
                f"{self.request.user.last_name}".strip()
                + " connected with you on AgricWise."
            ),
            notification_type="connection",
        )


class ConnectionRequestListView(generics.ListAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(
            following=self.request.user,
            status=Connection.PENDING,
        ).select_related(
            "follower",
            "following",
        )


class ConnectionAcceptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            connection = Connection.objects.select_related(
                "follower",
                "following",
            ).get(
                pk=pk,
                following=request.user,
                status=Connection.PENDING,
            )
        except Connection.DoesNotExist:
            return Response(
                {"detail": "Connection request not found."},
                status=404,
            )

        connection.status = Connection.ACCEPTED
        connection.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            ConnectionSerializer(connection).data
        )


class ConnectionRejectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            connection = Connection.objects.get(
                pk=pk,
                following=request.user,
                status=Connection.PENDING,
            )
        except Connection.DoesNotExist:
            return Response(
                {"detail": "Connection request not found."},
                status=404,
            )

        connection.status = Connection.REJECTED
        connection.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            ConnectionSerializer(connection).data
        )