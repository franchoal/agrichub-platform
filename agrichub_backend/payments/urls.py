from django.urls import path

from .views import (
    PaymentDetailView,
    PaymentListView,
    PaymentConfirmView,
    PaystackInitializeView,
    PaystackVerifyView,
    PaystackWebhookView,
)


app_name = "payments"


urlpatterns = [
    # Buyer payment list
    path(
        "",
        PaymentListView.as_view(),
        name="payment-list",
    ),

    # Payment detail
    path(
        "<int:pk>/",
        PaymentDetailView.as_view(),
        name="payment-detail",
    ),

    # Verify a payment using Paystack
    path(
        "<int:pk>/confirm/",
        PaymentConfirmView.as_view(),
        name="payment-confirm",
    ),

    # Initialize a Paystack transaction
    path(
        "paystack/initialize/",
        PaystackInitializeView.as_view(),
        name="paystack-initialize",
    ),

    # Verify a Paystack transaction by reference
    path(
        "paystack/verify/",
        PaystackVerifyView.as_view(),
        name="paystack-verify",
    ),

    # Paystack server-to-server webhook
    path(
        "paystack/webhook/",
        PaystackWebhookView.as_view(),
        name="paystack-webhook",
    ),
]