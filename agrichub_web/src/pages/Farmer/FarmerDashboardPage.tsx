import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import { useFarmerOrders } from "../../hooks/useFarmerOrders";
import { useFarmerProducts } from "../../hooks/useFarmerProducts";
import { useFarmerProfile } from "../../hooks/useFarmerProfile";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import {
  useAgriculturalServices,
  useCreateAgriculturalService,
  useDeleteAgriculturalService,
  useUpdateAgriculturalService,
} from "../../hooks/useAgriculturalServices";

import type {
  AgriculturalService,
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
} from "../../services/farmerService";

import FarmerProductCard from "../../components/products/FarmerProductCard";
import AgriculturalServiceForm from "../../components/farmer/AgriculturalServiceForm";
import AgriculturalServiceCard from "../../components/farmer/AgriculturalServiceCard";

const FarmerDashboardPage = () => {
  const user = useAuthStore(
    (state) => state.user
  );

  /* ==============================
     Existing Business Data
  ============================== */

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

  /* ==============================
     Agricultural Services
  ============================== */

  const {
    data: services = [],
    isLoading: isServicesLoading,
    isError: isServicesError,
  } = useAgriculturalServices();

  const {
    mutate: createService,
    isPending: isCreatingService,
    isError: isCreateServiceError,
    reset: resetCreateService,
  } = useCreateAgriculturalService();

  const {
    mutate: updateService,
    isPending: isUpdatingService,
    isError: isUpdateServiceError,
    reset: resetUpdateService,
  } = useUpdateAgriculturalService();

  const {
    mutate: deleteService,
    isPending: isDeletingService,
  } = useDeleteAgriculturalService();

  /* ==============================
     Service UI State
  ============================== */

  const [showServiceForm, setShowServiceForm] =
    useState(false);

  const [editingService, setEditingService] =
    useState<AgriculturalService | null>(null);

  /* ==============================
     Derived Data
  ============================== */

  const products =
    productsData?.results ?? [];

  const orders =
    ordersData?.results ?? [];

  const inStockProducts =
    products.filter(
      (product) =>
        product.quantity > 0 &&
        product.is_available
    );

  const unavailableProducts =
    products.filter(
      (product) =>
        !product.is_available
    );

  const availableServices =
    services.filter(
      (service) =>
        service.is_available
    );

  /* ==============================
     Authentication / Profile
  ============================== */

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
          Loading AgricWise Business Workspace...
        </p>
      </main>
    );
  }

  if (!profile) {
    return (
      <Navigate
        to="/farmer/profile"
        replace
      />
    );
  }

  /* ==============================
     Product Actions
  ============================== */

  const handleDeleteProduct = (
    id: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmed) return;

    deleteProduct(id);
  };

  /* ==============================
     Service Form Actions
  ============================== */

  const resetServiceForm = () => {
    setEditingService(null);
    resetCreateService();
    resetUpdateService();
  };

  const openCreateServiceForm = () => {
    resetServiceForm();
    setShowServiceForm(true);
  };

  const openEditServiceForm = (
    service: AgriculturalService
  ) => {
    resetCreateService();
    resetUpdateService();

    setEditingService(service);
    setShowServiceForm(true);
  };

  const closeServiceForm = () => {
    if (
      isCreatingService ||
      isUpdatingService
    ) {
      return;
    }

    setShowServiceForm(false);
    resetServiceForm();
  };

  const handleServiceSubmit = (
    data:
      | CreateAgriculturalServiceData
      | UpdateAgriculturalServiceData
  ) => {
    if (editingService) {
      updateService(
        {
          id: editingService.id,
          data: data as UpdateAgriculturalServiceData,
        },
        {
          onSuccess: () => {
            setShowServiceForm(false);
            resetServiceForm();
          },
        }
      );

      return;
    }

    createService(
      data as CreateAgriculturalServiceData,
      {
        onSuccess: () => {
          setShowServiceForm(false);
          resetServiceForm();
        },
      }
    );
  };

  const handleDeleteService = (
    service: AgriculturalService
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to remove "${service.name}" from your services?`
      );

    if (!confirmed) return;

    deleteService(service.id);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white shadow-xl sm:p-8">

        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />

        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm uppercase tracking-widest text-green-100">
              AgricWise Business Dashboard
            </p>

            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Welcome back,
              <br />
              {profile.farm_name ||
                "Your Agricultural Business"}
            </h1>

            <p className="mt-4 max-w-2xl text-green-100">
              Manage your agricultural business,
              showcase your products and services,
              fulfil customer orders, and build your
              digital presence on AgricWise.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.business_categories
                ?.slice(0, 3)
                .map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {category.name}
                  </span>
                ))}
            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              to="/farmer/products/create"
              className="rounded-2xl bg-white px-5 py-3 font-semibold text-green-700 transition hover:shadow-lg"
            >
              + Add Product
            </Link>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="rounded-2xl border border-white/30 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              + Add Service
            </button>

          </div>

        </div>

      </section>

      {/* ==================================================
          BUSINESS OVERVIEW
      ================================================== */}

      <section className="mb-10">

        <div className="mb-6">

          <h2 className="text-2xl font-bold text-gray-900">
            Business Overview
          </h2>

          <p className="text-gray-500">
            A snapshot of your AgricWise business today.
          </p>

        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm text-gray-500">
              Products Listed
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-700">
              {products.length}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Products in your inventory
            </p>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm text-gray-500">
              Services Offered
            </p>

            <h2 className="mt-3 text-4xl font-bold text-emerald-600">
              {services.length}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Agricultural services you offer
            </p>
          </div>

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

          <div className="rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <p className="text-sm text-gray-500">
              Available Services
            </p>

            <h2 className="mt-3 text-4xl font-bold text-orange-500">
              {availableServices.length}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Services currently available
            </p>
          </div>

        </div>

      </section>

      {/* ==================================================
          VERIFICATION
      ================================================== */}

      <section
        className={`mb-10 rounded-2xl border p-5 ${
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
            ? "✓ AgricWise Business Verified"
            : "⏳ Business Verification Pending"}
        </h2>

        <p
          className={`mt-2 text-sm ${
            profile.is_verified
              ? "text-green-700"
              : "text-yellow-700"
          }`}
        >
          {profile.is_verified
            ? "Your agricultural business profile has been verified. Your products and services can be presented as part of your AgricWise business presence."
            : "Your business profile is awaiting verification. You can continue building your profile, adding products and services, and preparing your AgricWise business presence."}
        </p>

      </section>

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section className="mb-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Products
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-700">
            {productsData?.count ?? 0}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Services
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-700">
            {services.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Pending Orders
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

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Completed Orders
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

      </section>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="mb-10">

        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <Link
            to="/farmer/products/create"
            className="rounded-2xl bg-green-600 p-6 text-white shadow transition hover:bg-green-700"
          >
            <h2 className="text-xl font-semibold">
              + Add Product
            </h2>

            <p className="mt-2 text-sm text-green-100">
              List a product for customers to discover.
            </p>
          </Link>

          <button
            type="button"
            onClick={openCreateServiceForm}
            className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-xl"
          >
            <h2 className="text-xl font-semibold text-green-700">
              + Add Service
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Showcase an agricultural service you provide.
            </p>
          </button>

          <Link
            to="/farmer/orders"
            className="rounded-2xl bg-white p-6 shadow transition hover:bg-green-50"
          >
            <h2 className="text-xl font-semibold text-green-700">
              Customer Orders
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Manage incoming orders.
            </p>
          </Link>

          <Link
            to="/notifications"
            className="rounded-2xl bg-white p-6 shadow transition hover:bg-green-50"
          >
            <h2 className="text-xl font-semibold text-green-700">
              Notifications
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              View recent notifications.
            </p>
          </Link>

        </div>

      </section>

      {/* ==================================================
          REUSABLE SERVICE FORM
      ================================================== */}

      {showServiceForm && (
        <section className="mb-10 rounded-3xl border border-green-100 bg-white p-6 shadow-lg sm:p-8">

          <div className="mb-6 flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-green-600">
                AgricWise Services
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {editingService
                  ? "Edit Agricultural Service"
                  : "Add Agricultural Service"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Tell customers what agricultural service
                your business or professional practice provides.
              </p>
            </div>

            <button
              type="button"
              onClick={closeServiceForm}
              disabled={
                isCreatingService ||
                isUpdatingService
              }
              aria-label="Close service form"
              className="rounded-full bg-gray-100 px-3 py-2 text-gray-600 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ✕
            </button>

          </div>

          {(isCreateServiceError ||
            isUpdateServiceError) && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              We could not save this service.
              Please check the information and try again.
            </div>
          )}

          <AgriculturalServiceForm
            service={editingService}
            isSubmitting={
              isCreatingService ||
              isUpdatingService
            }
            onSubmit={handleServiceSubmit}
            onCancel={closeServiceForm}
          />

        </section>
      )}

      {/* ==================================================
          SERVICES
      ================================================== */}

      <section className="mb-10 rounded-3xl bg-white p-6 shadow-sm sm:p-8">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              My Agricultural Services
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Showcase the agricultural services your business
              or professional practice provides.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateServiceForm}
            className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            + Add Service
          </button>

        </div>

        {isServicesLoading ? (

          <div className="py-12 text-center">
            <p className="text-gray-500">
              Loading your services...
            </p>
          </div>

        ) : isServicesError ? (

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="font-medium text-red-700">
              Unable to load your services.
            </p>

            <p className="mt-2 text-sm text-red-600">
              Please refresh the page and try again.
            </p>

          </div>

        ) : services.length === 0 ? (

          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              🌱
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No services added yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500">
              Add the agricultural services you provide so
              customers can understand everything your
              business can offer.
            </p>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Add Your First Service
            </button>

          </div>

        ) : (

          <div className="grid gap-5 md:grid-cols-2">

            {services.map((service) => (

              <AgriculturalServiceCard
                key={service.id}
                service={service}
                onEdit={openEditServiceForm}
                onDelete={handleDeleteService}
                isDeleting={isDeletingService}
              />

            ))}

          </div>

        )}

      </section>

      {/* ==================================================
          BUSINESS PERFORMANCE / INSIGHTS
      ================================================== */}

      <section className="mb-10 grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-semibold">
            Business Performance
          </h2>

          <div className="mt-8 flex h-56 items-center justify-center rounded-2xl bg-gray-50">

            <div className="px-6 text-center">

              <p className="text-lg font-medium text-gray-700">
                Analytics Coming Soon
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Sales trends, revenue insights,
                service performance, and product
                performance will appear here.
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-2xl font-semibold">
            Business Insights
          </h2>

          <div className="mt-6 space-y-4 text-sm text-gray-700">

            <div>
              ✓ {products.length} Products Listed
            </div>

            <div>
              ✓ {inStockProducts.length} Products In Stock
            </div>

            <div>
              ✓ {services.length} Services Listed
            </div>

            <div>
              ✓ {availableServices.length} Services Available
            </div>

            <div>
              ✓ {unavailableProducts.length} Unavailable Product Listings
            </div>

            <div>
              ✓ {orders.length} Customer Orders
            </div>

            <div>
              ✓ {
                orders.filter(
                  (order) =>
                    order.status === "pending"
                ).length
              } Pending Orders
            </div>

            <div>
              {profile.is_verified
                ? "✓ Verified AgricWise Business"
                : "⏳ AgricWise Business Verification Pending"}
            </div>

          </div>

        </div>

      </section>

      {/* ==================================================
          RECENT ORDERS
      ================================================== */}

      <section className="mb-10 rounded-2xl bg-white p-6 shadow sm:p-8">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-semibold">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of recent customer purchases.
            </p>
          </div>

          <Link
            to="/farmer/orders"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            View All →
          </Link>

        </div>

        {orders.length === 0 ? (

          <p className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
            No customer orders yet.
          </p>

        ) : (

          <div className="space-y-4">

            {orders
              .slice(0, 5)
              .map((order) => (

                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <h3 className="font-semibold">
                      Order #{order.id}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Buyer: {order.buyer}
                    </p>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="font-semibold text-green-700">
                      ₦
                      {Number(
                        order.total
                      ).toLocaleString()}
                    </p>

                    <p className="text-sm capitalize text-gray-500">
                      {order.status.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                  </div>

                </div>

              ))}

          </div>

        )}

      </section>

      {/* ==================================================
          GROWTH SERVICES
      ================================================== */}

      <section className="mb-10">

        <h2 className="mb-2 text-3xl font-bold">
          Grow Your AgricWise Business
        </h2>

        <p className="mb-6 text-gray-500">
          More digital tools and agricultural business
          support are being built into AgricWise.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              title: "Business Analytics",
              description:
                "Understand sales, products, customers and business performance.",
            },
            {
              title: "Expert Consultation",
              description:
                "Connect with agricultural professionals and specialists.",
            },
            {
              title: "Business Advisory",
              description:
                "Get practical support for growing your agricultural business.",
            },
            {
              title: "Smart Logistics",
              description:
                "Discover better ways to move agricultural products and supplies.",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-xl"
            >

              <h3 className="font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                Coming Soon
              </span>

            </div>

          ))}

        </div>

      </section>

      {/* ==================================================
          BUSINESS TIP
      ================================================== */}

      <section className="mb-10 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white sm:p-8">

        <h2 className="text-2xl font-bold">
          Business Tip
        </h2>

        <p className="mt-4 max-w-2xl text-green-100">
          Complete your business profile, add clear
          product information, and describe your
          services accurately. A complete digital
          presence helps customers understand what
          your business offers.
        </p>

      </section>

      {/* ==================================================
          PRODUCTS
      ================================================== */}

      <section className="rounded-2xl bg-white p-6 shadow sm:p-8">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-2xl font-semibold">
              My Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your products, stock and marketplace availability.
            </p>

          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

            {productsData?.count ?? 0} Product
            {(productsData?.count ?? 0) !== 1
              ? "s"
              : ""}

          </span>

        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">

          <Link
            to="/farmer/products/create"
            className="rounded-xl bg-gray-50 p-6 transition hover:bg-green-50"
          >

            <h2 className="text-xl font-semibold text-green-700">
              + Add Product
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Add a new product to your business inventory.
            </p>

          </Link>

          <Link
            to="/farmer/profile"
            className="rounded-xl bg-gray-50 p-6 transition hover:bg-green-50"
          >

            <h2 className="text-xl font-semibold text-green-700">
              Business Profile
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Update your AgricWise business information.
            </p>

          </Link>

        </div>

        {/* Stock Summary */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border border-green-100 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Products
            </p>

            <p className="mt-2 text-2xl font-bold text-green-800">
              {products.length}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">
              In Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {inStockProducts.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-600">
              Unavailable
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {unavailableProducts.length}
            </p>
          </div>

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
                  onDelete={
                    handleDeleteProduct
                  }
                />

              ))}

            </div>

            {(productsData?.count ?? 0) >
              products.length && (

              <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">

                <p className="text-sm text-yellow-700">
                  Showing the first{" "}
                  {products.length} of{" "}
                  {productsData?.count} products.
                </p>

                <p className="mt-1 text-xs text-yellow-600">
                  Pagination for business products
                  will be added next.
                </p>

              </div>

            )}

          </>

        )}

      </section>

      {/* ==================================================
          FOOTER CTA
      ================================================== */}

      <section className="mt-12 rounded-3xl border bg-white p-6 text-center shadow-sm sm:p-8">

        <h2 className="text-3xl font-bold">
          Build Your Agricultural Business on AgricWise
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Your AgricWise business profile brings together
          your identity, products, services and future
          opportunities in one digital presence.
        </p>

      </section>

    </main>
  );
};

export default FarmerDashboardPage;