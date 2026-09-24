from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User, Profile


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    location = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = User

        fields = [
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "password",
        ]

    def create(self, validated_data):

        location = validated_data.pop(
            "location",
            ""
        )

        # Keep the legacy role temporarily for existing
        # database compatibility. New users are not asked
        # to choose a permanent account role.
        user = User.objects.create_user(
            **validated_data
        )

        Profile.objects.create(
            user=user,
            location=location
        )

        return user


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(self, data):

        user = authenticate(
            email=data["email"],
            password=data["password"]
        )

        if not user:
            raise serializers.ValidationError(
                "Invalid email or password"
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "Account is inactive"
            )

        data["user"] = user

        return data


class ProfileSerializer(serializers.ModelSerializer):

    location = serializers.CharField(
        source="profile.location",
        read_only=True
    )

    bio = serializers.CharField(
        source="profile.bio",
        read_only=True
    )

    class Meta:

        model = User

        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "location",
            "bio",
            "is_verified",
            "created_at",
        ]
