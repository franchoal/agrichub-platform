import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  PackageCheck,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { Card, Button } from "../../components/ui";
import type { CheckoutResponse } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";

const PENDING_CHECKOUT_KEY = "agricwise_pending_checkout";

type CheckoutPageState = CheckoutResponse & {
  paymentInitializationError?: boolean;
};

type VerificationState =
  | "idle"
  | "verifying"
  | "successful"
  | "pending"
  | "error";

type VerificationRequest = {
  key: string;
  promise: ReturnType<typeof paymentService.verifyPaystack>;
};

const readSavedCheckout = (): CheckoutPageState | undefined => {
  try {
    const saved = sessionStorage.getItem(PENDING_CHECKOUT_KEY);

    if (!saved) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "orders" in parsed &&
      Array.isArray(parsed.orders) &&
      parsed.orders.length > 0
    ) {
      return parsed as CheckoutPageState;
    }
  } catch {
    // Storage may be unavailable or contain invalid data.
  }

  return undefined;
};

const CheckoutSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeState =
    location.state as CheckoutPageState | undefined;

  const referenceParams = new URLSearchParams(location.search);
  const reference =
    referenceParams.get("reference")?.trim() ||
    referenceParams.get("trxref")?.trim() ||
    "";

  const [checkoutResponse, setCheckoutResponse] =
    useState<CheckoutPageState | undefined>(() => {
      if (routeState?.orders?.length) {
        return routeState;
      }

      return readSavedCheckout();
    });

  const [verificationState, setVerificationState] =
    useState<VerificationState>("idle");

  const [verificationMessage, setVerificationMessage] =
    useState("");

  const [verificationAttempt, setVerificationAttempt] =
    useState(0);

  /*
   * Reuse the same in-flight verification request during React
   * Strict Mode's development effect replay. A retry increments
   * verificationAttempt and therefore starts a fresh request.
   */
  const verificationRequest = useRef<VerificationRequest | null>(
    null,
  );

  const hasCheckoutOrders = Boolean(
    checkoutResponse?.orders?.length,
  );

  useEffect(() => {
    if (!reference) {
      return;
    }

    let active = true;

    const requestKey = `${reference}:${verificationAttempt}`;

    setVerificationState("verifying");
    setVerificationMessage(
      "We are confirming your payment securely with AgricWise.",
    );

    let request = verificationRequest.current;

    if (!request || request.key !== requestKey) {
      request = {
        key: requestKey,
        promise: paymentService.verifyPaystack(reference),
      };

      verificationRequest.current = request;
    }

    request.promise
      .then((result) => {
        if (!active) {
          return;
        }

        const verifiedPayments = result.payments;

        if (
          !Array.isArray(verifiedPayments) ||
          verifiedPayments.length === 0
        ) {
          throw new Error(
            "The server did not return any payments for this transaction.",
          );
        }

        /*
         * Reject duplicate payment records in the verification response.
         * Each payment ID should appear exactly once.
         */
        const verifiedPaymentIds = verifiedPayments.map(
          (payment) => payment.id,
        );

        const verifiedPaymentIdSet = new Set(
          verifiedPaymentIds,
        );

        if (
          verifiedPaymentIdSet.size !==
          verifiedPaymentIds.length
        ) {
          throw new Error(
            "The verification response contains duplicate payments. Please retry verification.",
          );
        }

        /*
         * When checkout details are available, compare the complete
         * expected payment ID set with the server's verified payment set.
         * Never declare checkout success for a partial response.
         */
        const expectedPaymentIds =
          checkoutResponse?.orders?.map(
            (item) => item.payment.id,
          ) ?? [];

        if (expectedPaymentIds.length > 0) {
          const expectedPaymentIdSet = new Set(
            expectedPaymentIds,
          );

          const allExpectedPaymentsReturned =
            expectedPaymentIdSet.size ===
              expectedPaymentIds.length &&
            verifiedPayments.length ===
              expectedPaymentIds.length &&
            expectedPaymentIds.every((id) =>
              verifiedPaymentIdSet.has(id),
            );

          if (!allExpectedPaymentsReturned) {
            throw new Error(
              "We could not match every order payment to this transaction. No full-payment confirmation has been displayed. Please retry verification or check your orders.",
            );
          }
        }

        const allSuccessful = verifiedPayments.every(
          (payment) => payment.status === "successful",
        );

        const hasFailedPayment = verifiedPayments.some(
          (payment) => payment.status === "failed",
        );

        /*
         * Only update the displayed payment records after confirming
         * that the response contains the complete expected payment set.
         */
        setCheckoutResponse((current) => {
          if (!current?.orders?.length) {
            return current;
          }

          const verifiedPaymentsById = new Map(
            verifiedPayments.map((payment) => [
              payment.id,
              payment,
            ]),
          );

          return {
            ...current,
            orders: current.orders.map((item) => {
              const verifiedPayment =
                verifiedPaymentsById.get(item.payment.id);

              if (!verifiedPayment) {
                return item;
              }

              return {
                ...item,
                payment: {
                  ...item.payment,
                  status: verifiedPayment.status,
                },
              };
            }),
          };
        });

        if (allSuccessful) {
          setVerificationState("successful");
          setVerificationMessage(
            "Paystack has been verified by AgricWise. Your payment is confirmed.",
          );

          toast.success("Payment verified successfully.");

          try {
            sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
          } catch {
            // Verification is complete; storage cleanup is optional.
          }

          /*
           * If the buyer returned without saved checkout details,
           * send them to their order history after verification.
           */
          if (!hasCheckoutOrders) {
            navigate("/orders", { replace: true });
          }

          return;
        }

        setVerificationState("pending");
        setVerificationMessage(
          hasFailedPayment
            ? "The transaction was not successful. Check your order details before attempting another payment."
            : "The transaction has not been confirmed as successful. Check your order status before trying to pay again.",
        );
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setVerificationState("error");

        setVerificationMessage(
          error instanceof Error
            ? error.message
            : "We could not verify this payment right now. Your payment status has not been confirmed.",
        );
      });

    return () => {
      active = false;
    };
  }, [
    reference,
    verificationAttempt,
    navigate,
    hasCheckoutOrders,
    checkoutResponse?.orders,
  ]);

  if (!checkoutResponse?.orders?.length && !reference) {
    return <Navigate to="/orders" replace />;
  }

  const orders = checkoutResponse?.orders ?? [];

  const paymentMethodLabel = (
    method: "card" | "bank_transfer",
  ) => {
    return method === "bank_transfer"
      ? "Bank Transfer"
      : "Card";
  };

  const paymentStatusLabel = (
    status: "pending" | "successful" | "failed" | "refunded",
  ) => {
    switch (status) {
      case "successful":
        return "Successful";
      case "failed":
        return "Failed";
      case "refunded":
        return "Refunded";
      default:
        return "Pending";
    }
  };

  const deliveryStatusLabel = (
    status:
      | "pending"
      | "assigned"
      | "picked_up"
      | "in_transit"
      | "delivered",
  ) => {
    switch (status) {
      case "assigned":
        return "Assigned";
      case "picked_up":
        return "Picked Up";
      case "in_transit":
        return "In Transit";
      case "delivered":
        return "Delivered";
      default:
        return "Pending";
    }
  };

  const paymentConfirmed =
    verificationState === "successful";

  const pageTitle =
    verificationState === "verifying"
      ? "Verifying Your Payment"
      : paymentConfirmed
        ? "Payment Confirmed"
        : "Order Details";

  const pageDescription =
    verificationState === "verifying"
      ? "Please wait while we confirm your transaction."
      : paymentConfirmed
        ? "Your payment has been verified successfully."
        : "Your order records are available below. Payment is not confirmed until verification succeeds.";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      {/* Checkout / payment status */}
      <section
        className={`rounded-[24px] p-6 text-white shadow-xl sm:rounded-[30px] sm:p-8 lg:rounded-[32px] lg:p-10 ${
          paymentConfirmed
            ? "bg-gradient-to-r from-green-700 via-green-600 to-green-500"
            : "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur sm:h-20 sm:w-20">
            {verificationState === "verifying" ? (
              <LoaderCircle
                size={40}
                className="animate-spin sm:h-12 sm:w-12"
              />
            ) : paymentConfirmed ? (
              <CheckCircle2
                size={38}
                className="sm:h-[46px] sm:w-[46px]"
              />
            ) : verificationState === "error" ||
              verificationState === "pending" ||
              checkoutResponse?.paymentInitializationError ? (
              <AlertCircle
                size={38}
                className="sm:h-[46px] sm:w-[46px]"
              />
            ) : (
              <PackageCheck
                size={38}
                className="sm:h-[46px] sm:w-[46px]"
              />
            )}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
            {pageTitle}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-100 sm:mt-4 sm:text-lg sm:leading-8">
            {pageDescription}
          </p>
        </div>
      </section>

      {/* Paystack verification status */}
      {reference && (
        <Card className="mt-6 rounded-[24px] border-gray-200 p-4 sm:mt-8 sm:rounded-[30px] sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0 rounded-xl bg-gray-100 p-2.5 sm:p-3">
              {paymentConfirmed ? (
                <ShieldCheck
                  className="text-green-700"
                  size={24}
                />
              ) : verificationState === "verifying" ? (
                <LoaderCircle
                  className="animate-spin text-blue-700"
                  size={24}
                />
              ) : (
                <AlertCircle
                  className="text-amber-700"
                  size={24}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-gray-900">
                {paymentConfirmed
                  ? "Payment verified"
                  : verificationState === "verifying"
                    ? "Checking transaction"
                    : "Payment not confirmed"}
              </h2>

              <p className="mt-2 break-words text-sm leading-6 text-gray-600 sm:text-base">
                {verificationMessage}
              </p>

              <p className="mt-3 break-all text-xs text-gray-500">
                Reference: {reference}
              </p>

              {(verificationState === "error" ||
                verificationState === "pending") && (
                <Button
                  className="mt-4"
                  onClick={() => {
                    setVerificationState("idle");
                    setVerificationMessage("");
                    setVerificationAttempt(
                      (attempt) => attempt + 1,
                    );
                  }}
                >
                  {verificationState === "error"
                    ? "Retry Verification"
                    : "Check Payment Again"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Order creation or payment initialization message */}
      {checkoutResponse && (
        <Card
          className={`mt-6 rounded-[24px] p-4 sm:mt-8 sm:rounded-[30px] sm:p-6 ${
            checkoutResponse.paymentInitializationError
              ? "border-amber-200 bg-amber-50"
              : "border-green-100 bg-green-50"
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {checkoutResponse.paymentInitializationError ? (
              <AlertCircle
                size={24}
                className="mt-0.5 shrink-0 text-amber-700 sm:mt-1 sm:h-7 sm:w-7"
              />
            ) : (
              <PackageCheck
                size={24}
                className="mt-0.5 shrink-0 text-green-700 sm:mt-1 sm:h-7 sm:w-7"
              />
            )}

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                {checkoutResponse.paymentInitializationError
                  ? "Your orders were created, but payment was not started"
                  : checkoutResponse.message}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                {checkoutResponse.paymentInitializationError
                  ? "Your existing orders have been preserved. Check their payment status before attempting another checkout."
                  : "Each farmer's portion of your purchase is listed below."}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Orders */}
      {orders.length > 0 && (
        <section className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              {orders.length === 1
                ? "Your checkout created one order."
                : `Your checkout created ${orders.length} separate orders because your products came from different farmers.`}
            </p>
          </div>

          {orders.map((result) => {
            const { order, payment, delivery } = result;

            return (
              <Card
                key={order.id}
                className="rounded-[24px] p-5 shadow-sm sm:rounded-[30px] sm:p-8"
              >
                {/* Order header */}
                <div className="flex flex-col gap-4 border-b pb-5 sm:gap-5 sm:pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                      Order
                    </p>

                    <h3 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                      #{order.id}
                    </h3>
                  </div>

                  <div className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:px-4 sm:py-2 sm:text-sm">
                    {order.status}
                  </div>
                </div>

                {/* Order information */}
                <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">
                  <div className="min-w-0 rounded-2xl bg-gray-50 p-4 sm:p-5">
                    <p className="text-sm text-gray-500">
                      Farmer
                    </p>
                    <p className="mt-2 break-words font-bold text-gray-900">
                      {order.farmer}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
                    <p className="text-sm text-gray-500">
                      Products
                    </p>
                    <p className="mt-2 font-bold text-gray-900">
                      {order.items.length}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 sm:p-5">
                    <p className="text-sm text-gray-500">
                      Order Total
                    </p>
                    <p className="mt-2 text-lg font-extrabold text-green-700 sm:text-xl">
                      ₦{Number(order.total).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Payment */}
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:mt-6 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-xl bg-white p-2.5 sm:p-3">
                      <CreditCard
                        size={22}
                        className="text-blue-700 sm:h-6 sm:w-6"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900">
                            Payment
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Payment #{payment.id}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
                            payment.status === "successful"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : payment.status === "refunded"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {paymentStatusLabel(payment.status)}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            Method
                          </p>
                          <p className="mt-1 font-semibold text-gray-900">
                            {paymentMethodLabel(payment.method)}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Amount
                          </p>
                          <p className="mt-1 font-semibold text-gray-900">
                            ₦{Number(payment.amount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="mt-5 rounded-2xl border border-purple-100 bg-purple-50 p-4 sm:mt-6 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 rounded-xl bg-white p-2.5 sm:p-3">
                      <Truck
                        size={22}
                        className="text-purple-700 sm:h-6 sm:w-6"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900">
                            Delivery
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Delivery #{delivery.id}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 sm:text-sm">
                          {deliveryStatusLabel(delivery.status)}
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Delivery Address
                        </p>
                        <p className="mt-1 break-words font-semibold leading-6 text-gray-900">
                          {delivery.address}
                        </p>
                      </div>

                      {delivery.tracking_number && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">
                            Tracking Number
                          </p>
                          <p className="mt-1 break-all font-semibold text-gray-900">
                            {delivery.tracking_number}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-6 sm:mt-8">
                  <Link
                    to={`/orders/${order.id}`}
                    className="block w-full"
                  >
                    <Button className="flex w-full items-center justify-center gap-2">
                      View Order
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {/* Callback without saved checkout details */}
      {!checkoutResponse && reference && (
        <Card className="mt-6 rounded-[24px] p-5 sm:p-8">
          <p className="text-sm leading-6 text-gray-600 sm:text-base">
            Your transaction reference has been received. We are checking
            it with the payment provider. You can view your orders for the
            latest order and payment statuses.
          </p>

          <Link to="/orders" className="mt-5 block sm:inline-block">
            <Button className="w-full sm:w-auto">
              View All Orders
            </Button>
          </Link>
        </Card>
      )}

      {/* Bottom actions */}
      <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
        <Link to="/orders" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            View All Orders
          </Button>
        </Link>

        <Link to="/products" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;