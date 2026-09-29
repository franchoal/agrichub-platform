import os
import subprocess
import tempfile

import imageio_ffmpeg

from django.db import transaction
from django.db.models import Q

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from farmers.models import FarmerProfile
from farmers.serializers import FarmerProductSerializer
from notifications.models import Notification

from .models import Connection, Post, Comment, Reaction
from .serializers import (
    PostSerializer,
    CommentSerializer,
    ReactionSerializer,
    ConnectionSerializer,
)


# ============================================================
# COMMUNITY VIDEO SETTINGS
# ============================================================

MAX_VIDEO_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_VIDEO_DURATION = 10.0  # seconds

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-matroska",
}


# ============================================================
# PROFILE VALIDATION
# ============================================================

def require_complete_profile(user):
    """
    Require the authenticated user to complete
    their general AgricWise profile before
    participating in community activities.

    A complete profile requires:
    - Location
    - Bio
    """

    if (
        not hasattr(user, "profile")
        or not user.profile.is_complete
    ):
        raise ValidationError(
            {
                "profile": (
                    "Please complete your profile "
                    "with your location and bio "
                    "before continuing."
                )
            }
        )


# ============================================================
# POST MANAGEMENT PERMISSION
# ============================================================

def can_manage_post(user, post):
    """
    Determine whether a user can edit or delete a post.

    Allowed:
    - The original post author
    - Django staff/admin users

    This deliberately uses is_staff rather than checking
    for a specific username or email address.
    """

    return (
        user.is_authenticated
        and (
            user.is_staff
            or post.author_id == user.id
        )
    )


def require_post_management_permission(user, post):
    """
    Raise PermissionDenied unless the authenticated user
    is either the post owner or a Django staff/admin user.
    """

    if not can_manage_post(user, post):
        raise PermissionDenied(
            "You can only manage your own posts."
        )


# ============================================================
# VIDEO VALIDATION
# ============================================================

def validate_community_video(video):
    """
    Validate community videos before they are stored
    in Cloudinary.

    Rules:
    - Supported video MIME type
    - Maximum file size of 10 MB
    - Maximum duration of 10 seconds
    """

    if video is None:
        return

    content_type = getattr(
        video,
        "content_type",
        None,
    )

    if content_type not in ALLOWED_VIDEO_TYPES:
        raise ValidationError(
            {
                "video": (
                    "Please upload a supported video format. "
                    "MP4, WebM, MOV or MKV videos are supported."
                )
            }
        )

    if video.size > MAX_VIDEO_SIZE:
        raise ValidationError(
            {
                "video": (
                    "Video file is too large. "
                    "Please upload a video smaller than 10 MB."
                )
            }
        )

    temp_path = None

    try:
        suffix = os.path.splitext(
            getattr(video, "name", "")
        )[1] or ".mp4"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_path = temp_file.name

            for chunk in video.chunks():
                temp_file.write(chunk)

        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

        command = [
            ffmpeg,
            "-i",
            temp_path,
            "-f",
            "null",
            "-",
        ]

        result = subprocess.run(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )

        if result.returncode != 0:
            raise ValidationError(
                {
                    "video": (
                        "The uploaded video could not be "
                        "processed. Please upload a valid video."
                    )
                }
            )

        duration = None

        for line in result.stderr.splitlines():
            if "Duration:" in line:
                duration_text = (
                    line.split(
                        "Duration:",
                        1,
                    )[1]
                    .strip()
                    .split(",", 1)[0]
                )

                hours, minutes, seconds = (
                    duration_text.split(":")
                )

                duration = (
                    (float(hours) * 3600)
                    + (float(minutes) * 60)
                    + float(seconds)
                )

                break

        if duration is None:
            raise ValidationError(
                {
                    "video": (
                        "Unable to determine the video duration. "
                        "Please try another video."
                    )
                }
            )

        if duration > MAX_VIDEO_DURATION:
            raise ValidationError(
                {
                    "video": (
                        "Community videos must be 10 seconds "
                        "or shorter."
                    )
                }
            )

    except ValidationError:
        raise

    except (
        ValueError,
        TypeError,
        OSError,
        subprocess.SubprocessError,
    ):
        raise ValidationError(
            {
                "video": (
                    "Unable to process the uploaded video. "
                    "Please try another video."
                )
            }
        )

    finally:
        if (
            temp_path
            and os.path.exists(temp_path)
        ):
            os.remove(temp_path)

        # Validation consumed the uploaded file.
        # Reset it so Django/Cloudinary can upload it afterward.
        try:
            video.seek(0)
        except (
            AttributeError,
            OSError,
        ):
            pass


