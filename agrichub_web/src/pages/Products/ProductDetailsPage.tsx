import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  MapPin,
  Package,
  Star,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

import { useProduct } from "../../hooks/useProduct";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useReviews } from "../../hooks/useReviews";

import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewForm from "../../components/reviews/ReviewForm";

const ProductDetailsPage = () => {

  const { id } = useParams();

  const productId = Number(id);

  const {
    mutate: addToCart,
    isPending,
  } = useAddToCart();

  if (!id || Number.isNaN(productId)) {
    return (
      <Navigate
        replace
        to="/products"
      />
    );
  }

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(productId);

  const {
    data: reviews = [],
  } = useReviews(productId);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">

        <div className="animate-pulse space-y-8">

          <div className="h-8 w-52 rounded bg-gray-200" />

          <div className="grid gap-10 lg:grid-cols-2">

            <div className="h-[560px] rounded-3xl bg-gray-200" />

            <div className="space-y-6">

              <div className="h-12 rounded bg-gray-200" />

              <div className="h-6 w-2/3 rounded bg-gray-200" />

              <div className="h-36 rounded bg-gray-200" />

              <div className="h-72 rounded bg-gray-200" />

            </div>

          </div>

        </div>

      </main>
    );
  }

  if (isError || !product) {
    return (

      <main className="mx-auto max-w-5xl px-6 py-16">

        <Card className="rounded-3xl border-red-200 bg-red-50 p-10">

          <h2 className="text-3xl font-bold text-red-700">

            Product Not Found

          </h2>

          <p className="mt-4 text-red-600">

            The product you're looking for does not exist or has been removed.

          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-green-700"
          >

            <ArrowLeft size={18} />

            Return to Marketplace

          </Link>

        </Card>

      </main>

    );
  }

  const averageRating =
    product.average_rating ?? 0;

  const reviewCount =
    product.review_count ?? reviews.length;

  const handleAddToCart = () => {

    addToCart({
      product: product.id,
      quantity: 1,
    });

  };

  return (

    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Breadcrumb */}

      <Link
        to="/products"
        className="mb-10 inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800"
      >

        <ArrowLeft size={18} />

        Back to Marketplace

      </Link>

      {/* ====================================================== */}
      {/* PRODUCT OVERVIEW */}
      {/* ====================================================== */}

      <section className="grid gap-14 lg:grid-cols-2">

        {/* IMAGE */}

        <Card className="overflow-hidden rounded-[34px] border-0 p-0 shadow-2xl">

          <div className="relative overflow-hidden">

            <img
              src={
                product.image ??
                "/placeholder-product.png"
              }
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "/placeholder-product.png";
              }}
              className="h-[620px] w-full object-cover transition duration-700 hover:scale-105"
            />

            <div className="absolute left-6 top-6">

              <span className="rounded-full bg-white/95 px-5 py-3 text-sm font-semibold text-green-700 shadow">

                {product.category_name}

              </span>

            </div>

            <div className="absolute bottom-6 left-6">

              <span
                className={`rounded-full px-5 py-3 text-sm font-bold shadow-lg ${
                  product.is_available
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {product.is_available
                  ? "Available Now"
                  : "Out of Stock"}
              </span>

            </div>

          </div>

        </Card>

        {/* RIGHT COLUMN */}

        <div className="space-y-8">

          <div>

            <h1 className="text-5xl font-extrabold leading-tight text-gray-900">

              {product.name}

            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-5">

              <div className="flex items-center gap-2">

                <Star
                  size={20}
                  fill="currentColor"
                  className="text-yellow-500"
                />

                <span className="text-xl font-bold">

                  {Number(
                    averageRating
                  ).toFixed(1)}

                </span>

              </div>

              <span className="text-gray-500">

                {reviewCount} Review
                {reviewCount !== 1 ? "s" : ""}

              </span>

            </div>

            <div className="mt-6 flex items-center gap-3 text-gray-600">

              <MapPin
                size={18}
                className="text-green-600"
              />

              <span>

                Sold by

                <strong className="ml-2 text-gray-900">

                  {product.farmer}

                </strong>

              </span>

            </div>

          </div>

          {/* PRICE */}

          <Card className="rounded-[28px] border-0 bg-gradient-to-r from-green-700 to-green-600 p-8 text-white shadow-xl">

            <p className="text-sm uppercase tracking-wider text-green-100">

              Starting Price

            </p>

            <h2 className="mt-2 text-5xl font-extrabold">

              ₦{Number(product.price).toLocaleString()}

            </h2>

            <div className="mt-8 flex items-center gap-3 text-green-100">

              <Package size={18} />

              <span>

                {product.quantity} {product.unit} Available

              </span>

            </div>

          </Card>
                    {/* ====================================================== */}
          {/* PRODUCT INFORMATION */}
          {/* ====================================================== */}

          <Card className="overflow-hidden rounded-[28px] border-0 shadow-lg">

            <div className="border-b bg-green-50 px-8 py-6">

              <h2 className="text-2xl font-bold text-gray-900">

                Product Information

              </h2>

              <p className="mt-2 text-gray-500">

                Everything you need to know before placing your order.

              </p>

            </div>

            <div className="divide-y">

              <div className="flex items-center justify-between px-8 py-5">

                <span className="text-gray-500">

                  Category

                </span>

                <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

                  {product.category_name}

                </span>

              </div>

              <div className="flex items-center justify-between px-8 py-5">

                <span className="text-gray-500">

                  Quantity

                </span>

                <span className="font-bold text-gray-900">

                  {product.quantity} {product.unit}

                </span>

              </div>

              <div className="flex items-center justify-between px-8 py-5">

                <span className="text-gray-500">

                  Availability

                </span>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    product.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >

                  {product.is_available
                    ? "Available"
                    : "Unavailable"}

                </span>

              </div>

              <div className="flex items-center justify-between px-8 py-5">

                <span className="text-gray-500">

                  Farmer

                </span>

                <span className="font-semibold text-gray-900">

                  {product.farmer}

                </span>

              </div>

            </div>

          </Card>

         {/* ====================================================== */}
{/* DESCRIPTION */}
{/* ====================================================== */}

<Card className="overflow-hidden rounded-[30px] border-0 shadow-lg">

  <div className="border-b bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6">

    <h2 className="text-2xl font-bold text-gray-900">
      Product Description
    </h2>

    <p className="mt-2 text-gray-500">
      Everything you should know before purchasing.
    </p>

  </div>

  <div className="space-y-8 px-8 py-8">

    <p className="leading-8 text-gray-600">
      {product.description}
    </p>

    <div className="grid gap-5 md:grid-cols-2">

      <div className="rounded-2xl bg-green-50 p-6">

        <div className="mb-3 text-3xl">
          🌿
        </div>

        <h3 className="font-bold text-green-700">
          Farm Fresh
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Harvested directly from verified Nigerian farmers and
          delivered while freshness is preserved.
        </p>

      </div>

      <div className="rounded-2xl bg-amber-50 p-6">

        <div className="mb-3 text-3xl">
          ✅
        </div>

        <h3 className="font-bold text-amber-700">
          Verified Quality
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Carefully selected produce sourced from trusted farms
          across Nigeria to ensure quality and reliability.
        </p>

      </div>

    </div>

  </div>

</Card>

{/* ====================================================== */}
{/* PURCHASE CARD */}
{/* ====================================================== */}

<Card className="rounded-[30px] border-0 bg-gradient-to-br from-white to-green-50 p-8 shadow-xl">

  <div className="space-y-6">

    <div>

      <h3 className="text-2xl font-bold text-gray-900">
        Ready to Buy?
      </h3>

      <p className="mt-2 leading-7 text-gray-500">
        Add this product to your cart and continue shopping, or
        proceed to checkout when you're ready.
      </p>

    </div>

    <Button
      className="w-full rounded-2xl py-4 text-lg font-bold"
      onClick={handleAddToCart}
      disabled={
        isPending ||
        !product.is_available
      }
    >
      {isPending
        ? "Adding To Cart..."
        : product.is_available
        ? "🛒 Add To Cart"
        : "Currently Unavailable"}
    </Button>

    <div className="rounded-2xl bg-white p-5 text-sm leading-7 text-gray-600 shadow-sm">

      <p>
        ✔ Secure ordering through the AgricWise platform.
      </p>

      <p className="mt-2">
        ✔ Products are supplied by verified Nigerian farmers.
      </p>

      <p className="mt-2">
        ✔ Fresh produce with transparent pricing.
      </p>

    </div>

  </div>

</Card>

</div>

</section>

{/* ====================================================== */}
{/* REVIEWS HERO */}
{/* ====================================================== */}

<section className="mt-24">

  <div className="overflow-hidden rounded-[34px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl">

    <div className="grid gap-10 p-10 lg:grid-cols-[1fr_320px] lg:items-center">

      <div>

        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          Customer Feedback
        </span>

        <h2 className="mt-6 text-5xl font-extrabold">
          Reviews & Ratings
        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-green-100">
          Genuine reviews from verified buyers help customers make
          informed decisions while rewarding farmers who consistently
          provide quality produce.
        </p>

      </div>

      <div className="grid gap-6">

        <div className="rounded-3xl bg-white/15 p-8 text-center backdrop-blur">

          <div className="text-6xl font-black">
            ⭐ {Number(averageRating).toFixed(1)}
          </div>

          <p className="mt-3 text-green-100">
            Average Rating
          </p>

        </div>

        <div className="rounded-3xl bg-white/15 p-8 text-center backdrop-blur">

          <div className="text-6xl font-black">
            {reviewCount}
          </div>

          <p className="mt-3 text-green-100">
            Customer Review{reviewCount !== 1 ? "s" : ""}
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

{/* ====================================================== */}
{/* REVIEW FORM */}
{/* ====================================================== */}

<section className="mt-14">

  <Card className="rounded-[30px] border-0 shadow-xl">

    <div className="border-b bg-green-50 px-8 py-6">

      <h2 className="text-2xl font-bold">
        Write a Review
      </h2>

      <p className="mt-2 text-gray-500">
        Share your experience to help other buyers.
      </p>

    </div>

    <div className="p-8">

      <ReviewForm
        productId={product.id}
      />

    </div>

  </Card>

</section>

{/* ====================================================== */}
{/* REVIEWS */}
{/* ====================================================== */}

<section className="mt-16">

  <div className="mb-8">

    <h2 className="text-3xl font-bold text-gray-900">
      Customer Reviews
    </h2>

    <p className="mt-2 text-gray-500">
      {reviewCount} Review
      {reviewCount !== 1 ? "s" : ""}
    </p>

  </div>

  {reviews.length === 0 ? (

    <Card className="rounded-[30px] border-0 py-20 text-center shadow-lg">

      <div className="mx-auto max-w-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
          ⭐
        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          No Reviews Yet
        </h3>

        <p className="mt-4 leading-8 text-gray-500">
          This product hasn't received any reviews yet.
          Be the first buyer to share your experience.
        </p>

      </div>

    </Card>

  ) : (

    <div className="space-y-6">

      {reviews.map((review) => (

        <div
          key={review.id}
          className="rounded-[28px] border border-gray-100 bg-white p-2 shadow-sm transition hover:shadow-lg"
        >

          <ReviewCard review={review} />

        </div>

      ))}

    </div>

  )}

</section>

</main>
  );
};
export default ProductDetailsPage;
