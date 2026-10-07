from django.urls import path

from .views import (
    AgriculturalCategoryListView,
    AgriculturalServiceListCreateView,
    AgriculturalServiceDetailView,
    FarmerProfileView,
    FarmerProfileCreateView,
    FarmerProfilePublishView,
    FarmerProductListCreateView,
    FarmerProductDetailView,
    PublicAgriculturalBusinessListView,
    PublicAgriculturalBusinessDetailView,
)


urlpatterns = [
    # ========================================================
    # AGRICULTURAL CATEGORIES
    # ========================================================

    path(
        "categories/",
        AgriculturalCategoryListView.as_view(),
        name="agricultural-categories",
    ),

    # ========================================================
    # AUTHENTICATED BUSINESS PROFILE
    # ========================================================

    path(
        "profile/",
        FarmerProfileView.as_view(),
        name="farmer-profile",
    ),

    path(
        "profile/create/",
        FarmerProfileCreateView.as_view(),
        name="farmer-profile-create",
    ),

    path(
        "profile/publish/",
        FarmerProfilePublishView.as_view(),
        name="farmer-profile-publish",
    ),

    # ========================================================
    # AGRICULTURAL SERVICES
    # ========================================================

    path(
        "services/",
        AgriculturalServiceListCreateView.as_view(),
        name="agricultural-services",
    ),

    path(
        "services/<int:pk>/",
        AgriculturalServiceDetailView.as_view(),
        name="agricultural-service-detail",
    ),

    # ========================================================
    # BUSINESS PRODUCTS
    # ========================================================

    path(
        "products/",
        FarmerProductListCreateView.as_view(),
        name="farmer-products",
    ),

    path(
        "products/<int:pk>/",
        FarmerProductDetailView.as_view(),
        name="farmer-product-detail",
    ),

    # ========================================================
    # PUBLIC AGRICULTURAL BUSINESS DIRECTORY
    # ========================================================

    path(
        "businesses/",
        PublicAgriculturalBusinessListView.as_view(),
        name="public-agricultural-businesses",
    ),

    path(
        "businesses/<str:identifier>/",
        PublicAgriculturalBusinessDetailView.as_view(),
        name="public-agricultural-business-detail",
    ),
]