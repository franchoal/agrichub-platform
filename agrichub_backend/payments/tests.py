
from decimal import Decimal
from unittest.mock import Mock, patch

import requests
from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from farmers.models import FarmerProfile
from notifications.models import Notification
from orders.models import Order

from .models import Payment
from .services import (
    confirm_payment,
    initialize_paystack_transaction,
    verify_paystack_transaction,
)


class PaystackPaymentServiceTests(TestCase):
    """Test payment processing without making real Paystack requests."""

    def setUp(self):
        self.buyer = User.objects.create_user(
            email="buyer@example.com",
            password="TestPassword123!",
            first_name="Test",
            last_name="Buyer",
        )

        self.farmer_one_user = User.objects.create_user(
            email="farmer1@example.com",
            password="TestPassword123!",
            first_name="Farmer",
            last_name="One",
            role="farmer",
        )

        self.farmer_two_user = User.objects.create_user(
            email="farmer2@example.com",
            password="TestPassword123!",
            first_name="Farmer",
            last_name="Two",
            role="farmer",
        )

        self.farmer_one = FarmerProfile.objects.create(
            user=self.farmer_one_user,
            farm_name="First Test Farm",
            farm_location="Abeokuta",
        )

        self.farmer_two = FarmerProfile.objects.create(
            user=self.farmer_two_user,
            farm_name="Second Test Farm",
            farm_location="Ibadan",
        )

        self.order_one = Order.objects.create(
            buyer=self.buyer,
            farmer=self.farmer_one,
            status=Order.PENDING,
        )

        self.order_two = Order.objects.create(
            buyer=self.buyer,
            farmer=self.farmer_two,
            status=Order.PENDING,
        )

        self.payment_one = self.create_payment(
            self.order_one,
            "1500.00",
        )

        self.payment_two = self.create_payment(
            self.order_two,
            "2500.00",
        )

    @staticmethod
    def create_payment(order, amount, reference=""):
        return Payment.objects.create(
            order=order,
            method=Payment.CARD,
            status=Payment.PENDING,
            amount=Decimal(amount),
            paystack_reference=reference,
            created_at=timezone.now(),
        )

    @staticmethod
    def paystack_response(data, status_code=200, ok=True):
        response = Mock()
        response.status_code = status_code
        response.ok = ok
        response.json.return_value = data
        return response

    def successful_verification_response(
        self,
        reference,
        amount_kobo=400000,
        email=None,
    ):
        return self.paystack_response(
            {
                "status": True,
                "message": "Verification successful",
                "data": {
                    "status": "success",
                    "reference": reference,
                    "amount": amount_kobo,
                    "currency": "NGN",
                    "customer": {
                        "email": email or self.buyer.email,
                    },
                },
            }
        )

    def test_initialization_combines_payments_from_multiple_farmers(self):
        """One checkout should initialize the combined amount."""

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.post") as mocked_post,
        ):
            def initialize_response(*args, **kwargs):
                reference = kwargs["json"]["reference"]
                return self.paystack_response(
                    {
                        "status": True,
                        "message": "Authorization URL created",
                        "data": {
                            "reference": reference,
                            "authorization_url": (
                                "https://checkout.example.test/authorize"
                            ),
                            "access_code": "test_access_code",
                        },
                    }
                )

            mocked_post.side_effect = initialize_response

            result = initialize_paystack_transaction(
                payment_ids=[
                    self.payment_one.pk,
                    self.payment_two.pk,
                ],
                buyer=self.buyer,
                callback_url="https://example.test/checkout/success",
            )

        self.assertTrue(result["reference"].startswith("aw_"))
        self.assertEqual(
            result["authorization_url"],
            "https://checkout.example.test/authorize",
        )

        request_payload = mocked_post.call_args.kwargs["json"]

        self.assertEqual(request_payload["email"], self.buyer.email)
        self.assertEqual(request_payload["amount"], 400000)
        self.assertEqual(request_payload["currency"], "NGN")
        self.assertEqual(
            set(request_payload["metadata"]["payment_ids"]),
            {self.payment_one.pk, self.payment_two.pk},
        )

        self.payment_one.refresh_from_db()
        self.payment_two.refresh_from_db()

        self.assertEqual(
            self.payment_one.paystack_reference,
            result["reference"],
        )
        self.assertEqual(
            self.payment_two.paystack_reference,
            result["reference"],
        )

    def test_initialization_deduplicates_payment_ids(self):
        """Repeated IDs must not cause the same payment to be charged twice."""

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.post") as mocked_post,
        ):
            def initialize_response(*args, **kwargs):
                reference = kwargs["json"]["reference"]
                return self.paystack_response(
                    {
                        "status": True,
                        "data": {
                            "reference": reference,
                            "authorization_url": (
                                "https://checkout.example.test/authorize"
                            ),
                        },
                    }
                )

            mocked_post.side_effect = initialize_response

            initialize_paystack_transaction(
                payment_ids=[
                    self.payment_one.pk,
                    self.payment_one.pk,
                ],
                buyer=self.buyer,
                callback_url="https://example.test/checkout/success",
            )

        payload = mocked_post.call_args.kwargs["json"]

        self.assertEqual(payload["amount"], 150000)
        self.assertEqual(
            payload["metadata"]["payment_ids"],
            [self.payment_one.pk],
        )

    def test_initialization_rejects_another_buyers_payment(self):
        """A buyer cannot initialize another buyer's payment."""

        with patch("payments.services.requests.post") as mocked_post:
            with self.assertRaises(ValueError):
                initialize_paystack_transaction(
                    payment_ids=[self.payment_one.pk],
                    buyer=self.farmer_one_user,
                    callback_url="https://example.test/checkout/success",
                )

        mocked_post.assert_not_called()

        self.payment_one.refresh_from_db()
        self.assertEqual(self.payment_one.paystack_reference, "")

    def test_initialization_rejects_payment_with_existing_reference(self):
        """A payment with a reserved reference must not be initialized again."""

        self.payment_one.paystack_reference = "aw_existing_reference"
        self.payment_one.save(update_fields=["paystack_reference"])

        with patch("payments.services.requests.post") as mocked_post:
            with self.assertRaises(ValueError):
                initialize_paystack_transaction(
                    payment_ids=[self.payment_one.pk],
                    buyer=self.buyer,
                    callback_url="https://example.test/checkout/success",
                )

        mocked_post.assert_not_called()

    def test_definitive_initialization_rejection_releases_reference(self):
        """A definitive Paystack rejection should release the reservation."""

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch("payments.services.requests.post") as mocked_post,
        ):
            mocked_post.return_value = self.paystack_response(
                {
                    "status": False,
                    "message": "Invalid payment request",
                },
                status_code=400,
                ok=False,
            )

            with self.assertRaisesRegex(ValueError, "rejected"):
                initialize_paystack_transaction(
                    payment_ids=[self.payment_one.pk],
                    buyer=self.buyer,
                    callback_url="https://example.test/checkout/success",
                )

        self.payment_one.refresh_from_db()
        self.assertEqual(self.payment_one.paystack_reference, "")

    def test_ambiguous_initialization_failure_retains_reference(self):
        """A network timeout must not permit an unsafe duplicate attempt."""

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch("payments.services.requests.post") as mocked_post,
        ):
            mocked_post.side_effect = requests.Timeout(
                "Simulated timeout"
            )

            with self.assertRaisesRegex(ValueError, "retained"):
                initialize_paystack_transaction(
                    payment_ids=[self.payment_one.pk],
                    buyer=self.buyer,
                    callback_url="https://example.test/checkout/success",
                )

        self.payment_one.refresh_from_db()
        self.assertTrue(self.payment_one.paystack_reference)

    def test_successful_verification_settles_all_linked_payments(self):
        """A successful transaction should settle both farmer orders."""

        reference = "aw_test_multi_farmer_reference"

        self.payment_one.paystack_reference = reference
        self.payment_one.save(update_fields=["paystack_reference"])

        self.payment_two.paystack_reference = reference
        self.payment_two.save(update_fields=["paystack_reference"])

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = (
                self.successful_verification_response(reference)
            )

            verified_payments = verify_paystack_transaction(reference)

        self.assertEqual(len(verified_payments), 2)

        self.payment_one.refresh_from_db()
        self.payment_two.refresh_from_db()
        self.order_one.refresh_from_db()
        self.order_two.refresh_from_db()

        self.assertEqual(self.payment_one.status, Payment.SUCCESSFUL)
        self.assertEqual(self.payment_two.status, Payment.SUCCESSFUL)

        self.assertEqual(self.order_one.status, Order.ACCEPTED)
        self.assertEqual(self.order_two.status, Order.ACCEPTED)

        notifications = Notification.objects.filter(
            user=self.buyer,
            notification_type=Notification.PAYMENT_UPDATE,
        )
        self.assertEqual(notifications.count(), 2)

    def test_repeated_verification_does_not_duplicate_notifications(self):
        """Re-verifying a settled transaction must be idempotent."""

        reference = "aw_test_idempotent_reference"

        self.payment_one.paystack_reference = reference
        self.payment_one.save(update_fields=["paystack_reference"])

        self.payment_two.paystack_reference = reference
        self.payment_two.save(update_fields=["paystack_reference"])

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = (
                self.successful_verification_response(reference)
            )

            verify_paystack_transaction(reference)
            verify_paystack_transaction(reference)

        self.assertEqual(
            Notification.objects.filter(
                user=self.buyer,
                notification_type=Notification.PAYMENT_UPDATE,
            ).count(),
            2,
        )

    def test_verification_rejects_an_incorrect_amount(self):
        """A lower amount must never settle the orders."""

        reference = "aw_test_wrong_amount"

        self.payment_one.paystack_reference = reference
        self.payment_one.save(update_fields=["paystack_reference"])

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = (
                self.successful_verification_response(
                    reference,
                    amount_kobo=149999,
                )
            )

            with self.assertRaisesRegex(ValueError, "amount"):
                verify_paystack_transaction(reference)

        self.payment_one.refresh_from_db()
        self.order_one.refresh_from_db()

        self.assertEqual(self.payment_one.status, Payment.PENDING)
        self.assertEqual(self.order_one.status, Order.PENDING)
        self.assertFalse(
            Notification.objects.filter(
                notification_type=Notification.PAYMENT_UPDATE,
            ).exists()
        )

    def test_verification_rejects_a_different_customer_email(self):
        """A transaction paid with an unrelated email must not settle."""

        reference = "aw_test_wrong_email"

        self.payment_one.paystack_reference = reference
        self.payment_one.save(update_fields=["paystack_reference"])

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch(
                "payments.services._paystack_currency",
                return_value="NGN",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = (
                self.successful_verification_response(
                    reference,
                    amount_kobo=150000,
                    email="someone-else@example.com",
                )
            )

            with self.assertRaisesRegex(ValueError, "email"):
                verify_paystack_transaction(reference)

        self.payment_one.refresh_from_db()
        self.assertEqual(self.payment_one.status, Payment.PENDING)

    def test_verification_rejects_an_unsuccessful_paystack_transaction(self):
        """Pending or failed Paystack transactions cannot settle an order."""

        reference = "aw_test_failed_transaction"

        self.payment_one.paystack_reference = reference
        self.payment_one.save(update_fields=["paystack_reference"])

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = self.paystack_response(
                {
                    "status": True,
                    "data": {
                        "status": "failed",
                        "reference": reference,
                        "amount": 150000,
                        "currency": "NGN",
                        "customer": {"email": self.buyer.email},
                    },
                }
            )

            with self.assertRaisesRegex(ValueError, "successful payment"):
                verify_paystack_transaction(reference)

        self.payment_one.refresh_from_db()
        self.order_one.refresh_from_db()

        self.assertEqual(self.payment_one.status, Payment.PENDING)
        self.assertEqual(self.order_one.status, Order.PENDING)

    def test_verification_rejects_an_unknown_reference(self):
        """Unknown references must not settle unrelated payments."""

        with (
            patch(
                "payments.services._paystack_secret_key",
                return_value="sk_test_not_real",
            ),
            patch("payments.services.requests.get") as mocked_get,
        ):
            mocked_get.return_value = (
                self.successful_verification_response(
                    "aw_unknown_reference",
                    amount_kobo=150000,
                )
            )

            with self.assertRaisesRegex(ValueError, "No payments"):
                verify_paystack_transaction("aw_unknown_reference")

    def test_legacy_direct_confirmation_is_disabled(self):
        """The legacy confirmation method must not bypass verification."""

        with self.assertRaisesRegex(ValueError, "disabled"):
            confirm_payment(self.payment_one)

