from django.conf import settings
from django.db import models


class Notification(models.Model):
    """
    Represents a notification sent to a user.
    """

    REGISTRATION = "registration"
    PRODUCT_APPROVAL = "product_approval"
    NEW_ORDER = "new_order"
    PAYMENT_UPDATE = "payment_update"
    DELIVERY_UPDATE = "delivery_update"
    CONNECTION = "connection"

    NOTIFICATION_TYPE_CHOICES = [
        (REGISTRATION, "Registration"),
        (PRODUCT_APPROVAL, "Product Approval"),
        (NEW_ORDER, "New Order"),
        (PAYMENT_UPDATE, "Payment Update"),
        (DELIVERY_UPDATE, "Delivery Update"),
        (CONNECTION, "Connection"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPE_CHOICES,
    )

    # ADD THIS: Stores the related Order ID (or other model ID)
    reference_id = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="ID of the related object (e.g., Order ID)",
    )

    is_read = models.BooleanField(
        default=False,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.title} → {self.user.email}"