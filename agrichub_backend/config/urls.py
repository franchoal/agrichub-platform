from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Django Admin
    path(
        "admin/",
        admin.site.urls,
    ),

    # Accounts API
    path(
        "api/accounts/",
        include("accounts.urls"),
    ),

    # Products API
    path(
        "api/products/",
        include("products.urls"),
    ),

    # JWT Endpoints
    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
        name="token_refresh",
    ),

    path(
        "api/token/verify/",
        TokenVerifyView.as_view(),
        name="token_verify",
    ),
    
    # Cart API
path(
    "api/cart/",
    include("cart.urls"),
),


# Orders API
path(
    "api/orders/",
    include("orders.urls"),
),

path(
    "api/payments/",
    include("payments.urls"),
),

path(
    "api/delivery/",
    include("delivery.urls"),
),

path(
    "api/notifications/",
    include("notifications.urls"),
),

path(
    "api/reviews/",
    include("reviews.urls"),
),

path(
    "api/analytics/",
    include("analytics.urls"),
),

path(
    "api/farmers/",
    include("farmers.urls")
),
# Community API
path(
    "api/community/",
    include("community.urls"),
),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )