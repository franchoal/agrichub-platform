import hmac
import hashlib
import json

from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from notifications.models import Notification
from payments.models import Payment

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
                    # CRITICAL FIX: Added context={'request': request} so get_contacts works
                    "order": OrderSerializer(order, context={'request': request}).data,
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


class PaystackWebhookView(APIView):
    """
    Handles background event notifications from Paystack.
    Must be publicly accessible but cryptographically verified.
    """
    
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        payload = request.body
        paystack_signature = request.headers.get("x-paystack-signature")

        if not paystack_signature:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        secret = getattr(settings, "PAYSTACK_SECRET_KEY", "").encode("utf-8")
        computed_hmac = hmac.new(
            secret,
            payload,
            hashlib.sha512
        ).hexdigest()

        if computed_hmac != paystack_signature:
            return Response(
                {"error": "Invalid signature"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            event_data = json.loads(payload)
        except json.JSONDecodeError:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        event_type = event_data.get("event")

        if event_type == "charge.success":
            data = event_data.get("data", {})
            # Ensure this matches what you send to Paystack during initialization
            reference = data.get("reference")

            if reference:
                self._handle_successful_payment(reference)

        return Response(status=status.HTTP_200_OK)

    def _handle_successful_payment(self, reference):
        try:
            # Assuming Paystack reference maps directly to the Payment ID as sent during initialization. 
            # If you use a distinct reference string, change `id=reference` to `reference=reference`.
            payment = Payment.objects.get(id=reference)

            if payment.status != Payment.SUCCESSFUL:
                payment.status = Payment.SUCCESSFUL
                payment.save(update_fields=["status", "updated_at"])

                orders = Order.objects.filter(
                    payment=payment, 
                    status=Order.PENDING
                )
                
                for order in orders:
                    order.status = Order.ACCEPTED
                    order.save(update_fields=["status", "updated_at"])

                    # Notify the buyer that payment succeeded and order is accepted
                    Notification.objects.create(
                        user=order.buyer,
                        title="Payment Successful",
                        message=(
                            f"Payment for order #{order.id} is confirmed. "
                            "You can now view the farmer's contact details."
                        ),
                        notification_type=Notification.DELIVERY_UPDATE,
                    )
                    
                    # Notify the farmer about the new accepted order
                    Notification.objects.create(
                        user=order.farmer.user,
                        title="New Paid Order",
                        message=(
                            f"Order #{order.id} has been paid and accepted. "
                            "Please check your dashboard to coordinate logistics."
                        ),
                        notification_type=Notification.DELIVERY_UPDATE,
                    )

        except Payment.DoesNotExist:
            pass