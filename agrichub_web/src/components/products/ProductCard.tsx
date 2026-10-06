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
   * already-authenticated user from being briefly treated as
   * a guest after a page refresh.
   */
  const productDestination =
    hasHydrated && isAuthenticated
      ? `/products/${product.id}`
      : "/register";

  return (
    <Card className="group overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <Link
        to={productDestination}
        className="block"
      >
        <div className="relative h-52 overflow-hidden bg-gray-100 sm:h-56">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-200">
                <Package size={25} />
              </div>

              <span className="text-xs font-medium">
                No product image
              </span>
            </div>
          )}

          {/* Availability */}
          <div className="absolute left-3 top-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur-sm ${
                isAvailable
                  ? "bg-green-600/95 text-white"
                  : "bg-gray-950/85 text-white"
              }`}
            >
              {isAvailable && <CheckCircle2 size={13} />}

              {isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Category */}
          {product.category_name && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-lg bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                {product.category_name}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="space-y-4 p-5">
        {/* Product identity */}
        <div>
          <Link
            to={productDestination}
            className="block"
          >
            <h3 className="line-clamp-1 text-lg font-black text-gray-900 transition group-hover:text-green-700">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-green-700">
            AgricWise Marketplace
          </p>
        </div>

        {/* Description */}
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
          {product.description}
        </p>

        {/* ===================================================
            PRICE + AVAILABILITY
        =================================================== */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-green-50 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">
              Price
            </p>

            <p className="mt-1 text-xl font-black text-green-800">
              ₦{Number(product.price).toLocaleString()}
            </p>

            <p className="mt-0.5 text-[11px] text-green-600">
              per {product.unit}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
              Availability
            </p>

            <p
              className={`mt-1 text-sm font-black ${
                isAvailable
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {isAvailable ? "In stock" : "Unavailable"}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500">
              {isAvailable
                ? `${product.quantity} ${product.unit}`
                : "Check listing"}
            </p>
          </div>
        </div>

        {/* ===================================================
            SELLER / MARKETPLACE STATUS
        =================================================== */}
        <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              isAvailable
                ? "bg-green-500"
                : "bg-gray-400"
            }`}
          />

          <span className="truncate text-sm font-semibold text-gray-700">
            {isAvailable
              ? "Available to buyers"
              : "Currently unavailable"}
          </span>
        </div>

        {/* ===================================================
            ACTIONS
        =================================================== */}
        <div className="grid grid-cols-[1fr_auto] gap-3 pt-1">
          <Link
            to={productDestination}
            className="block"
          >
            <Button
              type="button"
              className="flex w-full items-center justify-center gap-2"
            >
              <ShoppingCart size={15} />
              View Product
            </Button>
          </Link>

          <Link
            to={productDestination}
            aria-label={`View ${product.name}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;