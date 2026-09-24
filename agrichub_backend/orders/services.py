from decimal import Decimal

from django.db import transaction

from cart.models import Cart
from delivery.models import Delivery
from notifications.models import Notification
from payments.models import Payment

from .models import Order, OrderItem


@transaction.atomic
def checkout(buyer, delivery_address, payment_method):
    """
    Checkout the authenticated person's cart.

    Multi-farmer workflow:

    Cart
        ↓
    Group items by farmer
        ↓
    Create Order per farmer
        ↓
    Create Order Items
        ↓
    Create Payment per order
        ↓
    Create Delivery per order
        ↓
    Notify buyer and farmer
        ↓
    Clear Cart
    """

    cart = Cart.objects.prefetch_related(
        "items__product__farmer"
    ).get(
        buyer=buyer
    )

    cart_items = cart.items.all()

    if not cart_items.exists():
        raise ValueError(
            "Your cart is empty."
        )

    # Group cart items by farmer profile
    farmer_orders = {}

    for item in cart_items:

        farmer = item.product.farmer

        if farmer not in farmer_orders:
            farmer_orders[farmer] = []

        farmer_orders[farmer].append(item)

    created_orders = []

    for farmer, items in farmer_orders.items():

        order = Order.objects.create(
            buyer=buyer,
            farmer=farmer,
            status=Order.PENDING,
        )

        total_amount = Decimal("0.00")

        for item in items:

            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )

            total_amount += (
                item.product.price *
                item.quantity
            )

        payment = Payment.objects.create(
            order=order,
            method=payment_method,
            status=Payment.PENDING,
            amount=total_amount,
        )

        delivery = Delivery.objects.create(
            order=order,
            address=delivery_address,
            status=Delivery.PENDING,
        )

        # Notify buyer
        Notification.objects.create(
            user=buyer,
            title="Order Created",
            message=(
                f"Your order #{order.id} "
                "has been created successfully "
                "and is awaiting payment."
            ),
            notification_type=Notification.NEW_ORDER,
        )

        # Notify farmer
        Notification.objects.create(
            user=farmer.user,
            title="New Order Received",
            message=(
                f"You have received a new order "
                f"#{order.id} from a buyer."
            ),
            notification_type=Notification.NEW_ORDER,
        )

        created_orders.append(
            {
                "order": order,
                "payment": payment,
                "delivery": delivery,
            }
        )

    # Clear cart after successful checkout
    cart.items.all().delete()

    return created_orders