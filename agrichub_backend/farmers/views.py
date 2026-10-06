from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from rest_framework import generics, serializers
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated

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
    PublicAgriculturalBusinessDetailSerializer,
    PublicAgriculturalBusinessListSerializer,
)


# ============================================================
# AGRICULTURAL CATEGORIES
# ============================================================


class AgriculturalCategoryListView(
    generics.ListAPIView
):
    """
    Public list of active AgricWise agricultural
    business categories.
    """

    queryset = (
        AgriculturalCategory.objects
        .filter(is_active=True)
        .order_by("name")
    )

    serializer_class = AgriculturalCategorySerializer
    permission_classes = [AllowAny]


# ============================================================
# FARMER / AGRICULTURAL BUSINESS PROFILE
# ============================================================


class FarmerProfileView(
    generics.RetrieveUpdateAPIView
):
    """
    Retrieve or update the authenticated user's
    AgricWise agricultural business profile.
    """

    serializer_class = FarmerProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsFarmer,
    ]

    def get_object(self):
        try:
            return self.request.user.farmer_profile
        except FarmerProfile.DoesNotExist:
            raise NotFound(
                "AgricWise agricultural business profile not found."
            )


class FarmerProfileCreateView(
    generics.CreateAPIView
):
    """
    Create the authenticated user's AgricWise
    agricultural business profile.
    """

    serializer_class = FarmerProfileSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def perform_create(self, serializer):
        if hasattr(
            self.request.user,
            "farmer_profile",
        ):
            raise serializers.ValidationError(
                {
                    "detail": (
                        "You already have an "
                        "AgricWise business profile."
                    )
                }
            )

        serializer.save(
            user=self.request.user
        )


# ============================================================
# AGRICULTURAL SERVICES
# ============================================================


class AgriculturalServiceListCreateView(
    generics.ListCreateAPIView
):
    """
    List or create agricultural services belonging
    to the authenticated user's business profile.
    """

    serializer_class = AgriculturalServiceSerializer

    permission_classes = [
        IsAuthenticated,
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
        profile = get_object_or_404(
            FarmerProfile,
            user=self.request.user,
        )

        serializer.save(
            business=profile
        )


class AgriculturalServiceDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update or delete one of the
    authenticated user's agricultural services.
    """

    serializer_class = AgriculturalServiceSerializer

    permission_classes = [
        IsAuthenticated,
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


# ============================================================
# FARMER PRODUCTS
# ============================================================


class FarmerProductListCreateView(
    generics.ListCreateAPIView
):
    """
    List or create products belonging to the
    authenticated user's agricultural business.
    """

    serializer_class = FarmerProductSerializer

    permission_classes = [
        IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):
        return (
            Product.objects
            .filter(
                farmer__user=self.request.user
            )
            .select_related(
                "farmer",
                "category",
            )
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        profile = get_object_or_404(
            FarmerProfile,
            user=self.request.user,
        )

        serializer.save(
            farmer=profile
        )


class FarmerProductDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    Retrieve, update or delete one of the
    authenticated user's products.
    """

    serializer_class = FarmerProductSerializer

    permission_classes = [
        IsAuthenticated,
        IsFarmer,
    ]

    def get_queryset(self):
        return (
            Product.objects
            .filter(
                farmer__user=self.request.user
            )
            .select_related(
                "farmer",
                "category",
            )
        )


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS DIRECTORY
# ============================================================


class PublicAgriculturalBusinessListView(
    generics.ListAPIView
):
    """
    Public directory of AgricWise agricultural
    businesses and professionals.

    Supported discovery parameters:

    ?search=<term>
    ?category=<category-slug>
    ?verified=true
    ?verified=false

    Examples:

    /api/farmers/businesses/?search=poultry

    /api/farmers/businesses/?category=livestock-poultry

    /api/farmers/businesses/?verified=true

    /api/farmers/businesses/?search=ibadan&verified=true

    No authentication is required.
    """

    serializer_class = (
        PublicAgriculturalBusinessListSerializer
    )

    permission_classes = [
        AllowAny,
    ]

    def get_queryset(self):
        queryset = (
            FarmerProfile.objects
            .prefetch_related(
                "business_categories",
            )
            .annotate(
                available_product_count=Count(
                    "products",
                    filter=Q(
                        products__is_available=True,
                        products__quantity__gt=0,
                    ),
                    distinct=True,
                ),
                available_service_count=Count(
                    "services",
                    filter=Q(
                        services__is_available=True,
                    ),
                    distinct=True,
                ),
            )
            .order_by("farm_name")
        )

        # ----------------------------------------------------
        # SEARCH
        # ----------------------------------------------------
        search_term = (
            self.request.query_params
            .get("search", "")
            .strip()
        )

        if search_term:
            queryset = queryset.filter(
                Q(farm_name__icontains=search_term)
                | Q(farm_location__icontains=search_term)
                | Q(
                    farm_description__icontains=search_term
                )
                | Q(
                    business_categories__name__icontains=search_term
                )
                | Q(
                    business_categories__description__icontains=search_term
                )
            ).distinct()

        # ----------------------------------------------------
        # CATEGORY
        # ----------------------------------------------------
        category_slug = (
            self.request.query_params
            .get("category", "")
            .strip()
        )

        if category_slug:
            queryset = queryset.filter(
                business_categories__slug=category_slug,
                business_categories__is_active=True,
            ).distinct()

        # ----------------------------------------------------
        # VERIFICATION
        # ----------------------------------------------------
        verified = (
            self.request.query_params
            .get("verified")
        )

        if verified is not None:
            normalized_verified = (
                verified.strip().lower()
            )

            if normalized_verified in {
                "true",
                "1",
                "yes",
            }:
                queryset = queryset.filter(
                    is_verified=True
                )

            elif normalized_verified in {
                "false",
                "0",
                "no",
            }:
                queryset = queryset.filter(
                    is_verified=False
                )

        return queryset


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS DETAIL
# ============================================================


class PublicAgriculturalBusinessDetailView(
    generics.RetrieveAPIView
):
    """
    Public AgricWise business presence.

    Provides:

    - Business identity
    - Location
    - Agricultural categories
    - Verification status
    - Available products
    - Available services

    Private account information is intentionally
    excluded.
    """

    serializer_class = (
        PublicAgriculturalBusinessDetailSerializer
    )

    permission_classes = [
        AllowAny,
    ]

    queryset = (
        FarmerProfile.objects
        .prefetch_related(
            "business_categories",
            "products__category",
            "services",
        )
    )