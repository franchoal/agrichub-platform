import { useState } from "react";
import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

import { useProduct } from "../../hooks/useProduct";
import { useAddToCart } from "../../hooks/useAddToCart";
import { useReviews } from "../../hooks/useReviews";
import { useAuthStore } from "../../store/authStore";

import ReviewCard from "../../components/reviews/ReviewCard";
import ReviewForm from "../../components/reviews/ReviewForm";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const productId = Number(id);

  const [quantity, setQuantity] = useState(1);

  const {
    isAuthenticated,
    hasHydrated,
  } = useAuthStore();

  const {
    mutate: addToCart,
    isPending,
  } = useAddToCart();

  /*
   * --------------------------------------------------------
   * ROUTE VALIDATION
   * --------------------------------------------------------
   */

  if (!id || Number.isNaN(productId)) {
    return (
      <Navigate
        replace
        to="/products"
      />
    );
  }

  /*
   * --------------------------------------------------------
   * AUTHENTICATION GATE
   * --------------------------------------------------------
   *
   * We wait for Zustand persistence to hydrate before
   * deciding whether this visitor is authenticated.
   *
   * This prevents an already-authenticated user from being
   * briefly treated as a guest during page refresh.
   */

  const canViewProduct =
    hasHydrated && isAuthenticated;

  /*
   * --------------------------------------------------------
   * PRODUCT / REVIEW QUERIES
   * --------------------------------------------------------
   *
   * The hooks receive the authentication state so guests
   * never make protected product/review API requests.
   */

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(
    productId,
    canViewProduct,
  );

  const {
    data: reviews = [],
  } = useReviews(
    productId,
    canViewProduct,
  );

  /*
   * --------------------------------------------------------
   * AUTH HYDRATION
   * --------------------------------------------------------
   */

  if (!hasHydrated) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-52 rounded bg-gray-200" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[420px] rounded-3xl bg-gray-200 sm:h-[560px]" />

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

  /*
   * --------------------------------------------------------
   * GUEST ACCESS
   * --------------------------------------------------------
   *
   * Product browsing remains public on /products, but the
   * actual product detail/action page requires registration.
   */

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/register"
      />
    );
  }

  /*
   * --------------------------------------------------------
   * PRODUCT LOADING
   * --------------------------------------------------------
   */

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-52 rounded bg-gray-200" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[420px] rounded-3xl bg-gray-200 sm:h-[560px]" />

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

  /*
   * --------------------------------------------------------
   * PRODUCT NOT FOUND
   * --------------------------------------------------------
   */

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Card className="rounded-3xl border-red-200 bg-red-50 p-6 sm:p-10">
          <h2 className="text-2xl font-bold text-red-700 sm:text-3xl">
            Product Not Found
          </h2>

          <p className="mt-4 leading-7 text-red-600">
            The product you're looking for does not exist
            or has been removed from the marketplace.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
          >
            <ArrowLeft size={18} />
            Return to Marketplace
          </Link>
        </Card>
      </main>
    );
  }

  /*
   * --------------------------------------------------------
   * PRODUCT STATE
   * --------------------------------------------------------
   */

  const averageRating =
    product.average_rating ?? 0;

  const reviewCount =
    product.review_count ?? reviews.length;

  const availableQuantity = Math.max(
    0,
    Number(product.quantity) || 0,
  );

  const isAvailable =
    product.is_available &&
    availableQuantity > 0;

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        current + 1,
        availableQuantity,
      ),
    );
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1),
    );
  };

  const handleAddToCart = () => {
    if (!isAvailable) {
      return;
    }

    addToCart({
      product: product.id,
      quantity,
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ======================================================
          BACK TO MARKETPLACE
      ====================================================== */}
      <Link
        to="/products"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800 sm:mb-10"
      >
        <ArrowLeft size={18} />
        Back to Marketplace
      </Link>

      {/* ======================================================
          PRODUCT OVERVIEW
      ====================================================== */}
      <section className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* ====================================================
            PRODUCT IMAGE
        ==================================================== */}
        <Card className="overflow-hidden rounded-[28px] border-0 p-0 shadow-xl sm:rounded-[34px]">
          <div className="relative overflow-hidden">
            <img
              src={
                product.image ??
                "/placeholder-product.png"
              }
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src =
                  "/placeholder-product.png";
              }}
              className="h-[360px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[520px] lg:h-[620px]"
            />

            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-green-700 shadow-lg backdrop-blur sm:px-5 sm:py-3 sm:text-sm">
                {product.category_name}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span
                className={`rounded-full px-4 py-2 text-xs font-bold shadow-lg sm:px-5 sm:py-3 sm:text-sm ${
                  isAvailable
                    ? "bg-green-600 text-white"
                    : "bg-gray-900 text-white"
                }`}
              >
                {isAvailable
                  ? "Available Now"
                  : "Currently Unavailable"}
              </span>
            </div>
          </div>
        </Card>

        {/* ====================================================
            PRODUCT INFORMATION
        ==================================================== */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                AgricWise Marketplace
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Star
                  size={19}
                  fill="currentColor"
                  className="text-yellow-500"
                />

                <span className="font-bold text-gray-900">
                  {Number(averageRating).toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                {reviewCount} Review
                {reviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* SELLER / BUSINESS IDENTITY */}
          <Card className="rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Store size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                  Listed by
                </p>

                <p className="mt-1 break-words text-lg font-bold text-gray-900">
                  {product.farmer}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Agricultural business or seller on AgricWise.
                </p>
              </div>
            </div>
          </Card>

          {/* PRICE */}
          <Card className="rounded-[26px] border-0 bg-gradient-to-r from-green-700 to-green-600 p-6 text-white shadow-xl sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-green-100 sm:text-sm">
              Selling Price
            </p>

            <h2 className="mt-2 text-4xl font-black sm:text-5xl">
              ₦{Number(product.price).toLocaleString()}
            </h2>

            <div className="mt-6 flex items-center gap-3 text-sm text-green-100 sm:text-base">
              <Package size={18} />

              <span>
                {availableQuantity} {product.unit} available
              </span>
            </div>
          </Card>

          {/* PURCHASE */}
          <Card className="rounded-[26px] border-0 bg-gradient-to-br from-white to-green-50 p-5 shadow-xl sm:rounded-[30px] sm:p-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Add to Cart
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Select the quantity you want and add the
                product to your AgricWise cart.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-2">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={
                  !isAvailable ||
                  quantity <= 1
                }
                aria-label="Decrease quantity"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <div className="text-center">
                <p className="text-lg font-black text-gray-900">
                  {quantity}
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                  {product.unit}
                </p>
              </div>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  !isAvailable ||
                  quantity >= availableQuantity
                }
                aria-label="Increase quantity"
                className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={18} />
              </button>
            </div>

            <Button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold sm:text-lg"
              onClick={handleAddToCart}
              disabled={
                isPending ||
                !isAvailable
              }
            >
              <ShoppingCart size={19} />

              {isPending
                ? "Adding to Cart..."
                : isAvailable
                  ? "Add to Cart"
                  : "Currently Unavailable"}
            </Button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              You can review your cart and continue
              shopping before checkout.
            </p>
          </Card>
        </div>
      </section>

      {/* ======================================================
          PRODUCT INFORMATION
      ====================================================== */}
      <section className="mt-12 sm:mt-16">
        <Card className="overflow-hidden rounded-[28px] border-0 shadow-lg">
          <div className="border-b bg-green-50 px-5 py-5 sm:px-8 sm:py-6">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Product Information
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Key information about this marketplace listing.
            </p>
          </div>

          <div className="divide-y">
            <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-sm text-gray-500">
                Category
              </span>

              <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                {product.category_name}
              </span>
            </div>

            <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-sm text-gray-500">
                Available Quantity
              </span>

              <span className="font-bold text-gray-900">
                {availableQuantity} {product.unit}
              </span>
            </div>

            <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-sm text-gray-500">
                Listing Status
              </span>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                  isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isAvailable
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>

            <div className="flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <span className="text-sm text-gray-500">
                Agricultural Business / Seller
              </span>

              <span className="font-semibold text-gray-900">
                {product.farmer}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* ======================================================
          DESCRIPTION
      ====================================================== */}
      <section className="mt-8 sm:mt-10">
        <Card className="overflow-hidden rounded-[28px] border-0 shadow-lg">
          <div className="border-b bg-gradient-to-r from-green-50 to-emerald-50 px-5 py-5 sm:px-8 sm:py-6">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Product Description
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Details provided by the listing business or seller.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              {product.description}
            </p>
          </div>
        </Card>
      </section>

      {/* ======================================================
          REVIEWS SUMMARY
      ====================================================== */}
      <section className="mt-12 sm:mt-20">
        <div className="overflow-hidden rounded-[28px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl sm:rounded-[34px]">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_320px] lg:items-center">
            <div>
              <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur sm:text-sm">
                Customer Feedback
              </span>

              <h2 className="mt-5 text-3xl font-black sm:mt-6 sm:text-5xl">
                Reviews & Ratings
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-green-100 sm:mt-5 sm:text-lg sm:leading-8">
                See feedback from buyers who have interacted
                with this product listing.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-3xl bg-white/15 p-5 text-center backdrop-blur sm:p-8">
                <div className="text-3xl font-black sm:text-5xl">
                  ⭐ {Number(averageRating).toFixed(1)}
                </div>

                <p className="mt-2 text-xs text-green-100 sm:mt-3 sm:text-sm">
                  Average Rating
                </p>
              </div>

              <div className="rounded-3xl bg-white/15 p-5 text-center backdrop-blur sm:p-8">
                <div className="text-3xl font-black sm:text-5xl">
                  {reviewCount}
                </div>

                <p className="mt-2 text-xs text-green-100 sm:mt-3 sm:text-sm">
                  Customer Review
                  {reviewCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          REVIEW FORM
      ====================================================== */}
      <section className="mt-10 sm:mt-14">
        <Card className="rounded-[28px] border-0 shadow-xl">
          <div className="border-b bg-green-50 px-5 py-5 sm:px-8 sm:py-6">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Write a Review
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Share your experience to help other buyers make
              informed decisions.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <ReviewForm
              productId={product.id}
            />
          </div>
        </Card>
      </section>

      {/* ======================================================
          CUSTOMER REVIEWS
      ====================================================== */}
      <section className="mt-12 sm:mt-16">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Customer Reviews
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {reviewCount} Review
            {reviewCount !== 1 ? "s" : ""}
          </p>
        </div>

        {reviews.length === 0 ? (
          <Card className="rounded-[28px] border-0 py-16 text-center shadow-lg sm:py-20">
            <div className="mx-auto max-w-xl px-5">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
                ⭐
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
                No Reviews Yet
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
                This product hasn't received any reviews yet.
                Be among the first buyers to share your
                experience.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[24px] border border-gray-100 bg-white p-2 shadow-sm transition hover:shadow-lg sm:rounded-[28px]"
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