from rest_framework import serializers

from products.models import Product

from .models import (
    AgriculturalCategory,
    AgriculturalService,
    FarmerProfile,
)


class AgriculturalCategorySerializer(
    serializers.ModelSerializer
):
    """
    Serializer for agricultural business categories.
    """

    class Meta:
        model = AgriculturalCategory

        fields = [
            "id",
            "name",
            "slug",
            "description",
        ]

        read_only_fields = [
            "id",
            "name",
            "slug",
            "description",
        ]


class FarmerProfileSerializer(
    serializers.ModelSerializer
):
    """
    Serializer for an AgricWise agricultural
    business/professional profile.
    """

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    business_categories = AgriculturalCategorySerializer(
        many=True,
        read_only=True,
    )

    category_ids = serializers.PrimaryKeyRelatedField(
        source="business_categories",
        queryset=(
            AgriculturalCategory.objects.filter(
                is_active=True
            )
        ),
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        model = FarmerProfile

        fields = [
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
        ]

        read_only_fields = [
            "id",
            "email",
            "business_categories",
            "is_verified",
            "created_at",
            "updated_at",
        ]

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

    def update(self, instance, validated_data):
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


class AgriculturalServiceSerializer(
    serializers.ModelSerializer
):
    """
    Serializer for services offered by an
    agricultural business.
    """

    business_name = serializers.CharField(
        source="business.farm_name",
        read_only=True,
    )

    class Meta:
        model = AgriculturalService

        fields = [
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
        ]

        read_only_fields = [
            "id",
            "business",
            "business_name",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value


class FarmerProductSerializer(
    serializers.ModelSerializer
):
    """
    Serializer for products managed by an
    agricultural business.
    """

    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    class Meta:
        model = Product

        fields = [
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
        ]

        read_only_fields = [
            "id",
            "category_name",
            "created_at",
            "updated_at",
        ]

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