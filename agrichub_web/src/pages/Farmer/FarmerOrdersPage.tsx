import { Link } from "react-router-dom";

import { Card } from "../../components/ui";
import { useFarmerOrders } from "../../hooks/useFarmerOrders";

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

const FarmerOrdersPage = () => {
  const {
    data,
    isLoading,
    isError,
  } = useFarmerOrders();

  const orders = data?.results ?? [];

  /*
  ==========================================
  ERROR
  ==========================================
  */

  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="border-red-200 bg-red-50 p-8">
          <h2 className="text-2xl font-bold text-red-700">
            Unable to load orders
          </h2>

          <p className="mt-3 text-red-600">
            Please refresh the page and try again.
          </p>
        </Card>
      </main>
    );
  }

  /*
  ==========================================
  LOADING
  ==========================================
  */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="h-72 animate-pulse rounded-[36px] bg-green-100" />

            <div className="h-32 animate-pulse rounded-[30px] bg-gray-100" />

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-[30px] bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /*
  ==========================================
  MAIN
  ==========================================
  */

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ========================================== */}
        {/* HERO */}
        {/* ========================================== */}

        <section className="relative overflow-hidden rounded-[32px] sm:rounded-[36px]">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 left-8 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  AgricWise Business Workspace
                </span>

                <h1 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                  Customer Orders
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-green-100 sm:text-lg sm:leading-8">
                  Monitor customer purchases, manage incoming orders, and
                  keep your agricultural business moving smoothly from
                  order to fulfillment.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[26px] bg-white/15 p-6 text-center backdrop-blur sm:p-7">
                  <p className="text-4xl font-extrabold text-white sm:text-5xl">
                    {orders.length}
                  </p>

                  <p className="mt-2 text-sm text-green-100 sm:text-base">
                    Total Orders
                  </p>
                </div>

                <div className="rounded-[26px] bg-white/15 p-6 text-center backdrop-blur sm:p-7">
                  <p className="text-4xl sm:text-5xl">
                    📦
                  </p>

                  <p className="mt-2 text-sm text-green-100 sm:text-base">
                    Business Orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* PAGE HEADER */}
        {/* ========================================== */}

        <section className="mt-8 rounded-[28px] bg-white p-6 shadow-lg sm:mt-10 sm:p-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Incoming Orders
            </h2>

            <p className="mt-3 max-w-3xl text-base leading-7 text-gray-500 sm:text-lg">
              View, monitor, and fulfill customer orders for your products
              and agricultural offerings on AgricWise.
            </p>
          </div>
        </section>

        {/* ========================================== */}
        {/* ORDERS */}
        {/* ========================================== */}

        {orders.length === 0 ? (
          <section className="mt-8 overflow-hidden rounded-[30px] bg-white shadow-xl sm:mt-10 sm:rounded-[34px]">
            <div className="px-6 py-16 text-center sm:px-10 sm:py-24">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100 text-6xl sm:h-36 sm:w-36 sm:text-7xl">
                📦
              </div>

              <h2 className="mt-8 text-3xl font-extrabold text-gray-900 sm:mt-10 sm:text-5xl">
                No Customer Orders Yet
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-500 sm:mt-6 sm:text-lg sm:leading-8">
                Orders placed by customers for your products will appear
                here. As your AgricWise business grows, you can use this
                workspace to monitor, process, and fulfill customer
                purchases.
              </p>

              <Link
                to="/farmer"
                className="mt-8 inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg"
              >
                Back to Business Workspace
              </Link>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden rounded-[28px] border-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[30px]"
              >
                <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  {/* LEFT */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Order #{order.id}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status
                          .replaceAll("_", " ")
                          .replace(
                            /\b\w/g,
                            (c: string) => c.toUpperCase()
                          )}
                      </span>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400 sm:text-sm">
                          Customer
                        </p>

                        <p className="mt-2 text-base font-semibold text-gray-900 sm:text-lg">
                          {order.buyer}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400 sm:text-sm">
                          Order Date
                        </p>

                        <p className="mt-2 text-base font-semibold text-gray-900 sm:text-lg">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="border-t border-gray-100 pt-6 lg:border-0 lg:pt-0 lg:text-right">
                    <p className="text-xs uppercase tracking-wide text-gray-400 sm:text-sm">
                      Order Value
                    </p>

                    <h3 className="mt-2 text-3xl font-extrabold text-green-700 sm:text-4xl">
                      ₦{Number(order.total).toLocaleString()}
                    </h3>

                    <Link
                      to={`/farmer/orders/${order.id}`}
                      className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl sm:w-auto"
                    >
                      Manage Order →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* ========================================== */}
        {/* BUSINESS SUCCESS */}
        {/* ========================================== */}

        <section className="mt-12 overflow-hidden rounded-[32px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl sm:mt-16 sm:rounded-[36px]">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
                Grow Your Agricultural Business
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
                Every Order Builds
                <br />
                Customer Trust
              </h2>

              <p className="mt-5 max-w-3xl text-base leading-7 text-green-100 sm:mt-6 sm:text-lg sm:leading-8">
                Respond promptly to customer orders, prepare products or
                services carefully, and keep customers informed throughout
                the fulfillment process. Consistent service can lead to
                positive reviews, repeat customers, and stronger visibility
                across AgricWise.
              </p>
            </div>

            <div className="rounded-[26px] bg-white/15 p-6 backdrop-blur sm:rounded-[30px] sm:p-8">
              <h3 className="text-2xl font-bold">
                Business Best Practices
              </h3>

              <div className="mt-6 space-y-5 text-green-100">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    📦
                  </span>

                  Process Orders Quickly
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    🌾
                  </span>

                  Maintain Product Quality
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    ⭐
                  </span>

                  Earn Better Ratings
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    🤝
                  </span>

                  Build Loyal Customers
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FarmerOrdersPage;