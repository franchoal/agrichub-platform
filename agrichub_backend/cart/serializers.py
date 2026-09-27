from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    """
    Read serializer for products inside a cart.
    """

    product_name = serializers.CharField(
        source="product.name",
        read_only=True,
    )

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    subtotal = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = CartItem

        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "subtotal",
        ]

        read_only_fields = [
            "id",
            "product_name",
            "product_price",
            "subtotal",
        ]


class CartItemCreateSerializer(serializers.Serializer):
    """
    Serializer for adding a product to the cart.
    """

    product = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1,
        default=1,
    )


class CartItemUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating cart item quantity.
    """

    class Meta:
        model = CartItem

        fields = [
            "quantity",
        ]

    def validate_quantity(self, value):
        """
        Ensure quantity is always positive.
        """

        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )

        return value


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for a buyer's shopping cart.
    """

    items = CartItemSerializer(
        many=True,
        read_only=True,
    )

    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart

        fields = [
            "id",
            "items",
            "total",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "items",
            "total",
            "created_at",
            "updated_at",
        ]

    def get_total(self, obj):
        """
        Calculate total cart value.
        """

        return sum(
            item.subtotal
            for item in obj.items.all()
        )