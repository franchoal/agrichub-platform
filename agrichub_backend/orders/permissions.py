from rest_framework import permissions


class IsFarmer(permissions.BasePermission):
    """
    Transitional permission for the existing FarmerProfile
    order workspace.

    Access is allowed to authenticated users who have a
    FarmerProfile.

    The FarmerProfile currently represents the agricultural
    seller/farmer capability in the legacy architecture.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "farmer_profile"
        )