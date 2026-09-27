from django.db import transaction
from rest_framework import generics, permissions
import logging

from rest_framework.exceptions import (
    NotFound,
    PermissionDenied,
)

from products.models import Product
from community.models import Post

from .models import FarmerProfile
from .permissions import IsFarmer
from .serializers import (
    FarmerProfileSerializer,
    FarmerProductSerializer,
)


logger = logging.getLogger(__name__)


class FarmerProfileView(generics.RetrieveUpdateAPIView):
    """
    Retrieve and update the authenticated
    farmer's profile.

    URL:
        GET /api/farmers/profile/
        PUT /api/farmers/profile/

    No primary key is required because
    each authenticated farmer only owns
    one profile.
    """

    serializer_class = FarmerProfileSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_object(self):
        try:
            return FarmerProfile.objects.get(
                user=self.request.user
            )

        except FarmerProfile.DoesNotExist:
            raise NotFound(
                "Farmer profile does not exist. Please create your profile first."
            )


class FarmerProfileCreateView(generics.CreateAPIView):
    """
    Create an authenticated user's FarmerProfile.

    A FarmerProfile represents the agricultural
    seller/farmer capability and is separate from
    the user's universal AgricWise personal profile.

    URL:
        POST /api/farmers/profile/create/

    Any authenticated AgricWise user can create
    their first FarmerProfile.

    An existing FarmerProfile cannot be created again.
    """

    serializer_class = FarmerProfileSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def perform_create(self, serializer):

        if FarmerProfile.objects.filter(
            user=self.request.user
        ).exists():
            raise PermissionDenied(
                "Farmer profile already exists."
            )

        serializer.save(
            user=self.request.user
        )


class FarmerProductListCreateView(
    generics.ListCreateAPIView
):
    """
    Farmers can list and create
    their own products.

    Creating a product also automatically
    creates its corresponding Community
    For Sale post.
    """

    serializer_class = FarmerProductSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):

        return (
            Product.objects.filter(
                farmer__user=self.request.user
            )
            .select_related(
                "category",
                "farmer",
            )
            .order_by("-created_at")
        )

    @transaction.atomic
    def perform_create(self, serializer):

        try:
            farmer_profile = FarmerProfile.objects.get(
                user=self.request.user
            )

            product = serializer.save(
                farmer=farmer_profile,
                is_available=True,
            )

            Post.objects.create(
                author=self.request.user,
                content=product.description,
                post_type=Post.FOR_SALE,
                location=farmer_profile.farm_location,
                product=product,
            )

        except FarmerProfile.DoesNotExist:
            raise PermissionDenied(
                "Please create your farmer profile before adding products."
            )

        except Exception:
            logger.exception(
                "PRODUCT AND COMMUNITY LISTING CREATION FAILED"
            )
            raise


class FarmerProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update and delete
    products belonging to the
    authenticated farmer only.
    """

    serializer_class = FarmerProductSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):

        return (
            Product.objects.filter(
                farmer__user=self.request.user
            )
            .select_related(
                "category",
                "farmer",
            )
        )