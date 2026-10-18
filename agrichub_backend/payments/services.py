
from decimal import Decimal, InvalidOperation
import secrets

import requests
from decouple import config
from django.db import transaction

from notifications.models import Notification
from orders.models import Order

from .models import Payment


PAYSTACK_API_URL = "https://api.paystack.co"
PAYSTACK_TIMEOUT = 20
AGRICWISE_COMMISSION_PERCENT = 5
SELLER_SHARE_PERCENT = 100 - AGRICWISE_COMMISSION_PERCENT


def _paystack_secret_key():
    secret_key = config("PAYSTACK_SECRET_KEY", default="").strip()

    if not secret_key:
        raise ValueError("Paystack is not configured on the server.")

    return secret_key


def _paystack_headers():
    return {
        "Authorization": f"Bearer {_paystack_secret_key()}",
        "Content-Type": "application/json",
    }


def _paystack_currency():
    return config("PAYSTACK_CURRENCY", default="NGN").strip().upper()


def _amount_in_kobo(amount):
    try:
        amount = Decimal(str(amount))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError("The payment amount is invalid.") from exc

    if not amount.is_finite() or amount <= 0:
        raise ValueError("Payment amount must be greater than zero.")

    if amount != amount.quantize(Decimal("0.01")):
        raise ValueError("The payment amount has invalid precision.")

    return int(amount * 100)


def _build_dynamic_split(payments):
    """
    Build a Paystack flat split for multiple farmer-specific payments.

    Each seller receives 95% of their order amount, rounded down to
    the nearest kobo. The remaining amount stays with AgricWise.

    Duplicate subaccount codes are combined into a single share.
    Missing subaccounts block checkout; there is no unsplit fallback.
    """
    shares_by_subaccount = {}
    total_amount_kobo = 0
    total_seller_share_kobo = 0

    for payment in payments:
        order = payment.order
        farmer = order.farmer

        subaccount_code = (
            farmer.paystack_subaccount_code or ""
        ).strip()

        if not subaccount_code:
            business_name = (
                farmer.farm_name or f"Business for Order #{order.pk}"
            )
            raise ValueError(
                f"Paystack settlement is not configured for "
                f"'{business_name}'. Please contact AgricWise support "
                "before checkout."
            )

        order_amount_kobo = _amount_in_kobo(payment.amount)

        # Calculate the seller share in integer kobo to avoid
        # floating-point errors and ensure the shares never exceed
        # the checkout total.
        seller_share_kobo = (
            order_amount_kobo * SELLER_SHARE_PERCENT
        ) // 100

        platform_share_kobo = order_amount_kobo - seller_share_kobo

        if seller_share_kobo <= 0 or platform_share_kobo <= 0:
            raise ValueError(
                f"Order #{order.pk} is too small to apply the "
                "seller settlement and AgricWise commission safely. "
                "Please review the order amount."
            )

        shares_by_subaccount[subaccount_code] = (
            shares_by_subaccount.get(subaccount_code, 0)
            + seller_share_kobo
        )

        total_amount_kobo += order_amount_kobo
        total_seller_share_kobo += seller_share_kobo

    if not shares_by_subaccount:
        raise ValueError(
            "No seller settlement accounts were found for this checkout."
        )

    if total_seller_share_kobo >= total_amount_kobo:
        raise ValueError(
            "The checkout split is invalid. Please contact support."
        )

    subaccounts = [
        {
            "subaccount": subaccount_code,
            "share": share_kobo,
        }
        for subaccount_code, share_kobo in sorted(
            shares_by_subaccount.items()
        )
    ]

    if any(item["share"] <= 0 for item in subaccounts):
        raise ValueError(
            "A seller settlement share is invalid. "
            "Please contact support."
        )

    if sum(item["share"] for item in subaccounts) != total_seller_share_kobo:
        raise ValueError(
            "Seller settlement shares do not match the expected total."
        )

    if sum(item["share"] for item in subaccounts) >= total_amount_kobo:
        raise ValueError(
            "Seller settlement shares leave no platform balance."
        )

    return {
        "type": "flat",
        "bearer_type": "all-proportional",
        "subaccounts": subaccounts,
    }


def _clear_uninitialized_reference(payment_ids, reference):
    """
    Release a reserved reference only when Paystack has
    definitively rejected initialization.
    """
    Payment.objects.filter(
        pk__in=payment_ids,
        status=Payment.PENDING,
        paystack_reference=reference,
    ).update(paystack_reference="")


