from django.urls import path

from .views import (
    PostListCreateView,
    PostDetailView,
    CommentListCreateView,
    ReactionListCreateView,
    ConnectionListCreateView,
)


urlpatterns = [
    path(
        "posts/",
        PostListCreateView.as_view(),
        name="community-post-list",
    ),
    path(
        "posts/<int:pk>/",
        PostDetailView.as_view(),
        name="community-post-detail",
    ),
    path(
        "posts/<int:post_id>/comments/",
        CommentListCreateView.as_view(),
        name="community-comment-list",
    ),
    path(
        "posts/<int:post_id>/reactions/",
        ReactionListCreateView.as_view(),
        name="community-reaction-list",
    ),
    path(
        "connections/",
        ConnectionListCreateView.as_view(),
        name="community-connection-list",
    ),
]