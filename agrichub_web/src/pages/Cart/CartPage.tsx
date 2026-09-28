import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  ShoppingBasket,
  ShieldCheck,
} from "lucide-react";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

import { useCart } from "../../hooks/useCart";
import { useUpdateCartItem } from "../../hooks/useUpdateCartItem";
import { useRemoveCartItem } from "../../hooks/useRemoveCartItem";

const CartPage = () => {
  const {
    data: cart,
    isLoading,
    isError,
  } = useCart();

  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-gray-200" />

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <ShoppingBasket size={26} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-700">
              Unable to load cart
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-600">
              Something went wrong while fetching your shopping basket.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!cart) {
    return null;
  }

  const itemCount = cart.items.length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        {/* MOBILE-APP HEADER */}
        <header className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              aria-label="Continue shopping"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-green-50 hover:text-green-700"
            >
              <ArrowLeft size={19} />
            </Link>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                My Basket
              </h1>

              <p className="text-xs text-gray-500">
                {itemCount} item{itemCount !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <ShoppingBasket size={20} className="text-green-700" />
          </div>
        </header>

        {/* EMPTY CART */}
        {itemCount === 0 ? (
          <section className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-50">
              <ShoppingBasket size={42} className="text-green-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your basket is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Discover fresh agricultural products from verified farmers
              and add your favourites to your basket.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
            >
              Explore Marketplace
            </Link>
          </section>
        ) : (
          <>
            {/* CART ITEMS */}
            <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    Selected Products
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Review your items before checkout
                  </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {itemCount}
                </span>
              </div>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, quantity) => {
                      updateCartItem({
                        id,
                        data: {
                          quantity,
                        },
                      });
                    }}
                    onRemove={removeCartItem}
                  />
                ))}
              </div>
            </section>

            {/* SUMMARY */}
            <section className="mt-5">
              <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order Summary
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      Your current basket total
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <CheckCircle2
                      size={20}
                      className="text-green-600"
                    />
                  </div>
                </div>

                <CartSummary total={cart.total ?? 0} />

                <Link
                  to="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-green-600 px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-green-700"
                >
                  Proceed to Checkout
                </Link>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <LockKeyhole size={14} />
                  Secure checkout
                </div>
              </div>
            </section>

            {/* TRUST STRIP */}
            <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <ShieldCheck
                  size={20}
                  className="text-green-600"
                />
                <p className="mt-2 text-xs font-semibold text-gray-800">
                  Verified Farmers
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <CheckCircle2
                  size={20}
                  className="text-green-600"
                />
                <p className="mt-2 text-xs font-semibold text-gray-800">
                  Trusted Products
                </p>
              </div>

              <div className="hidden rounded-2xl bg-white p-4 shadow-sm sm:block">
                <ShoppingBasket
                  size={20}
                  className="text-green-600"
                />
                <p className="mt-2 text-xs font-semibold text-gray-800">
                  Easy Ordering
                </p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default CartPage;