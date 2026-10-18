

from django.contrib import admin

from .models import FarmerProfile


@admin.action(description="Verify selected farmers")
def verify_selected_farmers(modeladmin, request, queryset):
    """Approve selected farmers for marketplace participation."""
    updated = queryset.update(is_verified=True)

    modeladmin.message_user(
        request,
        f"{updated} farmer(s) verified successfully.",
    )


@admin.action(description="Unverify selected farmers")
def unverify_selected_farmers(modeladmin, request, queryset):
    """Remove marketplace approval from selected farmers."""
    updated = queryset.update(is_verified=False)

    modeladmin.message_user(
        request,
        f"{updated} farmer(s) unverified successfully.",
    )


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    """Admin for agricultural business profiles and settlement setup."""

    list_display = (
        "farm_name",
        "user",
        "farm_location",
        "is_verified",
        "is_published",
        "has_paystack_subaccount",
        "created_at",
    )

    list_filter = (
        "is_verified",
        "is_published",
        "created_at",
    )

    search_fields = (
        "farm_name",
        "user__email",
        "user__first_name",
        "user__last_name",
        "farm_location",
        "paystack_subaccount_code",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "has_paystack_subaccount",
    )

    list_per_page = 25

    actions = (
        verify_selected_farmers,
        unverify_selected_farmers,
    )

    fieldsets = (
        (
            "Business Information",
            {
                "fields": (
                    "user",
                    "farm_name",
                    "farm_location",
                    "farm_description",
                ),
            },
        ),
        (
            "Verification and Publication",
            {
                "fields": (
                    "is_verified",
                    "is_published",
                ),
            },
        ),
        (
            "Private Paystack Settlement",
            {
                "fields": (
                    "paystack_subaccount_code",
                    "has_paystack_subaccount",
                ),
                "description": (
                    "Enter only a verified Paystack subaccount code. "
                    "Never enter a bank account number or secret API key. "
                    "Verify the subaccount configuration before enabling "
                    "seller settlements."
                ),
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                ),
            },
        ),
    )

    @admin.display(
        boolean=True,
        description="Paystack subaccount configured",
    )
    def has_paystack_subaccount(self, obj):
        """Indicate whether a subaccount code is configured."""
        return bool(obj.paystack_subaccount_code.strip())
