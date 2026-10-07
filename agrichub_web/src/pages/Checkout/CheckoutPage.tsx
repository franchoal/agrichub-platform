import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

import { Card, Button } from "../../components/ui";

import { useCart } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    data: cart,
    isLoading,
    isError,
  } = useCart();

  const {
    mutate: checkout,
    isPending,
  } = useCheckout();

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "bank_transfer">("card");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-16">
        <div className="animate-pulse">
          <div className="h-8 w-56 rounded bg-gray-200 sm:h-10 sm:w-72" />

          <div className="mt-4 h-4 w-full max-w-md rounded bg-gray-100 sm:h-5" />
        </div>
      </main>
    );
  }

  if (isError || !cart) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <Card className="rounded-2xl border-red-200 bg-red-50 p-5 sm:rounded-3xl sm:p-10">
          <h2 className="text-2xl font-bold text-red-700 sm:text-3xl">
            Unable to load checkout
          </h2>

          <p className="mt-3 text-sm leading-6 text-red-600 sm:mt-4 sm:text-base">
            Please refresh the page and try again.
          </p>
        </Card>
      </main>
    );
  }

  const handleCheckout = () => {
    if (!deliveryAddress.trim()) {
      toast.error(
        "Please enter your delivery address."
      );
      return;
    }

    checkout(
      {
        delivery_address:
          deliveryAddress.trim(),

        payment_method:
          paymentMethod,
      },
      {
        onSuccess: (response) => {
          toast.success(
            "Order created successfully!"
          );

          navigate(
            "/checkout/success",
            {
              state: response,
              replace: true,
            }
          );
        },

        onError: (error: any) => {
          toast.error(
            error?.response?.data?.detail ??
              "Checkout failed."
          );
        },
      }
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-12">

      {/* HERO */}

      <section className="mb-7 rounded-[26px] bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-5 text-white shadow-xl sm:mb-10 sm:rounded-[32px] sm:p-8 lg:mb-12 lg:p-10">

        <span className="inline-flex rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
          Secure Checkout
        </span>

        <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
          Complete Your Purchase
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-green-50 sm:mt-5 sm:text-lg sm:leading-8">
          You're just one step away from receiving fresh,
          quality farm produce directly from trusted
          Nigerian farmers.
        </p>

      </section>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-10">

        {/* LEFT */}

        <section className="space-y-6 lg:col-span-2 lg:space-y-8">

          {/* ORDER SUMMARY */}

          <Card className="rounded-2xl p-5 shadow-sm sm:rounded-[30px] sm:p-6 lg:p-8">

            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">

              <div className="shrink-0 rounded-xl bg-green-100 p-2.5 sm:rounded-2xl sm:p-3">

                <Truck
                  size={22}
                  className="text-green-700 sm:h-[26px] sm:w-[26px]"
                />

              </div>

              <div className="min-w-0">

                <h2 className="text-xl font-bold sm:text-2xl">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500 sm:mt-0 sm:text-base">
                  Review the products you're purchasing.
                </p>

              </div>

            </div>

            <div className="space-y-4 sm:space-y-5">

              {cart.items.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >

                  <div className="min-w-0">

                    <h3 className="break-words text-base font-bold sm:text-lg">
                      {item.product_name}
                    </h3>

                    <p className="mt-1.5 text-sm text-gray-500 sm:mt-2">
                      ₦
                      {Number(
                        item.product_price
                      ).toLocaleString()}

                      {" × "}

                      {item.quantity}
                    </p>

                  </div>

                  <div className="text-left sm:shrink-0 sm:text-right">

                    <p className="text-xs text-gray-500 sm:text-sm">
                      Subtotal
                    </p>

                    <h3 className="mt-1 text-xl font-bold text-green-700 sm:text-2xl">
                      ₦
                      {Number(
                        item.subtotal
                      ).toLocaleString()}
                    </h3>

                  </div>

                </div>

              ))}

            </div>

          </Card>

          {/* DELIVERY ADDRESS */}

          <Card className="rounded-2xl p-5 shadow-sm sm:rounded-[30px] sm:p-6 lg:p-8">

            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">

              <div className="shrink-0 rounded-xl bg-green-100 p-2.5 sm:rounded-2xl sm:p-3">

                <MapPin
                  size={22}
                  className="text-green-700 sm:h-[26px] sm:w-[26px]"
                />

              </div>

              <div className="min-w-0">

                <h2 className="text-xl font-bold sm:text-2xl">
                  Delivery Address
                </h2>

                <p className="mt-1 text-sm leading-5 text-gray-500 sm:mt-0 sm:text-base sm:leading-normal">
                  Tell us exactly where you want your order delivered.
                </p>

              </div>

            </div>

            <textarea
              rows={5}
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(
                  e.target.value
                )
              }
              className="w-full resize-y rounded-2xl border border-gray-200 p-4 text-sm leading-6 text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:p-5 sm:text-base"
              placeholder="House Number, Street, Area, Local Government, State..."
            />

          </Card>

          {/* PAYMENT METHOD */}

          <Card className="rounded-2xl p-5 shadow-sm sm:rounded-[30px] sm:p-6 lg:p-8">

            <div className="mb-6 flex items-start gap-3 sm:mb-8 sm:items-center sm:gap-4">

              <div className="shrink-0 rounded-xl bg-green-100 p-2.5 sm:rounded-2xl sm:p-3">

                <Wallet
                  size={22}
                  className="text-green-700 sm:h-[26px] sm:w-[26px]"
                />

              </div>

              <div className="min-w-0">

                <h2 className="text-xl font-bold sm:text-2xl">
                  Payment Method
                </h2>

                <p className="mt-1 text-sm text-gray-500 sm:mt-0 sm:text-base">
                  Select how you would like to pay.
                </p>

              </div>

            </div>

            <div className="space-y-3 sm:space-y-5">

              <label
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition sm:p-5 ${
                  paymentMethod === "card"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                  <CreditCard
                    size={24}
                    className="shrink-0 text-green-700 sm:h-7 sm:w-7"
                  />

                  <div className="min-w-0">

                    <h3 className="text-sm font-bold sm:text-base">
                      Card Payment
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                      Debit or Credit Card
                    </p>

                  </div>

                </div>

                <input
                  type="radio"
                  value="card"
                  checked={
                    paymentMethod === "card"
                  }
                  onChange={() =>
                    setPaymentMethod("card")
                  }
                  className="h-4 w-4 shrink-0 accent-green-600"
                />

              </label>

              <label
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition sm:p-5 ${
                  paymentMethod === "bank_transfer"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >

                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                  <Wallet
                    size={24}
                    className="shrink-0 text-green-700 sm:h-7 sm:w-7"
                  />

                  <div className="min-w-0">

                    <h3 className="text-sm font-bold sm:text-base">
                      Bank Transfer
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                      Pay directly from your bank.
                    </p>

                  </div>

                </div>

                <input
                  type="radio"
                  value="bank_transfer"
                  checked={
                    paymentMethod ===
                    "bank_transfer"
                  }
                  onChange={() =>
                    setPaymentMethod(
                      "bank_transfer"
                    )
                  }
                  className="h-4 w-4 shrink-0 accent-green-600"
                />

              </label>

            </div>

          </Card>

        </section>

        {/* RIGHT */}

        <aside className="space-y-6">

          <Card className="rounded-2xl p-5 shadow-xl sm:rounded-[30px] sm:p-6 lg:sticky lg:top-28 lg:p-8">

            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Payment Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Review your total before confirming your order.
            </p>

            <div className="my-6 space-y-4 sm:my-8 sm:space-y-5">

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-gray-600 sm:text-base">
                  Items
                </span>

                <span className="font-semibold">
                  {cart.items.length}
                </span>

              </div>

              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-gray-600 sm:text-base">
                  Delivery
                </span>

                <span className="text-right text-sm font-semibold text-green-700 sm:text-base">
                  Calculated later
                </span>

              </div>

              <div className="border-t pt-4 sm:pt-5">

                <div className="flex items-center justify-between gap-4">

                  <span className="text-lg font-bold sm:text-xl">
                    Total
                  </span>

                  <span className="break-words text-right text-2xl font-extrabold text-green-700 sm:text-3xl lg:text-4xl">

                    ₦
                    {Number(
                      cart.total
                    ).toLocaleString()}

                  </span>

                </div>

              </div>

            </div>

            <Button
              className="flex w-full items-center justify-center gap-2 py-3.5 text-base sm:gap-3 sm:py-4 sm:text-lg"
              onClick={handleCheckout}
              disabled={
                isPending ||
                !deliveryAddress.trim()
              }
            >

              <ShieldCheck size={19} />

              {isPending
                ? "Placing Order..."
                : "Place Secure Order"}

            </Button>

            <div className="mt-6 rounded-2xl bg-green-50 p-4 sm:mt-8 sm:p-5">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={21}
                  className="mt-0.5 shrink-0 text-green-700"
                />

                <div className="min-w-0">

                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    Secure Checkout
                  </h3>

                  <p className="mt-1.5 text-xs leading-5 text-gray-600 sm:mt-2 sm:text-sm sm:leading-6">
                    Your order is securely processed.
                    Payments and personal information are protected,
                    and you'll receive order updates after checkout.
                  </p>

                </div>

              </div>

            </div>

          </Card>

        </aside>

      </div>

    </main>
  );
};

export default CheckoutPage;