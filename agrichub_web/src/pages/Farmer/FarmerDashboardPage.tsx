import { Link, Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import { useFarmerOrders } from "../../hooks/useFarmerOrders";
import { useFarmerProducts } from "../../hooks/useFarmerProducts";
import { useFarmerProfile } from "../../hooks/useFarmerProfile";

import { useDeleteProduct } from "../../hooks/useDeleteProduct";

import FarmerProductCard from "../../components/products/FarmerProductCard";

const FarmerDashboardPage = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  const {
    data: productsData,
    isLoading,
  } = useFarmerProducts();

  const {
    data: ordersData,
  } = useFarmerOrders();

  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useFarmerProfile();

  const {
    mutate: deleteProduct,
  } = useDeleteProduct();

  const products =
    productsData?.results ?? [];

  const orders =
    ordersData?.results ?? [];

  /**
   * Only authenticated users with an existing
   * FarmerProfile can access this transitional
   * agricultural workspace.
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (isProfileLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Loading workspace...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <Navigate
        to="/products"
        replace
      />
    );
  }

  /**
   * Confirm before deleting.
   */
  const handleDelete = (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) return;

    deleteProduct(id);
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">

      {/* Header */}

      {/* Hero Section */}

      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white shadow-xl">

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />

        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-widest text-green-100">
              Farmer Business Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight">
              Welcome back,
              <br />
              {profile?.farm_name || "Your Farm"}
            </h1>

            <p className="mt-4 max-w-2xl text-green-100">
              Manage products, fulfil customer orders,
              and grow your agricultural business
              from one powerful dashboard.
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            <Link
              to="/farmer/products/create"
              className="rounded-2xl bg-white px-6 py-3 font-semibold text-green-700 transition hover:shadow-lg"
            >
              + Add Product
            </Link>

            <Link
              to="/products"
              className="rounded-2xl border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Marketplace
            </Link>

          </div>

        </div>

      </section>

      <section className="mb-10">

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Business Overview
          </h2>

          <p className="text-gray-500">
            A snapshot of your farm business today.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Total Products */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <p className="text-sm text-gray-500">
              Products Listed
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-700">
              {products.length}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Available in the marketplace
            </p>

          </div>

          {/* Active Orders */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <p className="text-sm text-gray-500">
              Active Orders
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-600">
              {orders.length}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Customer purchases
            </p>

          </div>

          {/* Pending Orders */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <h2 className="mt-3 text-4xl font-bold text-orange-500">

              {
                orders.filter(
                  order => order.status === "pending"
                ).length
              }

            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Awaiting fulfilment
            </p>

          </div>

          {/* Estimated Revenue */}

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <p className="text-sm text-gray-500">
              Estimated Revenue
            </p>

            <h2 className="mt-3 text-4xl font-bold text-emerald-600">
              ₦0
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Revenue analytics coming soon
            </p>

          </div>

        </div>

      </section>

      {/* Verification Status */}

      {profile && (
        <div
          className={`mb-10 rounded-xl border p-5 ${
            profile.is_verified
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }`}
        >

          <h2
            className={`text-lg font-semibold ${
              profile.is_verified
                ? "text-green-700"
                : "text-yellow-700"
            }`}
          >
            {profile.is_verified
              ? "✅ Farmer Verified"
              : "⏳ Verification Pending"}
          </h2>

          <p
            className={`mt-2 text-sm ${
              profile.is_verified
                ? "text-green-700"
                : "text-yellow-700"
            }`}
          >
            {profile.is_verified
              ? "Your account has been verified. Any product marked as available will be visible in the marketplace."
              : "Your profile is awaiting administrator approval. You can continue adding and managing products, but they won't appear in the marketplace until your account has been verified."}
          </p>

        </div>
      )}

      {/* Dashboard Statistics */}

      <div className="mb-10 grid gap-5 md:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {productsData?.count ?? 0}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Orders
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-700">
            {ordersData?.count ?? 0}
          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-3xl font-bold text-yellow-600">

            {
              orders.filter(
                (order) =>
                  order.status === "pending"
              ).length
            }

          </h2>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-700">

            {
              orders.filter(
                (order) =>
                  order.status === "completed"
              ).length
            }

          </h2>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

        <Link
          to="/farmer/products/create"
          className="rounded-xl bg-green-600 p-6 text-white shadow transition hover:bg-green-700"
        >

          <h2 className="text-xl font-semibold">
            ➕ Add Product
          </h2>

          <p className="mt-2 text-sm text-green-100">
            List a new product.
          </p>

        </Link>

        <Link
          to="#"
          className="rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
        >

          <h2 className="text-xl font-semibold text-green-700">
            📊 Analytics
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Business insights
          </p>

          <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
            Coming Soon
          </span>

        </Link>

        <Link
          to="/farmer/orders"
          className="rounded-xl bg-white p-6 shadow transition hover:bg-green-50"
        >

          <h2 className="text-xl font-semibold text-green-700">
            🛒 Customer Orders
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Manage incoming orders.
          </p>

        </Link>

        <Link
          to="/notifications"
          className="rounded-xl bg-white p-6 shadow transition hover:bg-green-50"
        >

          <h2 className="text-xl font-semibold text-green-700">
            🔔 Notifications
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            View recent notifications.
          </p>

        </Link>

      </div>

      <section className="mb-10 grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-semibold">
            Business Performance
          </h2>

          <div className="mt-8 flex h-56 items-center justify-center rounded-2xl bg-gray-50">

            <div className="text-center">

              <p className="text-lg font-medium text-gray-700">
                Analytics Coming Soon
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Sales trends, revenue insights,
                and product performance.
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-semibold">
            Business Insights
          </h2>

          <div className="mt-6 space-y-4">

            <div>✓ {products.length} Products Listed</div>

            <div>✓ {orders.length} Customer Orders</div>

            <div>
              ✓ {
                orders.filter(
                  o => o.status === "pending"
                ).length
              } Pending Orders
            </div>

            <div>✓ Verified Farm Business</div>

          </div>

        </div>

      </section>

      {/* Recent Orders */}

      <section className="mb-10 rounded-xl bg-white p-8 shadow">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            Recent Orders
          </h2>

          <Link
            to="/farmer/orders"
            className="text-green-700 hover:underline"
          >
            View All →
          </Link>

        </div>

        {orders.length === 0 ? (

          <p className="text-gray-500">
            No customer orders yet.
          </p>

        ) : (

          <div className="space-y-4">

            {orders.slice(0, 5).map((order) => (

              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div>

                  <h3 className="font-semibold">
                    Order #{order.id}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Buyer: {order.buyer}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-green-700">
                    ₦{Number(order.total).toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.status.replaceAll("_", " ")}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      <section className="mb-10">

        <h2 className="mb-6 text-3xl font-bold">
          Grow Your Farm Business
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

          {[
            "Business Analytics",
            "Expert Consultation",
            "Farm Business Advisory",
            "Smart Logistics",
          ].map((item) => (

            <div
              key={item}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-xl"
            >

              <h3 className="font-semibold">
                {item}
              </h3>

              <p className="mt-3 text-sm text-gray-600">
                Premium services to help grow your farm business.
              </p>

              <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                Coming Soon
              </span>

            </div>

          ))}

        </div>

      </section>

      <section className="mb-10 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">

        <h2 className="text-2xl font-bold">
          💡 Business Tip
        </h2>

        <p className="mt-4 max-w-2xl text-green-100">
          Products with high-quality images and detailed
          descriptions attract more buyers and increase trust.
        </p>

      </section>

      {/* Products */}

      <section className="rounded-xl bg-white p-8 shadow">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-semibold">
            My Products
          </h2>

          <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

            {productsData?.count ?? 0} Product
            {(productsData?.count ?? 0) !== 1
              ? "s"
              : ""}

          </span>

        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">

          <Link
            to="/farmer/products"
            className="rounded-xl bg-gray-50 p-6 transition hover:bg-green-50"
          >

            <h2 className="text-xl font-semibold text-green-700">
              📦 My Products
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View and manage all products.
            </p>

          </Link>

          <Link
            to="/farmer/profile"
            className="rounded-xl bg-gray-50 p-6 transition hover:bg-green-50"
          >

            <h2 className="text-xl font-semibold text-green-700">
              👨‍🌾 Farm Profile
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Update your farm information.
            </p>

          </Link>

        </div>

        {isLoading ? (

          <div className="py-12 text-center">

            <p className="text-gray-500">
              Loading products...
            </p>

          </div>

        ) : products.length === 0 ? (

          <div className="py-16 text-center">

            <p className="mb-6 text-gray-500">
              You haven't added any products yet.
            </p>

            <Link
              to="/farmer/products/create"
              className="inline-block rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
            >
              Add Your First Product
            </Link>

          </div>

        ) : (

          <>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => (

                <FarmerProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />

              ))}

            </div>

            {(productsData?.count ?? 0) > products.length && (

              <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">

                <p className="text-sm text-yellow-700">
                  Showing the first {products.length} of{" "}
                  {productsData?.count} products.
                </p>

                <p className="mt-1 text-xs text-yellow-600">
                  Pagination for farmer products will be added next.
                </p>

              </div>

            )}

          </>

        )}

      </section>

      <section className="mt-12 rounded-3xl border bg-white p-8 text-center shadow-sm">

        <h2 className="text-3xl font-bold">
          Grow Your Farm Business
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          AgricHub is building digital tools that help Nigerian
          farmers sell, manage, and grow with confidence.
        </p>

      </section>

    </main>
  );
};

export default FarmerDashboardPage;