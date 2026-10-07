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
    Compact payment information included with an order.
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
            "created_at",
            "updated_at",
        ]

    def validate_status(self, value):
        """
        Validate the allowed order status progression.
        """

        order = self.instance

        if not order:
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

        current_status = order.status

        if value == current_status:
            return value

        if value not in allowed_transitions.get(
            current_status,
            [],
        ):
            raise serializers.ValidationError(
                "Invalid order status transition."
            )

        return value

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