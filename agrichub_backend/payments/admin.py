
from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for payment records."""

    list_display = (
        "id",
        "order",
        "get_farmer",
        "method",
        "status",
        "amount",
        "created_at",
    )

    list_filter = (
        "method",
        "status",
        "created_at",
    )

    search_fields = (
        "order__id",
        "order__buyer__email",
        "order__farmer__farm_name",
        "order__farmer__user__email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    @admin.display(description="Farmer")
    def get_farmer(self, obj):
        """Display the agricultural business associated with a payment."""
        order = getattr(obj, "order", None)
        farmer = getattr(order, "farmer", None) if order else None

        if farmer is None:
            return "—"

        return getattr(farmer, "farm_name", "—") or "—"
