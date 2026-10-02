import logging

from django.db import transaction

from rest_framework import generics, permissions
from rest_framework.exceptions import (
    NotFound,
    PermissionDenied,
)

from community.models import Post
from products.models import Product

from .models import (
    AgriculturalCategory,
    AgriculturalService,
    FarmerProfile,
)

from .permissions import IsFarmer

from .serializers import (
    AgriculturalCategorySerializer,
    AgriculturalServiceSerializer,
    FarmerProfileSerializer,
    FarmerProductSerializer,
)


logger = logging.getLogger(__name__)


class AgriculturalCategoryListView(
    generics.ListAPIView
):
    """
    Return active agricultural business categories.

    GET /api/farmers/categories/
    """

    serializer_class = AgriculturalCategorySerializer

    permission_classes = [
        permissions.AllowAny,
    ]

    def get_queryset(self):
        return (
            AgriculturalCategory.objects
            .filter(is_active=True)
            .order_by("name")
        )


class FarmerProfileView(
    generics.RetrieveUpdateAPIView
):
    """
    Retrieve and update the authenticated
    agricultural business/professional profile.
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
                "Agricultural business profile does not exist. "
                "Please complete your AgricWise business profile first."
            )


class FarmerProfileCreateView(
    generics.CreateAPIView
):
    """
    Create an authenticated user's agricultural
    business/professional profile.
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
                "Agricultural business profile already exists."
            )

        serializer.save(
            user=self.request.user
        )


class AgriculturalServiceListCreateView(
    generics.ListCreateAPIView
):
    """
    List and create services belonging to the
    authenticated agricultural business.

    GET:
        /api/farmers/services/

    POST:
        /api/farmers/services/
    """

    serializer_class = AgriculturalServiceSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):

        return (
            AgriculturalService.objects
            .filter(
                business__user=self.request.user
            )
            .select_related("business")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):

        try:
            business = FarmerProfile.objects.get(
                user=self.request.user
            )

        except FarmerProfile.DoesNotExist:
            raise PermissionDenied(
                "Please complete your AgricWise business "
                "profile before adding services."
            )

        serializer.save(
            business=business
        )


class AgriculturalServiceDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update and delete a service
    belonging to the authenticated business.
    """

    serializer_class = AgriculturalServiceSerializer

    permission_classes = [
        permissions.IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):

        return (
            AgriculturalService.objects
            .filter(
                business__user=self.request.user
            )
            .select_related("business")
        )


class FarmerProductListCreateView(
    generics.ListCreateAPIView
):
    """
    List and create products belonging to the
    authenticated agricultural business.

    Creating a product also automatically creates
    its corresponding Community Marketplace post.
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
            )

            Post.objects.create(
                author=self.request.user,
                content=product.description,
                post_type=Post.MARKETPLACE,
                location=farmer_profile.farm_location,
                product=product,
            )

        except FarmerProfile.DoesNotExist:

            raise PermissionDenied(
                "Please complete your AgricWise business "
                "profile before adding products."
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
    Retrieve, update and delete products belonging
    only to the authenticated agricultural business.
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

    @transaction.atomic
    def perform_destroy(self, instance):

        Post.objects.filter(
            product=instance,
            post_type=Post.MARKETPLACE,
        ).delete()

        instance.delete()