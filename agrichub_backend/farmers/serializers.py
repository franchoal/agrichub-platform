from rest_framework import serializers

from .models import (
    AgriculturalCategory,
    AgriculturalService,
    FarmerProfile,
)
from products.models import Product


# ============================================================
# AGRICULTURAL CATEGORY
# ============================================================


class AgriculturalCategorySerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = AgriculturalCategory

        fields = (
            "id",
            "name",
            "slug",
            "description",
        )

        read_only_fields = fields


# ============================================================
# FARMER / AGRICULTURAL BUSINESS PROFILE
# ============================================================


class FarmerProfileSerializer(
    serializers.ModelSerializer
):
    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    business_categories = (
        AgriculturalCategorySerializer(
            many=True,
            read_only=True,
        )
    )

    category_ids = serializers.PrimaryKeyRelatedField(
        source="business_categories",
        queryset=AgriculturalCategory.objects.filter(
            is_active=True
        ),
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        model = FarmerProfile

        fields = (
            "id",
            "email",
            "farm_name",
            "farm_location",
            "farm_description",
            "business_categories",
            "category_ids",
            "is_verified",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "email",
            "business_categories",
            "is_verified",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        categories = validated_data.pop(
            "business_categories",
            [],
        )

        profile = FarmerProfile.objects.create(
            **validated_data
        )

        if categories:
            profile.business_categories.set(
                categories
            )

        return profile

    def update(
        self,
        instance,
        validated_data,
    ):
        categories = validated_data.pop(
            "business_categories",
            None,
        )

        instance = super().update(
            instance,
            validated_data,
        )

        if categories is not None:
            instance.business_categories.set(
                categories
            )

        return instance


# ============================================================
# AGRICULTURAL SERVICE
# ============================================================


class AgriculturalServiceSerializer(
    serializers.ModelSerializer
):
    business_name = serializers.CharField(
        source="business.farm_name",
        read_only=True,
    )

    class Meta:
        model = AgriculturalService

        fields = (
            "id",
            "business",
            "business_name",
            "name",
            "description",
            "location",
            "price",
            "price_unit",
            "image",
            "is_available",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "business",
            "business_name",
            "created_at",
            "updated_at",
        )

    def validate_price(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value


# ============================================================
# FARMER PRODUCT
# ============================================================


class FarmerProductSerializer(
    serializers.ModelSerializer
):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Product

        fields = (
            "id",
            "category",
            "category_name",
            "name",
            "description",
            "price",
            "quantity",
            "unit",
            "image",
            "is_available",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "category_name",
            "created_at",
            "updated_at",
        )

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError(
                "Quantity must be at least 1."
            )

        return value


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS — PRODUCT
# ============================================================


class PublicBusinessProductSerializer(
    serializers.ModelSerializer
):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Product

        fields = (
            "id",
            "name",
            "description",
            "price",
            "quantity",
            "unit",
            "image",
            "is_available",
            "category",
            "category_name",
            "created_at",
        )

        read_only_fields = fields


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS — SERVICE
# ============================================================


class PublicBusinessServiceSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = AgriculturalService

        fields = (
            "id",
            "name",
            "description",
            "location",
            "price",
            "price_unit",
            "image",
            "is_available",
            "created_at",
        )

        read_only_fields = fields


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS DIRECTORY
# ============================================================


class PublicAgriculturalBusinessListSerializer(
    serializers.ModelSerializer
):
    business_categories = (
        AgriculturalCategorySerializer(
            many=True,
            read_only=True,
        )
    )

    product_count = serializers.SerializerMethodField()

    service_count = serializers.SerializerMethodField()

    class Meta:
        model = FarmerProfile

        fields = (
            "id",
            "farm_name",
            "farm_location",
            "farm_description",
            "business_categories",
            "is_verified",
            "product_count",
            "service_count",
        )

        read_only_fields = fields

    def get_product_count(self, obj):
        annotated_count = getattr(
            obj,
            "available_product_count",
            None,
        )

        if annotated_count is not None:
            return annotated_count

        return obj.products.filter(
            is_available=True,
            quantity__gt=0,
        ).count()

    def get_service_count(self, obj):
        annotated_count = getattr(
            obj,
            "available_service_count",
            None,
        )

        if annotated_count is not None:
            return annotated_count

        return obj.services.filter(
            is_available=True,
        ).count()


# ============================================================
# PUBLIC AGRICULTURAL BUSINESS DETAIL
# ============================================================


class PublicAgriculturalBusinessDetailSerializer(
    serializers.ModelSerializer
):
    business_categories = (
        AgriculturalCategorySerializer(
            many=True,
            read_only=True,
        )
    )

    products = serializers.SerializerMethodField()

    services = serializers.SerializerMethodField()

    product_count = serializers.SerializerMethodField()

    service_count = serializers.SerializerMethodField()

    class Meta:
        model = FarmerProfile

        fields = (
            "id",
            "farm_name",
            "farm_location",
            "farm_description",
            "business_categories",
            "is_verified",
            "product_count",
            "service_count",
            "products",
            "services",
            "created_at",
        )

        read_only_fields = fields

    def get_products(self, obj):
        queryset = (
            obj.products
            .filter(
                is_available=True,
                quantity__gt=0,
            )
            .select_related("category")
            .order_by("-created_at")
        )

        return PublicBusinessProductSerializer(
            queryset,
            many=True,
            context=self.context,
        ).data

    def get_services(self, obj):
        queryset = (
            obj.services
            .filter(
                is_available=True,
            )
            .order_by("-created_at")
        )

        return PublicBusinessServiceSerializer(
            queryset,
            many=True,
            context=self.context,
        ).data

    def get_product_count(self, obj):
        return obj.products.filter(
            is_available=True,
            quantity__gt=0,
        ).count()

    def get_service_count(self, obj):
        return obj.services.filter(
            is_available=True,
        ).count()