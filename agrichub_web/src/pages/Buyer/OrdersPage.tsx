import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  CalendarDays,
  Truck,
  ArrowRight,
} from "lucide-react";

import { Card } from "../../components/ui";

import { useOrders } from "../../hooks/useOrders";

const OrdersPage = () => {
  const {
    data,
    isLoading,
    isError,
  } = useOrders();

  const orders = data?.results ?? [];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="space-y-5">
          <div className="h-12 w-72 animate-pulse rounded-xl bg-gray-200" />
          <div className="grid gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-[30px] bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">

        <Card className="rounded-[30px] border-red-200 bg-red-50 p-10">

          <h2 className="text-3xl font-bold text-red-700">

            Unable to Load Orders

          </h2>

          <p className="mt-4 text-red-600">

            Something went wrong while loading your orders.
            Please refresh the page and try again.

          </p>

        </Card>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Hero */}

      <section className="mb-12 overflow-hidden rounded-[36px] bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white shadow-xl">

        <div className="grid gap-8 p-10 lg:grid-cols-[1fr_auto] lg:items-center">

          <div>

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">

              Buyer Dashboard

            </span>

            <h1 className="mt-6 text-5xl font-extrabold">

              My Orders

            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-green-100">

              Track your purchases, monitor delivery progress and
              review your complete order history from the AgricWise
              Marketplace.

            </p>

          </div>

          <div className="rounded-[30px] bg-white/15 p-8 text-center backdrop-blur">

            <Package
              size={70}
              className="mx-auto mb-5"
            />

            <p className="text-5xl font-extrabold">

              {orders.length}

            </p>

            <p className="mt-2 text-green-100">

              Total Orders

            </p>

          </div>

        </div>

      </section>

      {/* Empty State */}

      {orders.length === 0 ? (

        <Card className="rounded-[32px] p-20 text-center shadow-lg">

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-green-100">

            <ShoppingBag
              size={56}
              className="text-green-700"
            />

          </div>

          <h2 className="mt-8 text-4xl font-bold text-gray-900">

            No Orders Yet

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">

            You haven't placed any orders yet.
            Browse fresh farm products and start shopping directly
            from trusted Nigerian farmers.

          </p>

          <Link
            to="/products"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-green-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
          >

            Browse Marketplace

            <ArrowRight size={20} />

          </Link>

        </Card>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (

            <Card
              key={order.id}
              className="overflow-hidden rounded-[30px] p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Header */}

              <div className="border-b bg-gradient-to-r from-gray-50 to-green-50 px-8 py-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <p className="text-sm font-semibold uppercase tracking-wide text-green-700">

                      Order Number

                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-900">

                      #{order.id}

                    </h2>

                  </div>

                  <span className="rounded-full bg-yellow-100 px-5 py-3 text-sm font-bold capitalize text-yellow-700">

                    {order.status}

                  </span>

                </div>

              </div>

              {/* Body */}

              <div className="grid gap-8 p-8 lg:grid-cols-3">

                <div>

                  <div className="mb-3 flex items-center gap-3">

                    <ShoppingBag
                      size={20}
                      className="text-green-700"
                    />

                    <h3 className="font-semibold">

                      Farmer

                    </h3>

                  </div>

                  <p className="text-gray-600">

                    {order.farmer}

                  </p>

                </div>

                <div>

                  <div className="mb-3 flex items-center gap-3">

                    <CalendarDays
                      size={20}
                      className="text-green-700"
                    />

                    <h3 className="font-semibold">

                      Order Date

                    </h3>

                  </div>

                  <p className="text-gray-600">

                    {new Date(
                      order.created_at
                    ).toLocaleDateString(
                      "en-NG",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}

                  </p>

                </div>

                <div>

                  <div className="mb-3 flex items-center gap-3">

                    <Truck
                      size={20}
                      className="text-green-700"
                    />

                    <h3 className="font-semibold">

                      Total Amount

                    </h3>

                  </div>

                  <p className="text-3xl font-extrabold text-green-700">

                    ₦{Number(
                      order.total
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </Card>

          ))}

        </div>

      )}

    </main>
  );
};

export default OrdersPage;