def initialize_paystack_transaction(payment_ids, buyer, callback_url):
    """
    Initialize one Paystack transaction for pending payments belonging
    to the same buyer.

    Each farmer retains a separate Order and Payment record.
    The selected payments share one Paystack reference.
    Seller payouts are handled by Paystack dynamic splits.
    """
    if not buyer.email or not buyer.email.strip():
        raise ValueError("A valid email address is required for payment.")

    if not callback_url or not callback_url.strip():
        raise ValueError("The payment callback URL is not configured.")

    payment_ids = list(dict.fromkeys(payment_ids))

    if not payment_ids:
        raise ValueError("No payments were provided.")

    with transaction.atomic():
        payments = list(
            Payment.objects.select_for_update()
            .filter(
                pk__in=payment_ids,
                order__buyer=buyer,
            )
            .select_related(
                "order",
                "order__buyer",
                "order__farmer",
            )
            .order_by("id")
        )

        if len(payments) != len(payment_ids):
            raise ValueError(
                "One or more payments could not be found for this buyer."
            )

        if any(payment.status != Payment.PENDING for payment in payments):
            raise ValueError("Only pending payments can be initialized.")

        if any(payment.paystack_reference for payment in payments):
            raise ValueError(
                "A payment already has a transaction reference. "
                "It must be reconciled before another transaction is started."
            )

        if any(payment.order.status != Order.PENDING for payment in payments):
            raise ValueError(
                "Only payments for pending orders can be initialized."
            )

        # Validate every seller account and calculate all shares before
        # reserving a reference or contacting Paystack.
        split = _build_dynamic_split(payments)

        total_amount = sum(
            (payment.amount for payment in payments),
            Decimal("0.00"),
        )
        amount_kobo = _amount_in_kobo(total_amount)
        reference = f"aw_{secrets.token_urlsafe(24)}"

        updated_count = Payment.objects.filter(
            pk__in=payment_ids,
            status=Payment.PENDING,
            paystack_reference="",
        ).update(paystack_reference=reference)

        if updated_count != len(payment_ids):
            raise ValueError(
                "Could not reserve the payment reference. Please try again."
            )

    payload = {
        "email": buyer.email,
        "amount": amount_kobo,
        "currency": _paystack_currency(),
        "reference": reference,
        "callback_url": callback_url.strip(),
        "metadata": {
            "platform": "AgricWise Africa",
            "payment_ids": payment_ids,
        },
        "split": split,
    }

    try:
        response = requests.post(
            f"{PAYSTACK_API_URL}/transaction/initialize",
            json=payload,
            headers=_paystack_headers(),
            timeout=PAYSTACK_TIMEOUT,
        )
        response_data = response.json()
    except (requests.RequestException, ValueError) as exc:
        # The request may have reached Paystack. Keep the reference
        # until the transaction can be reconciled.
        raise ValueError(
            "Paystack's initialization response could not be confirmed. "
            "The reference has been retained for reconciliation. "
            "Do not start another transaction for these payments yet."
        ) from exc

    if not isinstance(response_data, dict):
        raise ValueError(
            "Paystack returned an unexpected response. "
            "The reference has been retained for reconciliation."
        )

    data = response_data.get("data") or {}

    if not isinstance(data, dict):
        data = {}

    initialized = (
        response.ok
        and response_data.get("status") is True
        and bool(data.get("authorization_url"))
        and data.get("reference") == reference
    )

    if not initialized:
        definitive_rejection = (
            400 <= response.status_code < 500
            and response.status_code not in (408, 429)
            and response_data.get("status") is False
        )

        if definitive_rejection:
            _clear_uninitialized_reference(payment_ids, reference)
            raise ValueError(
                "Paystack rejected the initialization request. "
                "Please check the payment details and try again."
            )

        raise ValueError(
            "Paystack could not confirm transaction initialization. "
            "The reference has been retained for reconciliation. "
            "Do not retry with a new reference until its status is checked."
        )

    return {
        "reference": reference,
        "authorization_url": data["authorization_url"],
        "access_code": data.get("access_code", ""),
    }


