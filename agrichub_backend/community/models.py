from django.conf import settings
from django.db import models


class Post(models.Model):
    DISCUSSION = "discussion"
    KNOWLEDGE = "knowledge"
    ANNOUNCEMENT = "announcement"
    QUESTION = "question"

    POST_TYPE_CHOICES = [
        (DISCUSSION, "Discussion"),
        (KNOWLEDGE, "Knowledge"),
        (ANNOUNCEMENT, "Announcement"),
        (QUESTION, "Question"),
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

    location = models.CharField(
        max_length=255,
        blank=True,
    )

    image = models.ImageField(
        upload_to="community/posts/",
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

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["follower", "following"],
                name="unique_user_connection",
            )
        ]

    def __str__(self):
        return (
            f"{self.follower.first_name} "
            f"{self.follower.last_name}".strip()
            + " follows "
            + f"{self.following.first_name} "
            f"{self.following.last_name}".strip()
        )