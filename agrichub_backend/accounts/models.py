from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)

from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    """
    Custom user manager for AgricWise users.
    """

    def create_user(
        self,
        email,
        password=None,
        **extra_fields
    ):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(
        self,
        email,
        password=None,
        **extra_fields
    ):
        extra_fields.setdefault(
            "is_staff",
            True
        )

        extra_fields.setdefault(
            "is_superuser",
            True
        )

        extra_fields.setdefault(
            "is_active",
            True
        )

        return self.create_user(
            email,
            password,
            **extra_fields
        )


class User(
    AbstractBaseUser,
    PermissionsMixin
):
    """
    Main AgricWise user account.

    A User represents a person.
    Activities such as buying, selling, offering services,
    requesting products or services, and participating in
    the community are handled separately from account identity.

    The role field is temporarily retained for migration
    compatibility and will be removed after all legacy
    dependencies have been migrated.
    """

    BUYER = "buyer"
    FARMER = "farmer"

    ROLE_CHOICES = (
        (BUYER, "Buyer"),
        (FARMER, "Farmer"),
    )

    email = models.EmailField(
        unique=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    phone_number = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )

    # Legacy field retained temporarily for migration compatibility.
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=BUYER
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    is_verified = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        default=timezone.now
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
    ]

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def __str__(self):
        return self.email


class Profile(models.Model):
    """
    Person-centered profile for AgricWise users.

    This model holds identity and personal information
    that can grow independently from authentication and
    transaction activities.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    photo = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=255,
        blank=True
    )

    bio = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
    @property
    def is_complete(self):
        return bool(
            self.location.strip()
            and self.bio.strip()
        )
    def __str__(self):
        return f"{self.user.get_full_name()} Profile"