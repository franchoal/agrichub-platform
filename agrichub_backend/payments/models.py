from django.db import models

from orders.models import Order


class Payment(models.Model):
    """
    Represents payment information for an order.

    Multiple farmer-specific payments may share one
    Paystack reference when a buyer checks out a cart
    containing products from multiple farmers.
    """

    CARD = "card"
    BANK_TRANSFER = "bank_transfer"

    PAYMENT_METHOD_CHOICES = [
        (CARD, "Card"),
        (BANK_TRANSFER, "Bank Transfer"),
    ]

    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    REFUNDED = "refunded"

    PAYMENT_STATUS_CHOICES = [
        (PENDING, "Pending"),
        (SUCCESSFUL, "Successful"),
        (FAILED, "Failed"),
        (REFUNDED, "Refunded"),
    ]

    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="payment",
    )

    method = models.CharField(
        max_length=30,
        choices=PAYMENT_METHOD_CHOICES,
    )

    status = models.CharField(
        max_length=30,
        choices=PAYMENT_STATUS_CHOICES,
        default=PENDING,
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    # A single Paystack transaction may settle multiple
    # farmer-specific payments. This field must not be unique.
    paystack_reference = models.CharField(
        max_length=100,
        blank=True,
        default="",
        db_index=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment"
        verbose_name_plural = "Payments"

    def __str__(self):
        return (
            f"Payment #{self.pk} - "
            f"Order #{self.order_id}"
        )
