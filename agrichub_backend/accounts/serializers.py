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
        required=False,
        allow_blank=True
    )

    bio = serializers.CharField(
        source="profile.bio",
        required=False,
        allow_blank=True
    )

    photo = serializers.ImageField(
        source="profile.photo",
        required=False,
        allow_null=True
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
            "photo",
            "is_verified",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "email",
            "is_verified",
            "created_at",
        ]

    def update(self, instance, validated_data):

        profile_data = validated_data.pop(
            "profile",
            {}
        )

        instance.first_name = validated_data.get(
            "first_name",
            instance.first_name
        )

        instance.last_name = validated_data.get(
            "last_name",
            instance.last_name
        )

        instance.phone_number = validated_data.get(
            "phone_number",
            instance.phone_number
        )

        instance.save()

        profile = instance.profile

        profile.location = profile_data.get(
            "location",
            profile.location
        )

        profile.bio = profile_data.get(
            "bio",
            profile.bio
        )

        if "photo" in profile_data:
            profile.photo = profile_data["photo"]

        profile.save()

        return instance
