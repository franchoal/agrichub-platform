from rest_framework import generics, permissions

from .models import Post, Comment, Reaction, Connection
from .serializers import (
    PostSerializer,
    CommentSerializer,
    ReactionSerializer,
    ConnectionSerializer,
)


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.select_related("author").all()
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


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
        serializer.save(
            user=self.request.user,
            post_id=self.kwargs["post_id"],
        )


class ConnectionListCreateView(generics.ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Connection.objects.filter(
            follower=self.request.user
        ).select_related("following")

    def perform_create(self, serializer):
        serializer.save(follower=self.request.user)
