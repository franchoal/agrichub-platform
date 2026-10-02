from rest_framework import permissions


class IsFarmer(permissions.BasePermission):
    """
    Transitional permission for the AgricWise
    agricultural business workspace.

    The permission class name is retained for
    backward compatibility with the existing
    application architecture.

    Access is granted to authenticated users who
    have an agricultural business/professional
    profile.

    The profile may represent:

    - Crop and plant farming
    - Livestock and poultry
    - Fish farming
    - Agro-input supply
    - Agro-allied products
    - Farm equipment and machinery
    - Irrigation and greenhouse services
    - Agricultural services
    - Produce buying and aggregation
    - Agro-processing
    - Agricultural training and consultancy
    - Other agricultural activities
    """

    message = (
        "Please complete your AgricWise agricultural "
        "business profile to access this workspace."
    )

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "farmer_profile",
        )