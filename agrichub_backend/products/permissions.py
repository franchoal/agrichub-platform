from rest_framework import permissions


class IsFarmerOrReadOnly(permissions.BasePermission):
    """
    Transitional permission for product creation and modification.

    Read access is allowed for everyone.

    During the migration to AgricWise's person-centered architecture,
    a user must have a FarmerProfile to create or modify products.
    The FarmerProfile currently represents the existing seller
    capability required by the Product model.

    This permission can later be replaced with a general seller/
    listing capability when Product ownership is migrated away
    from FarmerProfile.
    """

    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True

        if not request.user.is_authenticated:
            return False

        return hasattr(
            request.user,
            "farmer_profile"
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows only the person who owns the product
    to update or delete it.
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):

        if request.method in permissions.SAFE_METHODS:
            return True

        return (
            obj.farmer.user == request.user
        )