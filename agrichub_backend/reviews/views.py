from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from orders.models import Order

from .models import Review
from .serializers import ReviewSerializer


class ProductReviewListView(generics.ListAPIView):
    """
    List reviews for a product.
    """

    serializer_class = ReviewSerializer

    permission_classes = [
        permissions.AllowAny,
    ]

    pagination_class = None

    def get_queryset(self):

        product_id = self.kwargs["product_id"]

        return (
            Review.objects.filter(
                product_id=product_id
            )
            .select_related(
                "buyer",
                "product",
            )
        )


class ReviewCreateView(generics.CreateAPIView):
    """
    Authenticated people can create reviews for products
    they have successfully purchased and received.
    """

    serializer_class = ReviewSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def perform_create(self, serializer):

        product = serializer.validated_data["product"]

        # Person must have completed an order
        # containing this product.
        has_completed_order = Order.objects.filter(
            buyer=self.request.user,
            status=Order.COMPLETED,
            items__product=product,
        ).exists()

        if not has_completed_order:
            raise ValidationError(
                "You can only review products from completed orders."
            )

        # Prevent duplicate reviews.
        if Review.objects.filter(
            buyer=self.request.user,
            product=product,
        ).exists():
            raise ValidationError(
                "You have already reviewed this product."
            )

        serializer.save(
            buyer=self.request.user
        )