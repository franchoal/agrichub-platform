from rest_framework import generics, permissions, status
from rest_framework.response import Response

from notifications.models import Notification

from .models import Order
from .permissions import IsFarmer
from .serializers import CheckoutSerializer, OrderSerializer
from .services import checkout


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(buyer=self.request.user)
            .select_related("payment", "delivery")
            .prefetch_related("items__product")
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(buyer=self.request.user)
            .select_related("payment", "delivery")
            .prefetch_related("items__product")
        )


class CheckoutView(generics.GenericAPIView):
    serializer_class = CheckoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            results = checkout(
                buyer=request.user,
                delivery_address=serializer.validated_data["delivery_address"],
                payment_method=serializer.validated_data["payment_method"],
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        orders_response = []

        for result in results:
            order = result["order"]
            payment = result["payment"]
            delivery = result["delivery"]

            orders_response.append(
                {
                    "order": OrderSerializer(order).data,
                    "payment": {
                        "id": payment.id,
                        "method": payment.method,
                        "status": payment.status,
                        "amount": payment.amount,
                    },
                    "delivery": {
                        "id": delivery.id,
                        "address": delivery.address,
                        "status": delivery.status,
                        "tracking_number": delivery.tracking_number,
                    },
                }
            )

        return Response(
            {
                "message": "Checkout completed successfully.",
                "orders": orders_response,
            },
            status=status.HTTP_201_CREATED,
        )


class FarmerOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get_queryset(self):
        return (
            Order.objects
            .filter(farmer__user=self.request.user)
            .select_related("payment", "delivery")
            .prefetch_related("items__product")
        )


class FarmerOrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get_queryset(self):
        return (
            Order.objects
            .filter(farmer__user=self.request.user)
            .select_related("payment", "delivery")
            .prefetch_related("items__product")
        )

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        order = serializer.save()

        if old_status != order.status:
            Notification.objects.create(
                user=order.buyer,
                title="Order Status Updated",
                message=(
                    f"Your order #{order.id} is now "
                    f"{order.get_status_display()}."
                ),
                notification_type=Notification.DELIVERY_UPDATE,
            )