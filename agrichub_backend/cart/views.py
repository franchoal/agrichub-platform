from rest_framework import generics, permissions, status
from rest_framework.response import Response

from products.models import Product

from .models import Cart, CartItem
from .serializers import (
    CartItemCreateSerializer,
    CartItemUpdateSerializer,
    CartSerializer,
)


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        cart, created = Cart.objects.get_or_create(
            buyer=self.request.user
        )

        return cart


class CartItemCreateView(generics.CreateAPIView):
    serializer_class = CartItemCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        try:
            product = Product.objects.get(
                id=product_id,
                is_available=True,
            )
        except Product.DoesNotExist:
            return Response(
                {"detail": "Product not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        cart, created = Cart.objects.get_or_create(
            buyer=request.user
        )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
        )

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity

        cart_item.save()

        return Response(
            {"detail": "Product added to cart."},
            status=status.HTTP_201_CREATED,
        )


class CartItemUpdateView(generics.UpdateAPIView):
    serializer_class = CartItemUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__buyer=self.request.user
        )


class CartItemDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__buyer=self.request.user
        )