
from rest_framework import serializers

from payments.models import Payment

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for items belonging to an order.
    """

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = OrderItem

        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
            "subtotal",
        ]

        read_only_fields = [
            "id",
            "product_name",
            "subtotal",
        ]


class OrderPaymentSerializer(serializers.ModelSerializer):
    """
    Compact, read-only payment information included with an order.
    """

    class Meta:
        model = Payment

        fields = [
            "id",
            "method",
            "status",
            "amount",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "method",
            "status",
            "amount",
            "created_at",
            "updated_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for order information.

    Enforces payment safeguards before an order can enter
    fulfillment or be cancelled after successful payment.

    Contact information is disclosed only to the buyer or
    assigned farmer when payment is successful and the order
    has been accepted.
    """

    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    total = serializers.SerializerMethodField()

    buyer = serializers.EmailField(
        source="buyer.email",
        read_only=True,
    )

    farmer = serializers.CharField(
        source="farmer.farm_name",
        read_only=True,
    )

    payment = OrderPaymentSerializer(
        read_only=True,
    )

    delivery = serializers.SerializerMethodField()

    contacts = serializers.SerializerMethodField()

    class Meta:
        model = Order

        fields = [
            "id",
            "buyer",
            "farmer",
            "status",
            "items",
            "total",
            "payment",
            "delivery",
            "contacts",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "buyer",
            "farmer",
            "items",
            "total",
            "payment",
            "delivery",
            "contacts",
            "created_at",
            "updated_at",
        ]

    def validate_status(self, value):
        """
        Validate order status progression and payment state.
        """

        order = self.instance

        if not order:
            return value

        current_status = order.status

        if value == current_status:
            return value

        allowed_transitions = {
            Order.PENDING: [
                Order.ACCEPTED,
                Order.CANCELLED,
            ],
            Order.ACCEPTED: [
                Order.PROCESSING,
                Order.CANCELLED,
            ],
            Order.PROCESSING: [
                Order.READY,
            ],
            Order.READY: [
                Order.OUT_FOR_DELIVERY,
            ],
            Order.OUT_FOR_DELIVERY: [
                Order.DELIVERED,
            ],
            Order.DELIVERED: [
                Order.COMPLETED,
            ],
        }

        if value not in allowed_transitions.get(
            current_status,
            [],
        ):
            raise serializers.ValidationError(
                "Invalid order status transition."
            )

        payment = getattr(order, "payment", None)

        if value == Order.ACCEPTED:
            if (
                payment is None
                or payment.status != Payment.SUCCESSFUL
            ):
                raise serializers.ValidationError(
                    "This order cannot be accepted until "
                    "payment has been confirmed."
                )

        fulfillment_statuses = [
            Order.PROCESSING,
            Order.READY,
            Order.OUT_FOR_DELIVERY,
            Order.DELIVERED,
            Order.COMPLETED,
        ]

        if value in fulfillment_statuses:
            if (
                payment is None
                or payment.status != Payment.SUCCESSFUL
            ):
                raise serializers.ValidationError(
                    "This order cannot proceed until "
                    "payment has been confirmed."
                )

        if value == Order.CANCELLED:
            if (
                payment is not None
                and payment.status == Payment.SUCCESSFUL
            ):
                raise serializers.ValidationError(
                    "This paid order cannot be cancelled "
                    "until the refund process is handled."
                )

        return value

    def get_contacts(self, obj):
        """
        Return the other party's contact details only when
        payment is successful and the order is accepted.
        """

        request = self.context.get("request")

        if request is None or not request.user.is_authenticated:
            return None

        payment = getattr(obj, "payment", None)

        if (
            obj.status != Order.ACCEPTED
            or payment is None
            or payment.status != Payment.SUCCESSFUL
        ):
            return None

        user = request.user

        if user.pk == obj.buyer_id:
            other_party = obj.farmer.user

            name = obj.farmer.farm_name
            role = "farmer"

        elif user.pk == obj.farmer.user_id:
            other_party = obj.buyer

            name = " ".join(
                part
                for part in [
                    other_party.first_name,
                    other_party.last_name,
                ]
                if part
            ) or other_party.email

            role = "buyer"

        else:
            return None

        return {
            "name": name,
            "phone": other_party.phone_number or None,
            "role": role,
        }

    def get_total(self, obj):
        """
        Calculate the total value of the order.
        """

        return sum(
            item.subtotal
            for item in obj.items.all()
        )

    def get_delivery(self, obj):
        """
        Return delivery information associated with the order.
        """

        delivery = getattr(obj, "delivery", None)

        if not delivery:
            return None

        return {
            "id": delivery.id,
            "address": delivery.address,
            "status": delivery.status,
            "tracking_number": delivery.tracking_number,
        }


class CheckoutSerializer(serializers.Serializer):
    """
    Serializer for checkout input.
    """

    delivery_address = serializers.CharField(
        max_length=500,
    )

    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHOD_CHOICES,
    )
