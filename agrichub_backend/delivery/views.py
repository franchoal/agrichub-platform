from rest_framework import generics, permissions

from orders.models import Order
from orders.permissions import IsFarmer
from notifications.models import Notification

from .models import Delivery
from .serializers import DeliverySerializer


class DeliveryListView(generics.ListAPIView):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Delivery.objects
            .filter(order__buyer=self.request.user)
            .select_related(
                "order",
                "order__buyer",
                "order__farmer",
            )
        )


class DeliveryDetailView(generics.RetrieveAPIView):
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Delivery.objects
            .filter(order__buyer=self.request.user)
            .select_related(
                "order",
                "order__buyer",
                "order__farmer",
            )
        )


class FarmerDeliveryListView(generics.ListAPIView):
    serializer_class = DeliverySerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):
        return (
            Delivery.objects
            .filter(
                order__farmer__user=self.request.user
            )
            .select_related(
                "order",
                "order__buyer",
                "order__farmer",
            )
        )


class FarmerDeliveryDetailView(
    generics.RetrieveUpdateAPIView
):
    serializer_class = DeliverySerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):
        return (
            Delivery.objects
            .filter(
                order__farmer__user=self.request.user
            )
            .select_related(
                "order",
                "order__buyer",
                "order__farmer",
            )
        )

    def perform_update(self, serializer):
        old_status = serializer.instance.status

        delivery = serializer.save()

        if old_status == delivery.status:
            return

        order = delivery.order

        if delivery.status in [
            Delivery.PICKED_UP,
            Delivery.IN_TRANSIT,
        ]:
            if order.status == Order.READY:
                order.status = Order.OUT_FOR_DELIVERY

                order.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

                Notification.objects.create(
                    user=order.buyer,
                    title="Order Status Updated",
                    message=(
                        f"Your order #{order.id} "
                        "is now out for delivery."
                    ),
                    notification_type=(
                        Notification.DELIVERY_UPDATE
                    ),
                )

        elif delivery.status == Delivery.DELIVERED:
            if order.status == Order.OUT_FOR_DELIVERY:
                order.status = Order.DELIVERED

                order.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

                Notification.objects.create(
                    user=order.buyer,
                    title="Order Delivered",
                    message=(
                        f"Your order #{order.id} "
                        "has been delivered."
                    ),
                    notification_type=(
                        Notification.DELIVERY_UPDATE
                    ),
                )