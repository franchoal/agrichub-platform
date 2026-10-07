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
    useState<
      "card" | "bank_transfer"
    >("card");

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="animate-pulse">
          <div className="h-10 w-72 rounded bg-gray-200" />

          <div className="mt-4 h-5 w-96 rounded bg-gray-100" />
        </div>
      </main>
    );
  }

  if (isError || !cart) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <Card className="rounded-3xl border-red-200 bg-red-50 p-10">
          <h2 className="text-3xl font-bold text-red-700">
            Unable to load checkout
          </h2>

          <p className="mt-4 text-red-600">
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
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Hero */}

      <section className="mb-12 rounded-[32px] bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-10 text-white shadow-xl">

        <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
          Secure Checkout
        </span>

        <h1 className="mt-6 text-5xl font-extrabold">
          Complete Your Purchase
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-green-50">
          You're just one step away from receiving fresh,
          quality farm produce directly from trusted
          Nigerian farmers.
        </p>

      </section>

      <div className="grid gap-10 lg:grid-cols-3">

        {/* LEFT */}

        <section className="space-y-8 lg:col-span-2">

          {/* Order Summary */}

          <Card className="rounded-[30px] p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-2xl bg-green-100 p-3">

                <Truck
                  size={26}
                  className="text-green-700"
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Order Summary
                </h2>

                <p className="text-gray-500">
                  Review the products you're purchasing.
                </p>

              </div>

            </div>

            <div className="space-y-5">

              {cart.items.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-5 transition hover:bg-gray-50"
                >

                  <div>

                    <h3 className="text-lg font-bold">
                      {item.product_name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">

                      ₦
                      {Number(
                        item.product_price
                      ).toLocaleString()}

                      {" × "}

                      {item.quantity}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm text-gray-500">
                      Subtotal
                    </p>

                    <h3 className="text-2xl font-bold text-green-700">

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

          {/* Delivery Address */}

          <Card className="rounded-[30px] p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-2xl bg-green-100 p-3">

                <MapPin
                  size={26}
                  className="text-green-700"
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Delivery Address
                </h2>

                <p className="text-gray-500">
                  Tell us exactly where you want your order delivered.
                </p>

              </div>

            </div>

            <textarea
              rows={6}
              value={deliveryAddress}
              onChange={(e) =>
                setDeliveryAddress(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 p-5 text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="House Number, Street, Area, Local Government, State..."
            />

          </Card>

          {/* Payment Method */}

          <Card className="rounded-[30px] p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-4">

              <div className="rounded-2xl bg-green-100 p-3">

                <Wallet
                  size={26}
                  className="text-green-700"
                />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Payment Method
                </h2>

                <p className="text-gray-500">
                  Select how you would like to pay.
                </p>

              </div>

            </div>

            <div className="space-y-5">

              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
                  paymentMethod === "card"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >

                <div className="flex items-center gap-4">

                  <CreditCard
                    size={28}
                    className="text-green-700"
                  />

                  <div>

                    <h3 className="font-bold">
                      Card Payment
                    </h3>

                    <p className="text-sm text-gray-500">
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
                />

              </label>

              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
                  paymentMethod === "bank_transfer"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >

                <div className="flex items-center gap-4">

                  <Wallet
                    size={28}
                    className="text-green-700"
                  />

                  <div>

                    <h3 className="font-bold">
                      Bank Transfer
                    </h3>

                    <p className="text-sm text-gray-500">
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
                />

              </label>

            </div>

          </Card>

        </section>

        {/* RIGHT */}

        <aside className="space-y-6">

          {/* Payment Summary */}

          <Card className="sticky top-28 rounded-[30px] p-8 shadow-xl">

            <h2 className="text-2xl font-bold text-gray-900">
              Payment Summary
            </h2>

            <p className="mt-2 text-gray-500">
              Review your total before confirming your order.
            </p>

            <div className="my-8 space-y-5">

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Items
                </span>

                <span className="font-semibold">
                  {cart.items.length}
                </span>

              </div>

              <div className="flex items-center justify-between">

                <span className="text-gray-600">
                  Delivery
                </span>

                <span className="font-semibold text-green-700">
                  Calculated later
                </span>

              </div>

              <div className="border-t pt-5">

                <div className="flex items-center justify-between">

                  <span className="text-xl font-bold">
                    Total
                  </span>

                  <span className="text-4xl font-extrabold text-green-700">

                    ₦
                    {Number(
                      cart.total
                    ).toLocaleString()}

                  </span>

                </div>

              </div>

            </div>

            <Button
              className="flex w-full items-center justify-center gap-3 py-4 text-lg"
              onClick={handleCheckout}
              disabled={
                isPending ||
                !deliveryAddress.trim()
              }
            >

              <ShieldCheck size={20} />

              {isPending
                ? "Placing Order..."
                : "Place Secure Order"}

            </Button>

            <div className="mt-8 rounded-2xl bg-green-50 p-5">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={22}
                  className="mt-1 text-green-700"
                />

                <div>

                  <h3 className="font-semibold text-gray-900">
                    Secure Checkout
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
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