import { Link } from "react-router-dom";

import { Card } from "../../components/ui";

import { useOrders } from "../../hooks/useOrders";

const OrdersPage = () => {
  const {
    data,
    isLoading,
    isError,
  } = useOrders();

  const orders = data?.results ?? [];

  /*
  ======================================================
  LOADING STATE
  ======================================================
  */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/40 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <section className="relative overflow-hidden rounded-[24px] sm:rounded-[32px]">
            <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

            <div className="relative px-5 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
              <div className="h-5 w-32 animate-pulse rounded-full bg-white/20 sm:h-6 sm:w-40" />

              <div className="mt-6 h-10 w-56 animate-pulse rounded bg-white/20 sm:mt-8 sm:h-16 sm:w-80" />

              <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-white/10 sm:mt-6 sm:h-6" />
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className="rounded-[22px] border-0 p-5 shadow-lg sm:rounded-[28px] sm:p-8"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

                <div className="mt-4 h-10 w-20 animate-pulse rounded bg-gray-100 sm:mt-5 sm:h-12" />
              </Card>
            ))}
          </section>
        </div>
      </main>
    );
  }

  /*
  ======================================================
  ERROR STATE
  ======================================================
  */

  if (isError) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/40 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
          <Card className="rounded-[24px] border-red-200 bg-red-50 p-6 text-center sm:rounded-[30px] sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl sm:h-20 sm:w-20 sm:text-4xl">
              ⚠️
            </div>

            <h2 className="mt-5 text-2xl font-bold text-red-700 sm:mt-6 sm:text-3xl">
              Unable to Load Orders
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-red-600 sm:mt-4 sm:text-base">
              We couldn&apos;t retrieve your orders right now.
              Please refresh the page and try again.
            </p>
          </Card>
        </div>
      </main>
    );
  }

  /*
  ======================================================
  ORDER STATISTICS
  ======================================================
  */

  const pendingOrders = orders.filter(
    (order) =>
      order.status.toLowerCase() === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status.toLowerCase() === "delivered"
  ).length;

  const totalSpending = orders.reduce(
    (sum, order) =>
      sum + Number(order.total),
    0
  );

  /*
  ======================================================
  STATUS HELPERS
  ======================================================
  */

  const getStatusClasses = (
    status: string
  ) => {
    switch (status.toLowerCase()) {
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

  const getStatusLabel = (
    status: string
  ) => {
    switch (status.toLowerCase()) {
      case "out_for_delivery":
        return "Out for Delivery";

      case "pending":
        return "Pending";

      case "accepted":
        return "Accepted";

      case "processing":
        return "Processing";

      case "ready":
        return "Ready";

      case "delivered":
        return "Delivered";

      case "completed":
        return "Completed";

      case "cancelled":
        return "Cancelled";

      default:
        return status;
    }
  };

  /*
  ======================================================
  MAIN PAGE
  ======================================================
  */

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/40 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] lg:rounded-[36px]">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl sm:-right-10 sm:-top-10 sm:h-72 sm:w-72" />

          <div className="absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-white/10 blur-3xl sm:-bottom-20 sm:left-10 sm:h-60 sm:w-60" />

          <div className="relative px-5 py-9 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="max-w-3xl">

              <span className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur sm:px-5 sm:py-2 sm:text-sm">
                📦 Order Management
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:mt-7 sm:text-5xl lg:text-6xl">
                My Orders
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-green-100 sm:mt-6 sm:text-lg sm:leading-8">
                Monitor your purchases, follow order progress,
                and keep track of deliveries from farmers
                across the AgricWise Marketplace.
              </p>

            </div>
          </div>
        </section>

        {/* ======================================================
            SUMMARY CARDS
        ====================================================== */}

        <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Card className="rounded-[22px] border-0 p-5 shadow-lg sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Total Orders
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-green-700 sm:mt-4 sm:text-5xl">
              {orders.length}
            </h2>
          </Card>

          <Card className="rounded-[22px] border-0 p-5 shadow-lg sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Pending
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-amber-500 sm:mt-4 sm:text-5xl">
              {pendingOrders}
            </h2>
          </Card>

          <Card className="rounded-[22px] border-0 p-5 shadow-lg sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Delivered
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-green-600 sm:mt-4 sm:text-5xl">
              {deliveredOrders}
            </h2>
          </Card>

          <Card className="rounded-[22px] border-0 p-5 shadow-lg sm:rounded-[28px] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 sm:text-sm">
              Total Spending
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-green-700 sm:mt-4 sm:text-4xl">
              ₦{totalSpending.toLocaleString()}
            </h2>
          </Card>

        </section>

        {/* ======================================================
            EMPTY ORDERS
        ====================================================== */}

        {orders.length === 0 ? (
          <section className="mt-8 overflow-hidden rounded-[26px] bg-white shadow-xl sm:mt-12 sm:rounded-[34px]">
            <div className="px-5 py-14 text-center sm:px-10 sm:py-24">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl sm:h-36 sm:w-36 sm:text-7xl">
                📦
              </div>

              <h2 className="mt-7 text-3xl font-extrabold text-gray-900 sm:mt-10 sm:text-5xl">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-gray-500 sm:mt-6 sm:text-lg sm:leading-8">
                You haven&apos;t placed any orders yet.
                Explore the marketplace and discover fresh
                agricultural products directly from farmers.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-5">

                <Link
                  to="/products"
                  className="w-full rounded-2xl bg-green-600 px-6 py-3.5 text-center font-bold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl sm:w-auto sm:px-8 sm:py-4"
                >
                  Explore Marketplace
                </Link>

                <Link
                  to="/"
                  className="w-full rounded-2xl border border-green-600 px-6 py-3.5 text-center font-bold text-green-700 transition hover:bg-green-50 sm:w-auto sm:px-8 sm:py-4"
                >
                  Return Home
                </Link>

              </div>
            </div>
          </section>
        ) : (

          /* ======================================================
             ORDERS LIST
          ====================================================== */

          <section className="mt-8 space-y-4 sm:mt-12 sm:space-y-6 lg:space-y-8">

            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block"
              >

                <Card className="overflow-hidden rounded-[24px] border-0 p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[32px]">

                  <div className="grid gap-5 p-5 sm:gap-7 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:p-8">

                    {/* ORDER INFORMATION */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                        <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 sm:px-5 sm:py-2 sm:text-sm">
                          Order #{order.id}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold sm:px-5 sm:py-2 sm:text-sm ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>

                      </div>

                      <h2 className="mt-4 break-words text-2xl font-bold text-gray-900 sm:mt-6 sm:text-3xl">
                        {order.farmer}
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-gray-500 sm:mt-3 sm:text-base">
                        Ordered on{" "}
                        {new Date(
                          order.created_at
                        ).toLocaleDateString(
                          "en-NG",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>

                      <p className="mt-1.5 text-sm text-gray-400">
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}
                      </p>

                    </div>

                    {/* ORDER TOTAL */}

                    <div className="border-t pt-4 text-left sm:pt-5 lg:border-t-0 lg:pt-0 lg:text-right">

                      <p className="text-xs uppercase tracking-wide text-gray-400 sm:text-sm">
                        Total Amount
                      </p>

                      <h3 className="mt-2 text-3xl font-extrabold text-green-700 sm:mt-3 sm:text-5xl">
                        ₦
                        {Number(
                          order.total
                        ).toLocaleString()}
                      </h3>

                      <div className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition group-hover:bg-green-600 group-hover:text-white sm:mt-6 sm:w-auto sm:px-5">
                        View Order →
                      </div>

                    </div>

                  </div>

                </Card>

              </Link>
            ))}

          </section>
        )}

        {/* ======================================================
            MARKETPLACE CTA
        ====================================================== */}

        {orders.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-[26px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-xl sm:mt-12 sm:rounded-[34px]">

            <div className="grid gap-6 p-6 sm:gap-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <span className="inline-flex rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
                  Keep Shopping
                </span>

                <h2 className="mt-4 text-2xl font-extrabold sm:mt-5 sm:text-3xl lg:text-4xl">
                  Discover More From Nigerian Farmers
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-green-100 sm:mt-4 sm:text-base sm:leading-7">
                  Explore more agricultural products and continue
                  supporting farmers through the AgricWise Marketplace.
                </p>

              </div>

              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-green-700 transition hover:-translate-y-1 hover:shadow-xl sm:w-auto sm:px-7 sm:py-4 sm:text-base"
              >
                Explore Marketplace →
              </Link>

            </div>

          </section>
        )}

      </div>
    </main>
  );
};

export default OrdersPage;