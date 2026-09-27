from decimal import Decimal

from django.db import transaction

from cart.models import Cart
from delivery.models import Delivery
from notifications.models import Notification
from payments.models import Payment
from products.models import Product

from .models import Order, OrderItem


@transaction.atomic
def checkout(buyer, delivery_address, payment_method):
    """
    Checkout the authenticated person's cart.

    Multi-farmer workflow:

    Cart
        ↓
    Lock cart
        ↓
    Lock products and validate stock
        ↓
    Group items by farmer
        ↓
    Create Order per farmer
        ↓
    Create Order Items
        ↓
    Deduct product stock
        ↓
    Create Payment per order
        ↓
    Create Delivery per order
        ↓
    Notify buyer and farmer
        ↓
    Clear Cart
    """

    cart = (
        Cart.objects
        .select_for_update()
        .get(buyer=buyer)
    )

    cart_items = list(
        cart.items.select_related(
            "product"
        ).all()
    )

    if not cart_items:
        raise ValueError(
            "Your cart is empty."
        )

    # Lock every product involved in this checkout.
    #
    # This prevents two concurrent checkouts from
    # consuming the same remaining stock.
    locked_items = []

    for cart_item in cart_items:
        product = (
            Product.objects
            .select_for_update()
            .select_related("farmer")
            .get(pk=cart_item.product_id)
        )

        if not product.is_available:
            raise ValueError(
                f"'{product.name}' is no longer available."
            )

        if cart_item.quantity > product.quantity:
            raise ValueError(
                f"Insufficient stock for '{product.name}'. "
                f"Available quantity: {product.quantity}."
            )

        locked_items.append(
            {
                "cart_item": cart_item,
                "product": product,
            }
        )

    # Group validated items by farmer profile.
    farmer_orders = {}

    for item in locked_items:
        product = item["product"]
        farmer = product.farmer

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
            cart_item = item["cart_item"]
            product = item["product"]

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=cart_item.quantity,
                price=product.price,
            )

            total_amount += (
                product.price *
                cart_item.quantity
            )

            # Deduct stock while the product row is locked.
            product.quantity -= cart_item.quantity

            if product.quantity == 0:
                product.is_available = False

            product.save(
                update_fields=[
                    "quantity",
                    "is_available",
                    "updated_at",
                ]
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

        # Notify buyer.
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

        # Notify farmer.
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

    # Clear cart only after all orders, payments,
    # deliveries and stock updates have succeeded.
    cart.items.all().delete()

    return created_orders