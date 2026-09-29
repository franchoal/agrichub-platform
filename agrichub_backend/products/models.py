from io import BytesIO

from django.core.files.base import ContentFile
from django.db import models
from PIL import Image, ImageOps

from farmers.models import FarmerProfile


# ============================================================
# PRODUCT IMAGE SETTINGS
# ============================================================

MAX_PRODUCT_IMAGE_SIZE = 1600
PRODUCT_IMAGE_JPEG_QUALITY = 85


def prepare_product_image(image_file):
    """
    Normalize uploaded product images before they are stored.

    Rules:
    - Correct EXIF camera orientation.
    - Resize images larger than 1600x1600.
    - Preserve transparency for PNG/WebP images.
    - Convert other images to JPEG.
    - Keep good visual quality while reducing file size.
    """

    if not image_file:
        return image_file

    try:
        image = Image.open(image_file)

        # Correct orientation based on EXIF metadata.
        image = ImageOps.exif_transpose(image)

        original_format = (
            image.format or ""
        ).upper()

        original_name = (
            getattr(
                image_file,
                "name",
                "product-image",
            )
        )

        # ----------------------------------------------------
        # Resize only when necessary.
        # ----------------------------------------------------

        if (
            image.width > MAX_PRODUCT_IMAGE_SIZE
            or image.height > MAX_PRODUCT_IMAGE_SIZE
        ):
            image.thumbnail(
                (
                    MAX_PRODUCT_IMAGE_SIZE,
                    MAX_PRODUCT_IMAGE_SIZE,
                ),
                Image.Resampling.LANCZOS,
            )

        output = BytesIO()

        # ----------------------------------------------------
        # Preserve transparency for PNG/WebP.
        # ----------------------------------------------------

        if (
            original_format == "PNG"
            or original_format == "WEBP"
        ):
            image.save(
                output,
                format=original_format,
                optimize=True,
            )

            extension = (
                ".png"
                if original_format == "PNG"
                else ".webp"
            )

        else:
            # ------------------------------------------------
            # Convert JPEG-compatible images to RGB.
            # ------------------------------------------------

            if image.mode not in (
                "RGB",
                "L",
            ):
                background = Image.new(
                    "RGB",
                    image.size,
                    "white",
                )

                if "A" in image.getbands():
                    background.paste(
                        image,
                        mask=image.getchannel("A"),
                    )
                else:
                    background.paste(image)

                image = background

            image.save(
                output,
                format="JPEG",
                quality=PRODUCT_IMAGE_JPEG_QUALITY,
                optimize=True,
                progressive=True,
            )

            extension = ".jpg"

        output.seek(0)

        # ----------------------------------------------------
        # Replace the original extension with the actual
        # format we saved.
        # ----------------------------------------------------

        base_name = original_name.rsplit(
            ".",
            1,
        )[0]

        new_name = (
            f"{base_name}{extension}"
        )

        return ContentFile(
            output.read(),
            name=new_name,
        )

    except (
        OSError,
        ValueError,
    ):
        # If Pillow cannot process the image, leave the
        # original upload untouched. Django's ImageField
        # validation can handle invalid files normally.
        try:
            image_file.seek(0)
        except (
            AttributeError,
            OSError,
        ):
            pass

        return image_file


# ============================================================
# CATEGORY
# ============================================================

class Category(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
    )

    slug = models.SlugField(
        unique=True,
    )

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


# ============================================================
# PRODUCT
# ============================================================

class Product(models.Model):

    UNIT_CHOICES = [
        ("kg", "Kilogram"),
        ("bag", "Bag"),
        ("basket", "Basket"),
        ("crate", "Crate"),
        ("bunch", "Bunch"),
        ("piece", "Piece"),
        ("ton", "Ton"),
    ]

    farmer = models.ForeignKey(
        FarmerProfile,
        on_delete=models.CASCADE,
        related_name="products",
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products",
    )

    name = models.CharField(
        max_length=200,
    )

    description = models.TextField()

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    quantity = models.PositiveIntegerField()

    unit = models.CharField(
        max_length=20,
        choices=UNIT_CHOICES,
        default="kg",
    )

    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
    )

    is_available = models.BooleanField(
        default=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def save(
        self,
        *args,
        **kwargs,
    ):
        """
        Automatically normalize a newly uploaded
        product image before saving.
        """

        if (
            self.image
            and not getattr(
                self.image,
                "_agric_image_processed",
                False,
            )
        ):
            if not getattr(
                self.image,
                "_committed",
                True,
            ):
                processed_image = (
                    prepare_product_image(
                        self.image
                    )
                )

                self.image = processed_image

                try:
                    self.image._agric_image_processed = True
                except AttributeError:
                    pass

        super().save(
            *args,
            **kwargs,
        )

    def __str__(self):
        return self.name