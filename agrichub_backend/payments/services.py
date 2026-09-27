from django.db import transaction

from notifications.models import Notification
from orders.models import Order

from .models import Payment


@transaction.atomic
def confirm_payment(payment):
    """
    Confirm a pending payment and update
    the marketplace order workflow.
    """

    if payment.status != Payment.PENDING:
        raise ValueError(
            "Payment has already been processed."
        )

    payment.status = Payment.SUCCESSFUL

    payment.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    order = payment.order

    order.status = Order.ACCEPTED

    order.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )

    Notification.objects.create(
        user=order.buyer,
        title="Payment Successful",
        message=(
            f"Payment for Order #{order.id} "
            "was successful. Your order has been accepted."
        ),
        notification_type=Notification.PAYMENT_UPDATE,
    )

    return payment