def verify_paystack_transaction(reference):
    """
    Verify directly with Paystack before changing payment or order status.

    One verified transaction may settle multiple farmer-specific payments
    belonging to the same buyer.
    """
    if not isinstance(reference, str) or not reference.strip():
        raise ValueError("A transaction reference is required.")

    reference = reference.strip()

    try:
        response = requests.get(
            f"{PAYSTACK_API_URL}/transaction/verify/{reference}",
            headers=_paystack_headers(),
            timeout=PAYSTACK_TIMEOUT,
        )
        response_data = response.json()
    except (requests.RequestException, ValueError) as exc:
        raise ValueError(
            "Paystack verification is temporarily unavailable. "
            "Please try again."
        ) from exc

    if not isinstance(response_data, dict):
        raise ValueError("Paystack returned an invalid verification response.")

    data = response_data.get("data") or {}

    if not isinstance(data, dict):
        raise ValueError("Paystack returned invalid transaction details.")

    if not response.ok or response_data.get("status") is not True:
        raise ValueError("Paystack could not verify this transaction.")

    if data.get("status") != "success":
        raise ValueError("Paystack has not confirmed successful payment.")

    if data.get("reference") != reference:
        raise ValueError("The transaction reference does not match.")

    if data.get("currency") != _paystack_currency():
        raise ValueError("The transaction currency does not match.")

    customer = data.get("customer") or {}

    if not isinstance(customer, dict):
        raise ValueError("Paystack returned invalid customer details.")

    customer_email = customer.get("email")

    if not isinstance(customer_email, str) or not customer_email.strip():
        raise ValueError("Paystack did not return a customer email.")

    try:
        received_amount = Decimal(str(data.get("amount")))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise ValueError(
            "Paystack returned an invalid transaction amount."
        ) from exc

    if (
        not received_amount.is_finite()
        or received_amount <= 0
        or received_amount != received_amount.to_integral_value()
    ):
        raise ValueError("Paystack returned an invalid transaction amount.")

    received_kobo = int(received_amount)

    with transaction.atomic():
        payments = list(
            Payment.objects.select_for_update()
            .filter(paystack_reference=reference)
            .select_related("order", "order__buyer")
            .order_by("id")
        )

        if not payments:
            raise ValueError("No payments are linked to this transaction.")

        buyer_ids = {payment.order.buyer_id for payment in payments}

        if len(buyer_ids) != 1:
            raise ValueError(
                "The transaction is linked to payments from different buyers."
            )

        buyer = payments[0].order.buyer

        if (
            not buyer.email
            or buyer.email.strip().casefold()
            != customer_email.strip().casefold()
        ):
            raise ValueError(
                "The Paystack customer email does not match the buyer."
            )

        expected_amount = sum(
            (payment.amount for payment in payments),
            Decimal("0.00"),
        )
        expected_kobo = _amount_in_kobo(expected_amount)

        if received_kobo != expected_kobo:
            raise ValueError(
                "The verified transaction amount does not match "
                "the expected payment total."
            )

        order_ids = sorted({payment.order_id for payment in payments})

        orders = list(
            Order.objects.select_for_update()
            .filter(pk__in=order_ids)
            .select_related("buyer")
            .order_by("id")
        )
        orders_by_id = {order.pk: order for order in orders}

        if len(orders) != len(order_ids):
            raise ValueError("One or more linked orders could not be found.")

        if any(order.buyer_id != buyer.pk for order in orders):
            raise ValueError(
                "The linked orders do not belong to the transaction buyer."
            )

        # Repeated verification is harmless once every payment succeeded.
        if all(payment.status == Payment.SUCCESSFUL for payment in payments):
            return payments

        if any(
            payment.status not in (Payment.PENDING, Payment.SUCCESSFUL)
            for payment in payments
        ):
            raise ValueError(
                "A linked payment is no longer eligible for settlement."
            )

        pending_payments = [
            payment
            for payment in payments
            if payment.status == Payment.PENDING
        ]

        # Validate every affected order before changing any payment.
        for payment in pending_payments:
            order = orders_by_id[payment.order_id]

            if order.status not in (Order.PENDING, Order.ACCEPTED):
                raise ValueError(
                    f"Order #{order.pk} cannot be settled automatically "
                    "in its current status."
                )

        for payment in pending_payments:
            order = orders_by_id[payment.order_id]

            payment.status = Payment.SUCCESSFUL
            payment.save(update_fields=["status", "updated_at"])

            if order.status == Order.PENDING:
                order.status = Order.ACCEPTED
                order.save(update_fields=["status", "updated_at"])

            Notification.objects.create(
                user=order.buyer,
                title="Payment Successful",
                message=(
                    f"Payment for Order #{order.pk} was successful. "
                    "Your order has been accepted."
                ),
                notification_type=Notification.PAYMENT_UPDATE,
            )

        return list(
            Payment.objects.filter(paystack_reference=reference)
            .select_related("order", "order__buyer")
            .order_by("id")
        )


def confirm_payment(payment):
    """
    Block the legacy direct-confirmation flow.

    Payments must be confirmed through Paystack verification.
    """
    raise ValueError(
        "Direct payment confirmation is disabled. "
        "Verify the Paystack transaction instead."
    )
