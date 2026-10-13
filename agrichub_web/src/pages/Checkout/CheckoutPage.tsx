
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
import { paymentService } from "../../services/paymentService";

const PENDING_CHECKOUT_KEY = "agricwise_pending_checkout";

const getErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = error.response;

    if (
      typeof response === "object" &&
      response !== null &&
      "data" in response
    ) {
      const data = response.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "detail" in data &&
        typeof data.detail === "string"
      ) {
        return data.detail;
      }

      if (
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const CheckoutPage = () => {
  const navigate = useNavigate();

  const {
    data: cart,
    isLoading,
    isError,
  } = useCart();

  const {
    mutateAsync: checkout,
    isPending: isCreatingOrder,
  } = useCheckout();

  const [deliveryAddress, setDeliveryAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState<"card" | "bank_transfer">("card");

  const [isInitializingPayment, setIsInitializingPayment] =
    useState(false);

  const isProcessing =
    isCreatingOrder || isInitializingPayment;

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

  const handleCheckout = async () => {
    if (isProcessing) {
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (cart.items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsInitializingPayment(true);

    let checkoutResponse:
      | Awaited<ReturnType<typeof checkout>>
      | undefined;

    try {
      // Step 1: Create orders through the existing checkout API.
      checkoutResponse = await checkout({
        delivery_address: deliveryAddress.trim(),
        payment_method: paymentMethod,
      });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Unable to create your order."),
      );
      setIsInitializingPayment(false);
      return;
    }

    // Orders now exist. Do not repeat checkout if payment
    // initialization fails, as that could create duplicate orders.
    if (
      !checkoutResponse.orders ||
      checkoutResponse.orders.length === 0
    ) {
      toast.error(
        "The checkout response contained no orders. Please check your orders before trying again.",
      );

      navigate("/orders", { replace: true });
      setIsInitializingPayment(false);
      return;
    }

    // Keep the checkout details available when Paystack returns
    // the browser to the application.
    try {
      sessionStorage.setItem(
        PENDING_CHECKOUT_KEY,
        JSON.stringify(checkoutResponse),
      );
    } catch {
      // Payment initialization can continue if browser storage
      // is unavailable. The callback must still verify payment.
    }

    try {
      // Step 2: Collect every farmer's payment ID and initialize
      // one combined Paystack transaction for this checkout.
      const paymentIds = [
        ...new Set(
          checkoutResponse.orders.map(
            (item) => item.payment.id,
          ),
        ),
      ];

      if (
        paymentIds.length !== checkoutResponse.orders.length ||
        paymentIds.some(
          (id) => !Number.isInteger(id) || id <= 0,
        )
      ) {
        throw new Error(
          "The order response contains invalid payment IDs.",
        );
      }

      const payment =
        await paymentService.initializePaystack(paymentIds);

      if (
        !payment.authorization_url ||
        !payment.reference
      ) {
        throw new Error(
          "Paystack did not return a valid checkout session.",
        );
      }

      // Only redirect to the trusted Paystack hosted checkout.
      const authorizationUrl = new URL(
        payment.authorization_url,
      );

      if (
        authorizationUrl.protocol !== "https:" ||
        !(
          authorizationUrl.hostname === "paystack.com" ||
          authorizationUrl.hostname.endsWith(".paystack.com")
        )
      ) {
        throw new Error(
          "The payment provider returned an invalid checkout URL.",
        );
      }

      toast.success("Redirecting you to secure payment...");

      // Full-page navigation is required for Paystack Checkout.
      window.location.assign(authorizationUrl.toString());
    } catch (error: unknown) {
      toast.error(
        `Your order was created, but payment could not be started. ${getErrorMessage(
          error,
          "Please retry payment from your order details or contact support.",
        )}`,
        { duration: 7000 },
      );

      // Keep the created orders visible instead of sending the
      // buyer back to checkout and risking duplicate orders.
      navigate("/checkout/success", {
        state: {
          ...checkoutResponse,
          paymentInitializationError: true,
        },
        replace: true,
      });
    } finally {
      setIsInitializingPayment(false);
    }
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
          You&apos;re just one step away from receiving fresh,
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
                  Review the products you&apos;re purchasing.
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
                        item.product_price,
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
                        item.subtotal,
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
              onChange={(event) =>
                setDeliveryAddress(event.target.value)
              }
              className="w-full resize-y rounded-2xl border border-gray-200 p-4 text-sm leading-6 text-gray-700 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:p-5 sm:text-base"
              placeholder="House Number, Street, Area, Local Government, State..."
              disabled={isProcessing}
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
                  Select your preferred payment method.
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
                      Debit or credit card
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  disabled={isProcessing}
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
                      Available transfer options at Paystack checkout
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank_transfer"
                  checked={paymentMethod === "bank_transfer"}
                  onChange={() => setPaymentMethod("bank_transfer")}
                  disabled={isProcessing}
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
              Review your total before proceeding to secure payment.
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
                      cart.total,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="flex w-full items-center justify-center gap-2 py-3.5 text-base sm:gap-3 sm:py-4 sm:text-lg"
              onClick={handleCheckout}
              disabled={
                isProcessing ||
                !deliveryAddress.trim() ||
                cart.items.length === 0
              }
            >
              <ShieldCheck size={19} />

              {isCreatingOrder
                ? "Creating Order..."
                : isInitializingPayment
                  ? "Preparing Secure Payment..."
                  : "Continue to Secure Payment"}
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
                    Payment is processed through Paystack. AgricWise
                    verifies the transaction with its backend before
                    treating the payment as successful.
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