# ============================================================
# COMMUNITY POSTS
# ============================================================

class PostListCreateView(
    generics.ListCreateAPIView
):
    """
    List community posts or create a normal discussion post.

    GET:
        Public.

    POST:
        Authenticated users only.
    """

    queryset = (
        Post.objects
        .select_related(
            "author",
            "product",
        )
        .all()
    )

    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                permissions.IsAuthenticated()
            ]

        return [
            permissions.AllowAny()
        ]

    @transaction.atomic
    def perform_create(self, serializer):
        require_complete_profile(
            self.request.user
        )

        post_type = serializer.validated_data.get(
            "post_type",
            Post.DISCUSSION,
        )

        # Marketplace posts must go through the dedicated
        # marketplace creation flow because they create both
        # a Product and a Community Post.
        if post_type == Post.MARKETPLACE:
            raise ValidationError(
                {
                    "post_type": (
                        "Marketplace listings must be created "
                        "through the marketplace listing flow."
                    )
                }
            )

        video = self.request.FILES.get(
            "video"
        )

        validate_community_video(video)

        serializer.save(
            author=self.request.user
        )


# ============================================================
# MARKETPLACE POST CREATION
# ============================================================

class MarketplacePostCreateView(APIView):
    """
    Create a marketplace Product and a linked
    Community Marketplace post in one transaction.

    The Product remains the source of truth for
    the marketplace listing.

    Community media such as short videos belong
    to the Community Post.
    """

    permission_classes = [
        permissions.IsAuthenticated
    ]

    @transaction.atomic
    def post(self, request):
        require_complete_profile(
            request.user
        )

        farmer_profile = (
            FarmerProfile.objects
            .filter(
                user=request.user
            )
            .first()
        )

        if farmer_profile is None:
            raise PermissionDenied(
                "Please create your farmer profile "
                "before creating a Marketplace listing."
            )

        content = str(
            request.data.get(
                "content",
                "",
            )
        ).strip()

        if not content:
            raise ValidationError(
                {
                    "content": (
                        "Please write something about "
                        "this listing."
                    )
                }
            )

        product_data = {
            "category": request.data.get(
                "category"
            ),
            "name": request.data.get(
                "name"
            ),
            "description": request.data.get(
                "description",
                "",
            ),
            "price": request.data.get(
                "price"
            ),
            "quantity": request.data.get(
                "quantity"
            ),
            "unit": request.data.get(
                "unit"
            ),
        }

        image = request.FILES.get(
            "image"
        )

        if image:
            product_data["image"] = image

        video = request.FILES.get(
            "video"
        )

        validate_community_video(video)

        product_serializer = (
            FarmerProductSerializer(
                data=product_data
            )
        )

        product_serializer.is_valid(
            raise_exception=True
        )

        product = product_serializer.save(
            farmer=farmer_profile,
            is_available=True,
        )

        post = Post.objects.create(
            author=request.user,
            content=content,
            post_type=Post.MARKETPLACE,
            location=str(
                request.data.get(
                    "location",
                    "",
                )
            ).strip(),
            product=product,
            video=video,
        )

        return Response(
            {
                "post": PostSerializer(
                    post,
                    context={
                        "request": request,
                    },
                ).data,
                "product": FarmerProductSerializer(
                    product
                ).data,
            },
            status=201,
        )


# ============================================================
# SINGLE POST
# ============================================================

class PostDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, edit or delete a community post.

    GET:
        Public.

    PUT/PATCH:
        Allowed for:
        - Post owner
        - Django staff/admin

    DELETE:
        Allowed for:
        - Post owner
        - Django staff/admin
    """

    queryset = (
        Post.objects
        .select_related(
            "author",
            "product",
        )
        .all()
    )

    serializer_class = PostSerializer

    def get_permissions(self):
        if self.request.method in [
            "PUT",
            "PATCH",
            "DELETE",
        ]:
            return [
                permissions.IsAuthenticated()
            ]

        return [
            permissions.AllowAny()
        ]

    def perform_update(self, serializer):
        post = self.get_object()

        require_post_management_permission(
            self.request.user,
            post,
        )

        require_complete_profile(
            self.request.user
        )

        video = self.request.FILES.get(
            "video"
        )

        validate_community_video(video)

        serializer.save()

    def perform_destroy(self, instance):
        require_post_management_permission(
            self.request.user,
            instance,
        )

        instance.delete()


# ============================================================
# COMMENTS
# ============================================================

class CommentListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = CommentSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        return (
            Comment.objects
            .filter(
                post_id=self.kwargs[
                    "post_id"
                ]
            )
            .select_related(
                "author"
            )
        )

    def perform_create(self, serializer):
        require_complete_profile(
            self.request.user
        )

        serializer.save(
            author=self.request.user,
            post_id=self.kwargs[
                "post_id"
            ],
        )


# ============================================================
# REACTIONS
# ============================================================

class ReactionListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ReactionSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        return (
            Reaction.objects
            .filter(
                post_id=self.kwargs[
                    "post_id"
                ]
            )
            .select_related(
                "user"
            )
        )

    def perform_create(self, serializer):
        require_complete_profile(
            self.request.user
        )

        serializer.save(
            user=self.request.user,
            post_id=self.kwargs[
                "post_id"
            ],
        )


# ============================================================
# CONNECTIONS
# ============================================================

class ConnectionListCreateView(
    generics.ListCreateAPIView
):
    serializer_class = ConnectionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return (
            Connection.objects
            .filter(
                Q(
                    follower=self.request.user,
                    status=Connection.ACCEPTED,
                )
                | Q(
                    following=self.request.user,
                    status=Connection.ACCEPTED,
                )
            )
            .select_related(
                "follower",
                "following",
            )
        )

    def perform_create(self, serializer):
        require_complete_profile(
            self.request.user
        )

        following = (
            serializer.validated_data[
                "following"
            ]
        )

        if following == self.request.user:
            raise ValidationError(
                "You cannot connect with yourself."
            )

        existing = (
            Connection.objects
            .filter(
                Q(
                    follower=self.request.user,
                    following=following,
                )
                | Q(
                    follower=following,
                    following=self.request.user,
                )
            )
            .first()
        )

        if existing:
            if (
                existing.status
                == Connection.ACCEPTED
            ):
                raise ValidationError(
                    "You are already connected with "
                    "this user."
                )

            existing.follower = (
                self.request.user
            )
            existing.following = following
            existing.status = (
                Connection.ACCEPTED
            )

            existing.save(
                update_fields=[
                    "follower",
                    "following",
                    "status",
                    "updated_at",
                ]
            )

        else:
            serializer.save(
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


# ============================================================
# CONNECTION REQUESTS
# ============================================================

class ConnectionRequestListView(
    generics.ListAPIView
):
    serializer_class = ConnectionSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return (
            Connection.objects
            .filter(
                following=self.request.user,
                status=Connection.PENDING,
            )
            .select_related(
                "follower",
                "following",
            )
        )


# ============================================================
# ACCEPT CONNECTION
# ============================================================

class ConnectionAcceptView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, pk):
        try:
            connection = (
                Connection.objects
                .select_related(
                    "follower",
                    "following",
                )
                .get(
                    pk=pk,
                    following=request.user,
                    status=Connection.PENDING,
                )
            )

        except Connection.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Connection request not found."
                    )
                },
                status=404,
            )

        connection.status = (
            Connection.ACCEPTED
        )

        connection.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            ConnectionSerializer(
                connection
            ).data
        )


# ============================================================
# REJECT CONNECTION
# ============================================================

class ConnectionRejectView(APIView):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, pk):
        try:
            connection = (
                Connection.objects
                .get(
                    pk=pk,
                    following=request.user,
                    status=Connection.PENDING,
                )
            )

        except Connection.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Connection request not found."
                    )
                },
                status=404,
            )

        connection.status = (
            Connection.REJECTED
        )

        connection.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        return Response(
            ConnectionSerializer(
                connection
            ).data
        )