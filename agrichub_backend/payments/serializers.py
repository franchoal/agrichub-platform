from rest_framework import serializers

from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for payment records.
    """

    order_id = serializers.IntegerField(
        source="order.id",
        read_only=True,
    )

    buyer = serializers.EmailField(
        source="order.buyer.email",
        read_only=True,
    )

    class Meta:
        model = Payment

        fields = [
            "id",
            "order_id",
            "buyer",
            "method",
            "status",
            "amount",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "order_id",
            "buyer",
            "status",
            "amount",
            "created_at",
            "updated_at",
        ]