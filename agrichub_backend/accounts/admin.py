from django.contrib import admin

from .models import User, Profile


@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    model = User

    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "is_staff",
        "is_active",
        "date_joined",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_active",
        "is_verified",
    )

    ordering = ("-date_joined",)

    search_fields = (
        "email",
        "first_name",
        "last_name",
        "phone_number",
    )

    # CRITICAL FIX: auto_now fields must be read-only if included in fieldsets.
    # Password is made read-only so admins don't accidentally save plaintext passwords.
    readonly_fields = (
        "password",
        "last_login",
        "date_joined",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone_number",
                    "role",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "is_verified",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "location",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "location",
    )