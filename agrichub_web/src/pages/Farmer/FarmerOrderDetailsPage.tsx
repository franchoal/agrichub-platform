import { Link, Navigate, useParams } from "react-router-dom";

import { Card, Button } from "../../components/ui";

import { useFarmerOrder } from "../../hooks/useFarmerOrder";
import { useUpdateFarmerOrder } from "../../hooks/useUpdateFarmerOrder";

const FarmerOrderDetailsPage = () => {
  const { id } = useParams();

  const orderId = Number(id);

  if (!id || Number.isNaN(orderId)) {
    return (
      <Navigate
        to="/farmer/orders"
        replace
      />
    );
  }

  const {
    data: order,
    isLoading,
    isError,
  } = useFarmerOrder(orderId);

  const {
    mutate: updateOrder,
    isPending,
  } = useUpdateFarmerOrder();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200" />
            <div className="h-32 animate-pulse rounded-[28px] bg-gray-100" />
            <div className="h-72 animate-pulse rounded-[28px] bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="border-red-200 bg-red-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-red-700">
              Order not found
            </h2>

            <p className="mt-3 text-red-600">
              This order may no longer be available or could not be loaded.
            </p>

            <Link
              to="/farmer/orders"
              className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Back to Orders
            </Link>
          </Card>
        </div>
      </main>
    );
  }

  const nextStatus: Record<string, string> = {
    pending: "accepted",
    accepted: "processing",
    processing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
    delivered: "completed",
  };

  const nextLabel: Record<string, string> = {
    pending: "Accept Order",
    accepted: "Start Processing",
    processing: "Mark Ready",
    ready: "Dispatch Order",
    out_for_delivery: "Mark Delivered",
    delivered: "Complete Order",
  };

  const canUpdate = Boolean(nextStatus[order.status]);

  const formattedStatus = order.status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );

  const formattedPaymentStatus =
    order.payment?.status
      ? order.payment.status
          .replaceAll("_", " ")
          .replace(/\b\w/g, (character) =>
            character.toUpperCase()
          )
      : "Unavailable";

  const formattedDeliveryStatus =
    order.delivery?.status
      ? order.delivery.status
          .replaceAll("_", " ")
          .replace(/\b\w/g, (character) =>
            character.toUpperCase()
          )
      : "Unavailable";

  const isCompleted = order.status === "completed";
  const isCancelled = order.status === "cancelled";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/farmer/orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-800"
        >
          ← Back to Orders
        </Link>

        <section className="mt-6 overflow-hidden rounded-[30px] bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white shadow-xl sm:rounded-[36px]">
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                    AgricWise Business Order
                  </span>

                  <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                    Order #{order.id}
                  </h1>

                  <p className="mt-3 text-green-100">
                    Customer:{" "}
                    <span className="font-semibold text-white">
                      {order.buyer}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-green-100">
                    {order.farmer}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-green-100">
                    Current Status
                  </p>

                  <p className="mt-1 text-lg font-bold text-white">
                    {formattedStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2">
          <Card className="rounded-[28px] border-0 bg-white p-6 shadow-lg sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                ₦
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Payment
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {formattedPaymentStatus}
                </h2>

                {order.payment ? (
                  <>
                    <p className="mt-2 text-sm text-gray-500">
                      Method:{" "}
                      <span className="font-semibold text-gray-700">
                        {order.payment.method === "bank_transfer"
                          ? "Bank Transfer"
                          : "Card"}
                      </span>
                    </p>

                    <p className="mt-1 text-lg font-bold text-green-700">
                      ₦
                      {Number(
                        order.payment.amount
                      ).toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Payment information is not available.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white p-6 shadow-lg sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl">
                🚚
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Delivery
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {formattedDeliveryStatus}
                </h2>

                {order.delivery ? (
                  <>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      <span className="font-semibold text-gray-700">
                        Address:
                      </span>{" "}
                      {order.delivery.address}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      Tracking:{" "}
                      <span className="font-semibold text-gray-700">
                        {order.delivery.tracking_number ??
                          "Not assigned"}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">
                    Delivery information is not available.
                  </p>
                )}
              </div>
            </div>
          </Card>
        </section>

        <Card className="mt-6 overflow-hidden rounded-[28px] border-0 shadow-lg sm:mt-8">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Items
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Products included in this customer order.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.product_name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    ₦
                    {Number(
                      item.price
                    ).toLocaleString()}{" "}
                    × {item.quantity}
                  </p>
                </div>

                <span className="text-lg font-bold text-green-700 sm:text-right">
                  ₦
                  {Number(
                    item.subtotal
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <span className="text-lg font-semibold text-gray-700">
              Order Total
            </span>

            <span className="text-3xl font-extrabold text-green-700">
              ₦
              {Number(
                order.total
              ).toLocaleString()}
            </span>
          </div>
        </Card>

        {canUpdate ? (
          <Card className="mt-6 rounded-[28px] border-0 bg-white p-5 shadow-lg sm:mt-8 sm:p-8">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Order Management
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Move this order through the fulfillment process as your
                business completes each stage.
              </p>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800">
                Next step
              </p>

              <p className="mt-1 text-sm text-green-700">
                {nextLabel[order.status]}
              </p>
            </div>

            <Button
              className="mt-5 w-full rounded-2xl py-3.5 text-base font-semibold"
              disabled={isPending}
              onClick={() =>
                updateOrder({
                  id: order.id,
                  data: {
                    status: nextStatus[
                      order.status
                    ] as
                      | "accepted"
                      | "processing"
                      | "ready"
                      | "out_for_delivery"
                      | "delivered"
                      | "completed",
                  },
                })
              }
            >
              {isPending
                ? "Updating Order..."
                : nextLabel[order.status]}
            </Button>
          </Card>
        ) : isCancelled ? (
          <Card className="mt-6 rounded-[28px] border-0 bg-red-50 p-6 shadow-lg sm:mt-8 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                ×
              </div>

              <div>
                <h2 className="text-xl font-bold text-red-800">
                  Order Cancelled
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  This order has been cancelled and no further fulfillment
                  actions are available.
                </p>
              </div>
            </div>
          </Card>
        ) : isCompleted ? (
          <Card className="mt-6 rounded-[28px] border-0 bg-green-50 p-6 shadow-lg sm:mt-8 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl">
                ✓
              </div>

              <div>
                <h2 className="text-xl font-bold text-green-800">
                  Order Completed
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  This order has completed the full fulfillment process.
                </p>
              </div>
            </div>
          </Card>
        ) : null}

        <section className="mt-8 rounded-[28px] bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-2xl">
              🤝
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Build Customer Trust
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                Keep customers informed, fulfill orders promptly, and
                maintain the quality of your products or services. Reliable
                fulfillment helps build repeat business and a stronger
                reputation on AgricWise.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FarmerOrderDetailsPage;