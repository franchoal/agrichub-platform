import hashlib
import hmac
import json

from decouple import config
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import generics, permissions, status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import PaymentSerializer
from .services import (
    initialize_paystack_transaction,
    verify_paystack_transaction,
)


class PaymentListView(generics.ListAPIView):
    """List payments belonging to the authenticated buyer."""

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            order__buyer=self.request.user
        ).select_related("order")


class PaymentDetailView(generics.RetrieveAPIView):
    """Retrieve a payment belonging to the authenticated buyer."""

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(
            order__buyer=self.request.user
        ).select_related("order")


class PaystackInitializeView(APIView):
    """Initialize a Paystack transaction for the buyer's payments."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        payment_ids = request.data.get("payment_ids")

        if (
            not isinstance(payment_ids, list)
            or not payment_ids
            or any(
                isinstance(payment_id, bool)
                or not isinstance(payment_id, int)
                or payment_id <= 0
                for payment_id in payment_ids
            )
        ):
            return Response(
                {
                    "detail": (
                        "payment_ids must be a non-empty list "
                        "of valid payment IDs."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        callback_url = config(
            "PAYSTACK_CALLBACK_URL",
            default=(
                "https://agrichub-africa.vercel.app/"
                "checkout/success"
            ),
        ).strip()

        try:
            result = initialize_paystack_transaction(
                payment_ids=payment_ids,
                buyer=request.user,
                callback_url=callback_url,
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Payment initialized successfully.",
                **result,
            },
            status=status.HTTP_200_OK,
        )


class PaystackVerifyView(APIView):
    """Verify a transaction belonging to the authenticated buyer."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        reference = request.data.get("reference")

        if not isinstance(reference, str) or not reference.strip():
            return Response(
                {"detail": "A valid transaction reference is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reference = reference.strip()

        # Check ownership before making a request to Paystack.
        if not Payment.objects.filter(
            paystack_reference=reference,
            order__buyer=request.user,
        ).exists():
            return Response(
                {"detail": "Transaction not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            payments = verify_paystack_transaction(reference)
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Transaction verified successfully.",
                "payments": PaymentSerializer(
                    payments,
                    many=True,
                ).data,
            },
            status=status.HTTP_200_OK,
        )


class PaymentConfirmView(APIView):
    """
    Preserve the existing payment-confirm URL while requiring
    server-side Paystack verification.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        payment = get_object_or_404(
            Payment.objects.select_related("order"),
            pk=pk,
            order__buyer=request.user,
        )

        if not payment.paystack_reference:
            return Response(
                {
                    "detail": (
                        "This payment has no Paystack reference. "
                        "Initialize payment before confirming it."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payments = verify_paystack_transaction(
                payment.paystack_reference
            )
        except ValueError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        verified_payment = next(
            (
                item for item in payments
                if item.pk == payment.pk
            ),
            None,
        )

        if verified_payment is None:
            return Response(
                {"detail": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "message": "Payment verification completed.",
                "payment": PaymentSerializer(
                    verified_payment
                ).data,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(csrf_exempt, name="dispatch")
class PaystackWebhookView(APIView):
    """
    Receive Paystack events.

    Only accept requests signed with the configured Paystack
    secret. Successful events are independently verified against
    Paystack's transaction verification API.
    """

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        secret_key = config(
            "PAYSTACK_SECRET_KEY",
            default="",
        ).strip()

        if not secret_key:
            return Response(
                {"detail": "Webhook is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        signature = request.headers.get(
            "x-paystack-signature",
            "",
        )

        expected_signature = hmac.new(
            secret_key.encode("utf-8"),
            request.body,
            hashlib.sha512,
        ).hexdigest()

        if not signature or not hmac.compare_digest(
            signature,
            expected_signature,
        ):
            return Response(
                {"detail": "Invalid webhook signature."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            event = json.loads(request.body)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return Response(
                {"detail": "Invalid webhook payload."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if event.get("event") != "charge.success":
            return Response(
                {"message": "Event acknowledged."},
                status=status.HTTP_200_OK,
            )

        event_data = event.get("data") or {}
        reference = event_data.get("reference")

        if not isinstance(reference, str) or not reference.strip():
            return Response(
                {"detail": "Transaction reference is missing."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            verify_paystack_transaction(reference.strip())
        except ValueError:
            # Ask Paystack to retry if verification cannot be completed.
            # Monitor repeated failures and reconcile transactions.
            return Response(
                {"detail": "Transaction verification failed."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"message": "Webhook processed successfully."},
            status=status.HTTP_200_OK,
        )