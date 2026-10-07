import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  Truck,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

import { useOrder } from "../../hooks/useOrder";
import { useConfirmPayment } from "../../hooks/useConfirmPayment";

const orderSteps = [
  {
    key: "pending",
    label: "Order Placed",
  },
  {
    key: "accepted",
    label: "Accepted by Farmer",
  },
  {
    key: "processing",
    label: "Processing",
  },
  {
    key: "ready",
    label: "Ready",
  },
  {
    key: "out_for_delivery",
    label: "Out For Delivery",
  },
  {
    key: "delivered",
    label: "Delivered",
  },
  {
    key: "completed",
    label: "Completed",
  },
];

const getStatusIndex = (status: string) =>
  orderSteps.findIndex(
    (step) => step.key === status
  );

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "accepted":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-indigo-100 text-indigo-700";

    case "ready":
      return "bg-purple-100 text-purple-700";

    case "out_for_delivery":
      return "bg-orange-100 text-orange-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "completed":
      return "bg-emerald-100 text-emerald-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: string) =>
  status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const getPaymentMethodLabel = (
  method: "card" | "bank_transfer"
) => {
  if (method === "bank_transfer") {
    return "Bank Transfer";
  }

  return "Card";
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case "successful":
      return "bg-green-100 text-green-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "refunded":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getDeliveryStatusBadge = (status: string) => {
  switch (status) {
    case "assigned":
      return "bg-blue-100 text-blue-700";

    case "picked_up":
      return "bg-indigo-100 text-indigo-700";

    case "in_transit":
      return "bg-orange-100 text-orange-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getDeliveryStatusLabel = (status: string) =>
  status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const OrderDetailsPage = () => {
  const { id } = useParams();

  const orderId = Number(id);

  const confirmPayment = useConfirmPayment();

  if (!id || Number.isNaN(orderId)) {
    return (
      <Navigate
        to="/orders"
        replace
      />
    );
  }

  const {
    data: order,
    isLoading,
    isError,
  } = useOrder(orderId);

  const handleConfirmPayment = () => {
    if (!order?.payment) {
      toast.error(
        "Payment information is unavailable."
      );
      return;
    }

    confirmPayment.mutate(
      order.payment.id,
      {
        onSuccess: () => {
          toast.success(
            "Payment confirmed successfully."
          );
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.detail ??
              "Unable to confirm payment."
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-base font-semibold text-gray-600 sm:text-lg">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <Card className="rounded-2xl border-red-200 bg-red-50 p-5 sm:rounded-[30px] sm:p-10">
            <h2 className="text-2xl font-bold text-red-700 sm:text-3xl">
              Order Not Found
            </h2>

            <p className="mt-3 text-sm leading-6 text-red-600 sm:mt-4 sm:text-base">
              The order you're looking for could not be found.
            </p>

            <Link
              to="/orders"
              className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white sm:mt-8 sm:px-6 sm:text-base"
            >
              Back to Orders
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const orderStatusIndex = getStatusIndex(
    order.status
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

        {/* HERO */}

        <section className="relative overflow-hidden rounded-[26px] sm:rounded-[36px]">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:h-72 sm:w-72" />

          <div className="absolute -bottom-16 left-0 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:left-10 sm:h-60 sm:w-60" />

          <div className="relative px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">

              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:text-sm">
                  Order Tracking
                </span>

                <h1 className="mt-5 text-3xl font-extrabold text-white sm:mt-8 sm:text-5xl lg:text-6xl">
                  Order #{order.id}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-green-100 sm:mt-6 sm:text-lg sm:leading-8">
                  Track every stage of your marketplace order from
                  confirmation through delivery.
                </p>
              </div>

              <div className="w-full rounded-2xl bg-white/15 p-5 text-left backdrop-blur sm:p-6 lg:w-auto lg:min-w-[210px] lg:rounded-[30px] lg:p-8 lg:text-center">
                <p className="text-xs uppercase tracking-widest text-green-100">
                  Current Status
                </p>

                <span
                  className={`mt-3 inline-flex max-w-full rounded-full px-4 py-2 text-sm font-bold sm:mt-5 sm:px-5 sm:py-3 sm:text-lg ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ORDER OVERVIEW */}

        <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-3">

          <Card className="rounded-2xl p-5 shadow-lg sm:rounded-[30px] sm:p-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
              Farmer
            </p>

            <h3 className="mt-2 break-words text-xl font-bold sm:mt-3 sm:text-2xl">
              {order.farmer}
            </h3>
          </Card>

          <Card className="rounded-2xl p-5 shadow-lg sm:rounded-[30px] sm:p-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
              Products
            </p>

            <h3 className="mt-2 text-3xl font-extrabold sm:mt-3">
              {order.items.length}
            </h3>
          </Card>

          <Card className="rounded-2xl p-5 shadow-lg sm:rounded-[30px] sm:p-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
              Total
            </p>

            <h3 className="mt-2 break-words text-2xl font-extrabold text-green-700 sm:mt-3 sm:text-3xl">
              ₦{Number(order.total).toLocaleString()}
            </h3>
          </Card>

        </section>

        {/* ORDER PROGRESS */}

        <section className="mt-8 sm:mt-12">
          <Card className="rounded-2xl border-0 p-5 shadow-xl sm:rounded-[32px] sm:p-10">

            <h2 className="text-2xl font-bold sm:text-3xl">
              Order Progress
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              Follow your order through every stage until delivery.
            </p>

            <div className="mt-7 space-y-5 sm:mt-10 sm:space-y-8">

              {orderSteps.map((step, index) => {
                const completed =
                  index <= orderStatusIndex;

                return (
                  <div
                    key={step.key}
                    className="flex items-center gap-4 sm:gap-6"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-12 sm:w-12 sm:text-lg ${
                        completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {completed
                        ? "✓"
                        : index + 1}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className={`text-sm font-semibold sm:text-lg ${
                          completed
                            ? "text-green-700"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </h3>
                    </div>
                  </div>
                );
              })}

            </div>
          </Card>
        </section>

        {/* ORDER ITEMS */}

        <section className="mt-8 sm:mt-12">
          <Card className="rounded-2xl border-0 p-5 shadow-xl sm:rounded-[32px] sm:p-10">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Order Items
                </h2>

                <p className="mt-2 text-sm text-gray-500 sm:text-base">
                  Products included in this order.
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                {order.items.length} Item
                {order.items.length !== 1 ? "s" : ""}
              </span>

            </div>

            <div className="mt-7 space-y-4 sm:mt-10 sm:space-y-6">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-green-200 hover:shadow-lg sm:rounded-[26px] sm:p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-bold text-gray-900 sm:text-xl">
                      {item.product_name}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500 sm:mt-3">
                      ₦{Number(item.price).toLocaleString()} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-400 sm:text-sm">
                      Subtotal
                    </p>

                    <h3 className="mt-1 text-xl font-extrabold text-green-700 sm:mt-2 sm:text-2xl">
                      ₦{Number(item.subtotal).toLocaleString()}
                    </h3>
                  </div>
                </div>
              ))}

            </div>
          </Card>
        </section>

        {/* PAYMENT */}

        <section className="mt-8 sm:mt-10">
          <Card className="overflow-hidden rounded-2xl border-0 shadow-xl sm:rounded-[32px]">

            <div className="bg-blue-50 px-5 py-6 sm:px-10 sm:py-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-3">
                  <CreditCard
                    size={24}
                    className="text-blue-700 sm:h-7 sm:w-7"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Payment
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Payment information for this order.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:space-y-6 sm:p-10">

              {!order.payment ? (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 sm:p-6 sm:text-base">
                  Payment information is not available for this order.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-3">

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Payment ID
                      </p>

                      <p className="mt-2 text-lg font-bold text-gray-900 sm:text-xl">
                        #{order.payment.id}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Method
                      </p>

                      <p className="mt-2 break-words text-lg font-bold text-gray-900 sm:text-xl">
                        {getPaymentMethodLabel(
                          order.payment.method
                        )}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Amount
                      </p>

                      <p className="mt-2 text-lg font-bold text-green-700 sm:text-xl">
                        ₦
                        {Number(
                          order.payment.amount
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 p-4 sm:p-6 md:flex-row md:items-center md:justify-between">

                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Payment Status
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm ${getPaymentStatusBadge(
                          order.payment.status
                        )}`}
                      >
                        {getStatusLabel(
                          order.payment.status
                        )}
                      </span>
                    </div>

                    {order.payment.status === "pending" && (
                      <div className="flex w-full flex-col gap-4 sm:w-auto md:flex-row md:items-center">

                        <p className="max-w-md text-sm leading-6 text-gray-500">
                          Payment is currently pending. Confirm the
                          payment to mark this order as accepted.
                        </p>

                        <Button
                          type="button"
                          onClick={handleConfirmPayment}
                          disabled={
                            confirmPayment.isPending
                          }
                          className="inline-flex w-full items-center justify-center gap-2 sm:w-auto md:min-w-[190px]"
                        >
                          {confirmPayment.isPending ? (
                            <>
                              <Loader2
                                size={18}
                                className="animate-spin"
                              />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={18} />
                              Confirm Payment
                            </>
                          )}
                        </Button>

                      </div>
                    )}

                    {order.payment.status === "successful" && (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 sm:w-auto sm:px-5">
                        <CheckCircle2 size={20} />
                        Payment Confirmed
                      </div>
                    )}

                  </div>
                </>
              )}

            </div>
          </Card>
        </section>

        {/* DELIVERY */}

        <section className="mt-8 sm:mt-10">
          <Card className="overflow-hidden rounded-2xl border-0 shadow-xl sm:rounded-[32px]">

            <div className="bg-purple-50 px-5 py-6 sm:px-10 sm:py-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="shrink-0 rounded-xl bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-3">
                  <Truck
                    size={24}
                    className="text-purple-700 sm:h-7 sm:w-7"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Delivery
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 sm:text-base">
                    Track the delivery of your order.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:space-y-6 sm:p-10">

              {!order.delivery ? (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 sm:p-6 sm:text-base">
                  Delivery information is not available for this order.
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Delivery Status
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-bold sm:px-4 sm:py-2 sm:text-sm ${getDeliveryStatusBadge(
                          order.delivery.status
                        )}`}
                      >
                        {getDeliveryStatusLabel(
                          order.delivery.status
                        )}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                        Delivery ID
                      </p>

                      <p className="mt-2 text-lg font-bold text-gray-900 sm:mt-3 sm:text-xl">
                        #{order.delivery.id}
                      </p>
                    </div>

                  </div>

                  <div className="rounded-2xl border border-gray-100 p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <MapPin
                        size={22}
                        className="mt-1 shrink-0 text-purple-700 sm:h-6 sm:w-6"
                      />

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                          Delivery Address
                        </p>

                        <p className="mt-2 break-words text-base font-semibold leading-6 text-gray-900 sm:text-lg">
                          {order.delivery.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.delivery.tracking_number && (
                    <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 sm:p-6">
                      <p className="text-xs uppercase tracking-wide text-purple-700 sm:text-sm">
                        Tracking Number
                      </p>

                      <p className="mt-2 break-all text-lg font-extrabold text-gray-900 sm:text-xl">
                        {order.delivery.tracking_number}
                      </p>
                    </div>
                  )}
                </>
              )}

            </div>
          </Card>
        </section>

        {/* SUPPORT */}

        <section className="mt-10 overflow-hidden rounded-[28px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl sm:mt-14 sm:rounded-[34px]">

          <div className="grid gap-7 p-6 sm:gap-10 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">

            <div>
              <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur sm:text-sm">
                Need Assistance?
              </span>

              <h2 className="mt-5 text-3xl font-extrabold sm:mt-6 sm:text-4xl lg:text-5xl">
                We're Here To Help
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-green-100 sm:mt-6 sm:text-lg sm:leading-8">
                Have questions about your order, payment or delivery?
                Our support team and verified farmers are committed to
                ensuring you enjoy a smooth shopping experience from
                checkout to delivery.
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur sm:rounded-[30px] sm:p-8">

              <h3 className="text-xl font-bold sm:text-2xl">
                Marketplace Promise
              </h3>

              <div className="mt-5 space-y-3 text-sm text-green-100 sm:mt-6 sm:space-y-4 sm:text-base">

                <div className="flex items-center gap-3">
                  <span className="text-xl">🌾</span>
                  Fresh Farm Produce
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">🚜</span>
                  Verified Farmers
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">📦</span>
                  Transparent Tracking
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  Secure Marketplace
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ACTION BUTTONS */}

        <section className="mt-8 flex flex-col gap-3 pb-4 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">

          <Link
            to="/orders"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-700 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Back To Orders
          </Link>

          <Link
            to="/products"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-green-600 px-6 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Continue Shopping
          </Link>

        </section>

      </div>
    </main>
  );
};

export default OrderDetailsPage;