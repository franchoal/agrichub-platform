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
  if (isError) {

  return (

    <main className="mx-auto max-w-7xl px-6 py-10">

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
  // ======================================================
// LOADING
// ======================================================

if (isLoading) {

  return (

    <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">

      <div className="mx-auto max-w-7xl px-6 py-10">

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
  

 return (

  <main className="min-h-screen bg-gradient-to-b from-green-50/50 via-white to-white">

    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden rounded-[36px]">

        <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-20 left-8 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="relative px-10 py-16 lg:px-16">

          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur">

                Farmer Dashboard

              </span>

              <h1 className="mt-7 text-5xl font-extrabold text-white lg:text-6xl">

                Customer Orders

              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">

                Monitor every order placed for your farm products,
                keep track of customer purchases, and manage your
                marketplace business with confidence.

              </p>

            </div>

            <div className="grid gap-5">

              <div className="rounded-[28px] bg-white/15 p-8 text-center backdrop-blur">

                <p className="text-5xl font-extrabold text-white">

                  {orders.length}

                </p>

                <p className="mt-2 text-green-100">

                  Total Orders

                </p>

              </div>

              <div className="rounded-[28px] bg-white/15 p-8 text-center backdrop-blur">

                <p className="text-5xl">

                  🚜

                </p>

                <p className="mt-2 text-green-100">

                  Farmer Dashboard

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* PAGE HEADER */}
      {/* ====================================================== */}

      <section className="mt-10 rounded-[30px] bg-white p-8 shadow-lg">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-4xl font-bold text-gray-900">

              Incoming Orders

            </h2>

            <p className="mt-3 text-lg text-gray-500">

              View, monitor and fulfil customer orders from your farm.

            </p>

          </div>

        </div>

      </section>
      {/* ====================================================== */}
      {/* ORDERS */}
      {/* ====================================================== */}

      {orders.length === 0 ? (

        <section className="mt-10 overflow-hidden rounded-[34px] bg-white shadow-xl">

          <div className="px-10 py-24 text-center">

            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-green-100 text-7xl">

              📦

            </div>

            <h2 className="mt-10 text-5xl font-extrabold text-gray-900">

              No Customer Orders Yet

            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-500">

              Orders placed by buyers for your farm products will appear
              here. As your marketplace grows, you'll be able to manage,
              process and fulfill customer purchases from this dashboard.

            </p>

          </div>

        </section>

      ) : (

        <section className="mt-10 space-y-8">

          {orders.map((order) => (

            <Card
              key={order.id}
              className="overflow-hidden rounded-[30px] border-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center">

                {/* Left */}

                <div>

                  <div className="flex flex-wrap items-center gap-4">

                    <h2 className="text-3xl font-bold text-gray-900">

                      Order #{order.id}

                    </h2>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusBadge(
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

                      <p className="text-sm uppercase tracking-wide text-gray-400">

                        Customer

                      </p>

                      <p className="mt-2 text-lg font-semibold text-gray-900">

                        {order.buyer}

                      </p>

                    </div>

                    <div>

                      <p className="text-sm uppercase tracking-wide text-gray-400">

                        Order Date

                      </p>

                      <p className="mt-2 text-lg font-semibold text-gray-900">

                        {new Date(
                          order.created_at
                        ).toLocaleDateString()}

                      </p>

                    </div>

                  </div>

                </div>

                {/* Right */}

                <div className="text-right">

                  <p className="text-sm uppercase tracking-wide text-gray-400">

                    Order Value

                  </p>

                  <h3 className="mt-2 text-4xl font-extrabold text-green-700">

                    ₦{Number(order.total).toLocaleString()}

                  </h3>

                  <Link
                    to={`/farmer/orders/${order.id}`}
                    className="mt-8 inline-flex rounded-2xl bg-green-600 px-7 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                  >

                    Manage Order →

                  </Link>

                </div>

              </div>

            </Card>

          ))}

        </section>

      )}
            {/* ====================================================== */}
      {/* FARMER SUCCESS */}
      {/* ====================================================== */}

      <section className="mt-16 overflow-hidden rounded-[36px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-2xl">

        <div className="grid gap-10 p-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">

          <div>

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">

              Grow Your Farm Business

            </span>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight lg:text-5xl">

              Every Order Builds
              <br />
              Customer Trust

            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-green-100">

              Respond promptly to customer orders, prepare products carefully,
              and keep buyers informed throughout the fulfillment process.
              Consistent service leads to positive reviews, repeat customers,
              and increased visibility across the AgricWise Marketplace.

            </p>

          </div>

          <div className="rounded-[30px] bg-white/15 p-8 backdrop-blur">

            <h3 className="text-2xl font-bold">

              Best Practices

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

                Supply Fresh Produce

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
