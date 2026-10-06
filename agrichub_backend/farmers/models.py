from django.conf import settings
from django.db import models
from django.utils.text import slugify


class AgriculturalCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Agricultural Category"
        verbose_name_plural = "Agricultural Categories"

    def __str__(self):
        return self.name


class FarmerProfile(models.Model):
    """
    Agricultural business/professional profile.

    The model name FarmerProfile is retained for backward
    compatibility with the existing AgricWise database
    and Product relationships.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="farmer_profile",
    )

    farm_name = models.CharField(
        max_length=255,
        help_text="Business, farm, organization or professional name.",
    )

    slug = models.SlugField(
        max_length=280,
        unique=True,
        blank=True,
        help_text="Stable public URL identity for the AgricWise business presence.",
    )

    farm_location = models.CharField(
        max_length=255,
        help_text="Primary business or operating location.",
    )

    farm_description = models.TextField(
        blank=True,
        help_text=(
            "Description of the agricultural business "
            "or professional activity."
        ),
    )

    business_categories = models.ManyToManyField(
        AgriculturalCategory,
        blank=True,
        related_name="business_profiles",
    )

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Agricultural Business Profile"
        verbose_name_plural = "Agricultural Business Profiles"

    def __str__(self):
        return self.farm_name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.farm_name) or "agricultural-business"
            candidate = base_slug
            counter = 2

            while (
                FarmerProfile.objects
                .filter(slug=candidate)
                .exclude(pk=self.pk)
                .exists()
            ):
                candidate = f"{base_slug}-{counter}"
                counter += 1

            self.slug = candidate

        super().save(*args, **kwargs)


class AgriculturalService(models.Model):
    """
    A service offered by an AgricWise agricultural
    business or professional.

    A business can offer multiple services.
    """

    business = models.ForeignKey(
        FarmerProfile,
        on_delete=models.CASCADE,
        related_name="services",
    )

    name = models.CharField(max_length=255)
    description = models.TextField()

    location = models.CharField(
        max_length=255,
        blank=True,
        help_text=(
            "Service location. Leave blank if the service "
            "is available remotely or nationwide."
        ),
    )

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional starting or advertised price.",
    )

    price_unit = models.CharField(
        max_length=50,
        blank=True,
        help_text=(
            "Examples: per acre, per visit, per hour, "
            "per project, per day."
        ),
    )

    image = models.ImageField(
        upload_to="services/",
        blank=True,
        null=True,
    )

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Agricultural Service"
        verbose_name_plural = "Agricultural Services"

    def __str__(self):
        return f"{self.name} - {self.business.farm_name}"