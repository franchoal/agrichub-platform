from io import BytesIO

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.db.models import Q
from PIL import Image, ImageOps

from cloudinary_storage.storage import VideoMediaCloudinaryStorage

from products.models import Product


MAX_POST_IMAGE_SIZE = 1600
POST_IMAGE_QUALITY = 85


def prepare_post_image(image_file):
    """
    Resize and compress community post images before storage.

    - Preserves aspect ratio.
    - Corrects camera orientation.
    - Converts unsupported modes to RGB/RGBA as needed.
    - Limits the longest side to 1600px.
    - Compresses JPEG images to reduce file size.
    """

    if not image_file:
        return image_file

    try:
        image_file.seek(0)

        image = Image.open(image_file)
        image = ImageOps.exif_transpose(image)

        original_format = image.format

        if (
            image.width <= MAX_POST_IMAGE_SIZE
            and image.height <= MAX_POST_IMAGE_SIZE
        ):
            image_file.seek(0)
            return image_file

        image.thumbnail(
            (
                MAX_POST_IMAGE_SIZE,
                MAX_POST_IMAGE_SIZE,
            ),
            Image.Resampling.LANCZOS,
        )

        output = BytesIO()

        if original_format == "PNG":
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA")

            image.save(
                output,
                format="PNG",
                optimize=True,
            )

        elif original_format == "WEBP":
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGB")

            image.save(
                output,
                format="WEBP",
                quality=POST_IMAGE_QUALITY,
                method=6,
            )

        else:
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGB")

            image.save(
                output,
                format="JPEG",
                quality=POST_IMAGE_QUALITY,
                optimize=True,
            )

        output.seek(0)

        original_name = getattr(
            image_file,
            "name",
            "community-image",
        )

        if original_format not in ("PNG", "WEBP"):
            original_name = (
                original_name.rsplit(".", 1)[0]
                + ".jpg"
            )

        return ContentFile(
            output.read(),
            name=original_name,
        )

    except Exception:
        # Never allow image processing to break
        # an otherwise valid post upload.
        try:
            image_file.seek(0)
        except (AttributeError, OSError):
            pass

        return image_file


class Post(models.Model):
    DISCUSSION = "discussion"
    MARKETPLACE = "marketplace"

    POST_TYPE_CHOICES = [
        (DISCUSSION, "Discussion"),
        (MARKETPLACE, "Marketplace"),
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_posts",
    )

    content = models.TextField()

    post_type = models.CharField(
        max_length=20,
        choices=POST_TYPE_CHOICES,
        default=DISCUSSION,
    )

    product = models.OneToOneField(
        Product,
        on_delete=models.SET_NULL,
        related_name="community_post",
        blank=True,
        null=True,
    )

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    image = models.ImageField(
        upload_to="community/posts/",
        blank=True,
        null=True,
    )

    video = models.FileField(
        storage=VideoMediaCloudinaryStorage(),
        upload_to="community/posts/videos/",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if self.image and not self.image._committed:
            self.image = prepare_post_image(
                self.image
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.author.first_name} "
            f"{self.author.last_name}".strip()
            + f" - {self.post_type}"
        )


class Comment(models.Model):
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_comments",
    )

    content = models.TextField()

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        related_name="replies",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return (
            f"Comment by "
            f"{self.author.first_name} "
            f"{self.author.last_name}".strip()
        )


class Reaction(models.Model):
    LIKE = "like"
    LOVE = "love"
    HELPFUL = "helpful"

    REACTION_TYPE_CHOICES = [
        (LIKE, "Like"),
        (LOVE, "Love"),
        (HELPFUL, "Helpful"),
    ]

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="reactions",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_reactions",
    )

    reaction_type = models.CharField(
        max_length=20,
        choices=REACTION_TYPE_CHOICES,
        default=LIKE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["post", "user"],
                name="unique_post_reaction",
            )
        ]

    def __str__(self):
        return (
            f"{self.user.first_name} "
            f"{self.user.last_name}".strip()
            + f" - {self.reaction_type}"
        )


class Connection(models.Model):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

    CONNECTION_STATUS_CHOICES = [
        (PENDING, "Pending"),
        (ACCEPTED, "Accepted"),
        (REJECTED, "Rejected"),
    ]

    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following",
    )

    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers",
    )

    status = models.CharField(
        max_length=20,
        choices=CONNECTION_STATUS_CHOICES,
        default=PENDING,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_user_connection",
            ),
            models.CheckConstraint(
                condition=~Q(
                    follower=models.F("following")
                ),
                name="prevent_self_connection",
            ),
        ]

    def __str__(self):
        return (
            f"{self.follower.first_name} "
            f"{self.follower.last_name}".strip()
            + " → "
            + f"{self.following.first_name} "
            f"{self.following.last_name}".strip()
            + f" ({self.status})"
        )