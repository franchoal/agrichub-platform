from django.urls import path

from .views import (
    AgriculturalCategoryListView,
    AgriculturalServiceListCreateView,
    AgriculturalServiceDetailView,
    FarmerProfileView,
    FarmerProfileCreateView,
    FarmerProductListCreateView,
    FarmerProductDetailView,
)


urlpatterns = [
    path(
        "categories/",
        AgriculturalCategoryListView.as_view(),
        name="agricultural-categories",
    ),

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
        "services/",
        AgriculturalServiceListCreateView.as_view(),
        name="agricultural-services",
    ),

    path(
        "services/<int:pk>/",
        AgriculturalServiceDetailView.as_view(),
        name="agricultural-service-detail",
    ),

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
]