import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingCart,
} from "lucide-react";

import type { Product } from "../../types/product";

import { useAuthStore } from "../../store/authStore";

import { Button, Card } from "../ui";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isAuthenticated, hasHydrated } = useAuthStore();

  const isAvailable =
    product.is_available && Number(product.quantity) > 0;

  /*
   * Public marketplace browsing is intentional.
   *
   * Guests can see products in the marketplace, but attempting
   * to open a product requires registration.
   *
   * We wait for Zustand persistence to hydrate before deciding
   * whether the visitor is authenticated. This prevents an
   * already-authenticated user from being briefly treated as a guest
   * after a page refresh.
   */
  const productDestination =
    hasHydrated && isAuthenticated
      ? `/products/${product.id}`
      : "/register";

  return (
    <Card className="group min-w-0 overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <Link
        to={productDestination}
        className="block min-w-0"
      >
        <div className="relative h-48 overflow-hidden bg-gray-100 sm:h-56">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-w-0 flex-col items-center justify-center gap-3 px-4 text-center text-gray-400">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-200">
                <Package size={25} />
              </div>

              <span className="max-w-full truncate text-xs font-medium">
                No product image
              </span>
            </div>
          )}

          {/* Availability */}
          <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]">
            <span
              className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur-sm sm:px-3 sm:text-xs ${
                isAvailable
                  ? "bg-green-600/95 text-white"
                  : "bg-gray-950/85 text-white"
              }`}
            >
              {isAvailable && (
                <CheckCircle2
                  size={13}
                  className="shrink-0"
                />
              )}

              <span className="truncate">
                {isAvailable ? "Available" : "Unavailable"}
              </span>
            </span>
          </div>

          {/* Category */}
          {product.category_name && (
            <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)]">
              <span className="block max-w-full truncate rounded-lg bg-black/65 px-2.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm sm:px-3 sm:text-xs">
                {product.category_name}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="min-w-0 space-y-4 p-4 sm:p-5">
        {/* Product identity */}
        <div className="min-w-0">
          <Link
            to={productDestination}
            className="block min-w-0"
          >
            <h3 className="line-clamp-1 break-words text-base font-black text-gray-900 transition group-hover:text-green-700 sm:text-lg">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 truncate text-[10px] font-bold uppercase tracking-[0.12em] text-green-700 sm:text-[11px] sm:tracking-[0.14em]">
            AgricWise Marketplace
          </p>
        </div>

        {/* Description */}
        <p className="line-clamp-2 min-h-10 break-words text-sm leading-5 text-gray-600">
          {product.description}
        </p>

        {/* ===================================================
            PRICE + AVAILABILITY
        =================================================== */}
        <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3">
          <div className="min-w-0 overflow-hidden rounded-2xl bg-green-50 p-3 sm:p-3.5">
            <p className="truncate text-[9px] font-bold uppercase tracking-wide text-green-700 sm:text-[10px]">
              Price
            </p>

            <p className="mt-1 truncate text-lg font-black leading-tight text-green-800 sm:text-xl">
              ₦{Number(product.price).toLocaleString()}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-green-600 sm:text-[11px]">
              per {product.unit}
            </p>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl bg-gray-50 p-3 sm:p-3.5">
            <p className="truncate text-[9px] font-bold uppercase tracking-wide text-gray-500 sm:text-[10px]">
              Availability
            </p>

            <p
              className={`mt-1 truncate text-sm font-black ${
                isAvailable
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {isAvailable ? "In stock" : "Unavailable"}
            </p>

            <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:text-[11px]">
              {isAvailable
                ? `${product.quantity} ${product.unit}`
                : "Check listing"}
            </p>
          </div>
        </div>

        {/* ===================================================
            MARKETPLACE STATUS
        =================================================== */}
        <div className="flex min-w-0 items-center gap-2 border-t border-gray-100 pt-4">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              isAvailable
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          />

          <span className="min-w-0 truncate text-xs font-semibold text-gray-700 sm:text-sm">
            {isAvailable
              ? "Available to buyers"
              : "Currently unavailable"}
          </span>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2.5 pt-1 sm:gap-3">
          <Link
            to={productDestination}
            className="block min-w-0"
          >
            <Button
              type="button"
              className="flex min-w-0 w-full items-center justify-center gap-1.5 px-3 text-xs sm:gap-2 sm:px-4 sm:text-sm"
            >
              <ShoppingCart
                size={15}
                className="shrink-0"
              />

              <span className="truncate">
                View Product
              </span>
            </Button>
          </Link>

          <Link
            to={productDestination}
            aria-label={`View ${product.name}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;