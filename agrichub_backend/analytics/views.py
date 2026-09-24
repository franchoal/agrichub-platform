from django.db.models import Count, Sum
from django.db.models.functions import TruncDate

from rest_framework import generics, permissions
from rest_framework.response import Response

from accounts.models import User
from orders.models import Order
from payments.models import Payment
from products.models import Product

from .serializers import AnalyticsSerializer


class AnalyticsView(generics.RetrieveAPIView):
    """
    Administrator analytics dashboard data.
    """

    serializer_class = AnalyticsSerializer

    permission_classes = [
        permissions.IsAdminUser,
    ]

    def retrieve(self, request, *args, **kwargs):

        total_users = User.objects.count()

        user_growth = list(
            User.objects.annotate(
                date=TruncDate("created_at")
            )
            .values("date")
            .annotate(
                count=Count("id")
            )
            .order_by("date")
        )

        total_products = Product.objects.count()

        product_growth = list(
            Product.objects.annotate(
                date=TruncDate("created_at")
            )
            .values("date")
            .annotate(
                count=Count("id")
            )
            .order_by("date")
        )

        total_orders = Order.objects.count()

        order_status_distribution = dict(
            Order.objects.values("status")
            .annotate(
                count=Count("id")
            )
            .values_list(
                "status",
                "count",
            )
        )

        total_revenue = (
            Payment.objects.filter(
                status=Payment.SUCCESSFUL
            )
            .aggregate(
                total=Sum("amount")
            )
            ["total"]
            or 0
        )

        # Transitional definition:
        # An active farmer is an active user with a FarmerProfile.
        active_farmers = User.objects.filter(
            farmer_profile__isnull=False,
            is_active=True,
        ).count()

        # Transitional definition:
        # An active buyer is an active user who has placed an order.
        active_buyers = User.objects.filter(
            orders__isnull=False,
            is_active=True,
        ).distinct().count()

        data = {
            "total_users": total_users,
            "user_growth": user_growth,
            "total_products": total_products,
            "product_growth": product_growth,
            "total_orders": total_orders,
            "order_status_distribution": order_status_distribution,
            "total_revenue": total_revenue,
            "active_farmers": active_farmers,
            "active_buyers": active_buyers,
        }

        serializer = self.get_serializer(
            data=data
        )

        serializer.is_valid(
            raise_exception=True
        )

        return Response(
            serializer.data
        )