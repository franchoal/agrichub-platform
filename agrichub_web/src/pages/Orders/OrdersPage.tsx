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

        <div className="mx-auto max-w-7xl px-6 py-10">

          <section className="relative overflow-hidden rounded-[36px]">

            <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

            <div className="relative px-10 py-16 lg:px-16">

              <div className="h-6 w-40 animate-pulse rounded-full bg-white/20" />

              <div className="mt-8 h-16 w-80 animate-pulse rounded bg-white/20" />

              <div className="mt-6 h-6 max-w-2xl animate-pulse rounded bg-white/10" />

            </div>

          </section>


          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {Array.from({ length: 4 }).map((_, index) => (

              <Card
                key={index}
                className="rounded-[28px] border-0 p-8 shadow-lg"
              >

                <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />

                <div className="mt-5 h-12 w-20 animate-pulse rounded bg-gray-100" />

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

        <div className="mx-auto max-w-7xl px-6 py-16">

          <Card className="rounded-[30px] border-red-200 bg-red-50 p-10 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl">
              ⚠️
            </div>

            <h2 className="mt-6 text-3xl font-bold text-red-700">
              Unable to Load Orders
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-red-600">
              We couldn't retrieve your orders right now.
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

      <div className="mx-auto max-w-7xl px-6 py-10">


        {/* ======================================================
            HERO
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[36px]">

          <div className="absolute inset-0 bg-gradient-to-r from-green-800 via-green-700 to-emerald-600" />

          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 left-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative px-10 py-16 lg:px-16">

            <div className="max-w-3xl">

              <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur">

                📦 Order Management

              </span>

              <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">

                My Orders

              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">

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

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <Card className="rounded-[28px] border-0 p-8 shadow-lg">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Total Orders
            </p>

            <h2 className="mt-4 text-5xl font-extrabold text-green-700">
              {orders.length}
            </h2>

          </Card>


          <Card className="rounded-[28px] border-0 p-8 shadow-lg">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Pending
            </p>

            <h2 className="mt-4 text-5xl font-extrabold text-amber-500">
              {pendingOrders}
            </h2>

          </Card>


          <Card className="rounded-[28px] border-0 p-8 shadow-lg">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Delivered
            </p>

            <h2 className="mt-4 text-5xl font-extrabold text-green-600">
              {deliveredOrders}
            </h2>

          </Card>


          <Card className="rounded-[28px] border-0 p-8 shadow-lg">

            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Total Spending
            </p>

            <h2 className="mt-4 text-4xl font-extrabold text-green-700">

              ₦
              {totalSpending.toLocaleString()}

            </h2>

          </Card>

        </section>


        {/* ======================================================
            EMPTY ORDERS
        ====================================================== */}

        {orders.length === 0 ? (

          <section className="mt-12 overflow-hidden rounded-[34px] bg-white shadow-xl">

            <div className="px-10 py-24 text-center">

              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-green-100 text-7xl">
                📦
              </div>

              <h2 className="mt-10 text-5xl font-extrabold text-gray-900">
                No Orders Yet
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-500">

                You haven't placed any orders yet.
                Explore the marketplace and discover fresh
                agricultural products directly from farmers.

              </p>

              <div className="mt-12 flex flex-wrap justify-center gap-5">

                <Link
                  to="/products"
                  className="rounded-2xl bg-green-600 px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl"
                >
                  Explore Marketplace
                </Link>

                <Link
                  to="/"
                  className="rounded-2xl border border-green-600 px-8 py-4 font-bold text-green-700 transition hover:bg-green-50"
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

          <section className="mt-12 space-y-8">

            {orders.map((order) => (

              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="group block"
              >

                <Card className="overflow-hidden rounded-[32px] border-0 p-0 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">

                  <div className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center">


                    {/* ORDER INFORMATION */}

                    <div>

                      <div className="flex flex-wrap items-center gap-4">

                        <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-bold text-green-700">

                          Order #{order.id}

                        </span>


                        <span
                          className={`rounded-full px-5 py-2 text-sm font-bold ${getStatusClasses(
                            order.status
                          )}`}
                        >

                          {getStatusLabel(order.status)}

                        </span>

                      </div>


                      <h2 className="mt-6 text-3xl font-bold text-gray-900">

                        {order.farmer}

                      </h2>


                      <p className="mt-3 text-gray-500">

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


                      <p className="mt-2 text-sm text-gray-400">

                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}

                      </p>

                    </div>


                    {/* ORDER TOTAL */}

                    <div className="text-left lg:text-right">

                      <p className="text-sm uppercase tracking-wide text-gray-400">
                        Total Amount
                      </p>


                      <h3 className="mt-3 text-5xl font-extrabold text-green-700">

                        ₦
                        {Number(
                          order.total
                        ).toLocaleString()}

                      </h3>


                      <div className="mt-8 inline-flex items-center rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition group-hover:bg-green-600 group-hover:text-white">

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

          <section className="mt-12 overflow-hidden rounded-[34px] bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-xl">

            <div className="grid gap-8 p-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">

                  Keep Shopping

                </span>

                <h2 className="mt-5 text-3xl font-extrabold lg:text-4xl">

                  Discover More From Nigerian Farmers

                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-green-100">

                  Explore more agricultural products and continue
                  supporting farmers through the AgricWise Marketplace.

                </p>

              </div>


              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 font-bold text-green-700 transition hover:-translate-y-1 hover:shadow-xl"
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
