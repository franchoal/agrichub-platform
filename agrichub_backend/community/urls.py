from django.urls import path

from .views import (
    PostListCreateView,
    PostDetailView,
    CommentListCreateView,
    ReactionListCreateView,
    ConnectionListCreateView,
    ConnectionRequestListView,
    ConnectionAcceptView,
    ConnectionRejectView,
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
    path(
        "connections/requests/",
        ConnectionRequestListView.as_view(),
        name="community-connection-requests",
    ),
    path(
        "connections/<int:pk>/accept/",
        ConnectionAcceptView.as_view(),
        name="community-connection-accept",
    ),
    path(
        "connections/<int:pk>/reject/",
        ConnectionRejectView.as_view(),
        name="community-connection-reject",
    ),
]