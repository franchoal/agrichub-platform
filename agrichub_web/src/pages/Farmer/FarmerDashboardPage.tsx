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
  const user = useAuthStore((state) => state.user);

  /* ==============================
     Business Data
  ============================== */

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useFarmerProducts();

  const { data: ordersData } = useFarmerOrders();

  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useFarmerProfile();

  const { mutate: deleteProduct } = useDeleteProduct();

  /* ==============================
     Agricultural Services
  ============================== */

  const {
    data: servicesData,
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
     Defensive Data Normalization
  ============================== */

  const products = Array.isArray(productsData?.results)
    ? productsData.results
    : [];

  const orders = Array.isArray(ordersData?.results)
    ? ordersData.results
    : [];

  const services: AgriculturalService[] =
    Array.isArray(servicesData)
      ? servicesData
      : [];

  const businessCategories =
    profile &&
    Array.isArray(profile.business_categories)
      ? profile.business_categories
      : [];

  /* ==============================
     Derived Business Data
  ============================== */

  const inStockProducts = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.is_available
  );

  const unavailableProducts = products.filter(
    (product) => !product.is_available
  );

  const availableServices = services.filter(
    (service: AgriculturalService) =>
      service.is_available
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const productCount =
    productsData?.count ?? products.length;

  const profileHasCategories =
    businessCategories.length > 0;

  const profileHasDescription =
    Boolean(profile?.farm_description?.trim());

  const profileCompletionItems = [
    Boolean(profile?.farm_name?.trim()),
    Boolean(profile?.farm_location?.trim()),
    profileHasCategories,
    profileHasDescription,
  ];

  const completedProfileItems =
    profileCompletionItems.filter(Boolean).length;

  const profileCompletion =
    Math.round(
      (completedProfileItems /
        profileCompletionItems.length) *
        100
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
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="text-gray-500">
            Loading your AgricWise Business Workspace...
          </p>
        </div>
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

  const handleDeleteProduct = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

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
          data:
            data as UpdateAgriculturalServiceData,
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
    const confirmed = window.confirm(
      `Are you sure you want to remove "${service.name}" from your services?`
    );

    if (!confirmed) {
      return;
    }

    deleteService(service.id);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* ==================================================
          BUSINESS HERO
      ================================================== */}

      <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 p-6 text-white shadow-xl sm:p-8 lg:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute right-1/4 top-1/2 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-green-50 backdrop-blur-sm">
              AgricWise Business Portal
            </div>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Welcome back,
              <br />
              <span className="text-green-50">
                {profile.farm_name ||
                  "Your Agricultural Business"}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
              Manage your agricultural business,
              showcase what you offer, connect with
              customers and grow your digital presence
              on AgricWise.
            </p>

            {businessCategories.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {businessCategories
                  .slice(0, 4)
                  .map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                    >
                      {category.name}
                    </span>
                  ))}

                {businessCategories.length > 4 && (
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-green-50">
                    +{businessCategories.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/farmer/products/create"
              className="rounded-2xl bg-white px-5 py-3 text-center font-semibold text-green-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              + Add Product
            </Link>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              + Add Service
            </button>

            <Link
              to="/farmer/profile"
              className="rounded-2xl border border-white/30 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
            >
              Edit Business
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================
          PROFILE COMPLETION
      ================================================== */}

      {profileCompletion < 100 && (
        <section className="mb-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-lg">
                  ✨
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Complete Your Business Profile
                  </h2>

                  <p className="text-sm text-gray-500">
                    A complete profile helps people
                    understand and trust your business.
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-500">
                    Profile completion
                  </span>

                  <span className="text-green-700">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all duration-500"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <Link
              to="/farmer/profile"
              className="shrink-0 rounded-xl bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Complete Profile
            </Link>
          </div>
        </section>
      )}

      {/* ==================================================
          BUSINESS OVERVIEW
      ================================================== */}

      <section className="mb-10">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Your Business
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Business Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A snapshot of what is happening across
            your AgricWise business.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl">
                📦
              </div>

              <span className="text-xs font-medium text-gray-400">
                Inventory
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Products Listed
            </p>

            <p className="mt-1 text-4xl font-bold text-green-700">
              {productCount}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {inStockProducts.length} currently in stock
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                🛠️
              </div>

              <span className="text-xs font-medium text-gray-400">
                Services
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Services Offered
            </p>

            <p className="mt-1 text-4xl font-bold text-emerald-600">
              {services.length}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {availableServices.length} currently available
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🛒
              </div>

              <span className="text-xs font-medium text-gray-400">
                Sales
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Customer Orders
            </p>

            <p className="mt-1 text-4xl font-bold text-blue-600">
              {orders.length}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              {pendingOrders.length} awaiting action
            </p>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-xl">
                ✓
              </div>

              <span className="text-xs font-medium text-gray-400">
                Trust
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Business Status
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                profile.is_verified
                  ? "text-green-700"
                  : "text-orange-600"
              }`}
            >
              {profile.is_verified
                ? "Verified"
                : "Verification Pending"}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              AgricWise business verification
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          VERIFICATION
      ================================================== */}

      <section
        className={`mb-10 rounded-3xl border p-6 sm:p-7 ${
          profile.is_verified
            ? "border-green-200 bg-green-50"
            : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
                profile.is_verified
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {profile.is_verified
                ? "✓ Verified Business"
                : "⏳ Verification Pending"}
            </div>

            <h2
              className={`mt-3 text-xl font-bold ${
                profile.is_verified
                  ? "text-green-800"
                  : "text-yellow-800"
              }`}
            >
              {profile.is_verified
                ? "Your AgricWise business is verified"
                : "Your AgricWise business is awaiting verification"}
            </h2>

            <p
              className={`mt-2 max-w-3xl text-sm leading-6 ${
                profile.is_verified
                  ? "text-green-700"
                  : "text-yellow-700"
              }`}
            >
              {profile.is_verified
                ? "Your agricultural business profile has been verified. Continue keeping your business information, products and services accurate and up to date."
                : "You can continue building your business presence, adding products and services while your profile is awaiting verification."}
            </p>
          </div>

          <Link
            to="/farmer/profile"
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold ${
              profile.is_verified
                ? "bg-white text-green-700 shadow-sm"
                : "bg-yellow-600 text-white hover:bg-yellow-700"
            }`}
          >
            Review Profile
          </Link>
        </div>
      </section>

      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the most important parts of your
            AgricWise business.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/farmer/products/create"
            className="group rounded-2xl bg-green-600 p-6 text-white shadow-sm transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
          >
            <div className="text-2xl">📦</div>

            <h3 className="mt-4 text-lg font-semibold">
              Add Product
            </h3>

            <p className="mt-2 text-sm text-green-100">
              List products, supplies or agricultural
              goods you offer.
            </p>
          </Link>

          <button
            type="button"
            onClick={openCreateServiceForm}
            className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
          >
            <div className="text-2xl">🛠️</div>

            <h3 className="mt-4 text-lg font-semibold text-green-700">
              Add Service
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Showcase consultancy, farm management,
              training or other services.
            </p>
          </button>

          <Link
            to="/farmer/orders"
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          >
            <div className="text-2xl">🛒</div>

            <h3 className="mt-4 text-lg font-semibold text-blue-700">
              Customer Orders
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Review and manage incoming customer
              purchases.
            </p>
          </Link>

          <Link
            to="/notifications"
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
          >
            <div className="text-2xl">🔔</div>

            <h3 className="mt-4 text-lg font-semibold text-purple-700">
              Notifications
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Stay updated about activity affecting
              your business.
            </p>
          </Link>
        </div>
      </section>

      {/* ==================================================
          SERVICE FORM
      ================================================== */}

      {showServiceForm && (
        <section className="mb-10 rounded-3xl border border-green-100 bg-white p-6 shadow-lg sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
                Business Services
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {editingService
                  ? "Edit Agricultural Service"
                  : "Add Agricultural Service"}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Describe a service your agricultural
                business or professional practice provides.
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
              Please check the information and try
              again.
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

      <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              What You Offer
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Agricultural Services
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Showcase the professional, technical or
              operational agricultural services your
              business provides.
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
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

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
              🛠️
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No services added yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Add the agricultural services you provide
              so customers and other businesses can
              understand the full value you offer.
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
            {services.map(
              (service: AgriculturalService) => (
                <AgriculturalServiceCard
                  key={service.id}
                  service={service}
                  onEdit={openEditServiceForm}
                  onDelete={handleDeleteService}
                  isDeleting={isDeletingService}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* ==================================================
          BUSINESS SNAPSHOT
      ================================================== */}

      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-gray-900">
            Business Snapshot
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A quick look at your current AgricWise
            business activity.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <p className="text-sm font-medium text-green-700">
              Products
            </p>

            <p className="mt-2 text-3xl font-bold text-green-800">
              {productCount}
            </p>

            <p className="mt-1 text-xs text-green-700">
              {inStockProducts.length} in stock
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-sm font-medium text-emerald-700">
              Services
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-800">
              {services.length}
            </p>

            <p className="mt-1 text-xs text-emerald-700">
              {availableServices.length} available
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-6">
            <p className="text-sm font-medium text-yellow-700">
              Pending Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-800">
              {pendingOrders.length}
            </p>

            <p className="mt-1 text-xs text-yellow-700">
              Require attention
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-sm font-medium text-blue-700">
              Completed Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-800">
              {completedOrders.length}
            </p>

            <p className="mt-1 text-xs text-blue-700">
              Successfully completed
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          RECENT ORDERS
      ================================================== */}

      <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              Sales Activity
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Recent Customer Orders
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep track of recent purchases from
              your customers.
            </p>
          </div>

          <Link
            to="/farmer/orders"
            className="text-sm font-semibold text-green-700 hover:underline"
          >
            View All →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
            <div className="text-3xl">🛒</div>

            <p className="mt-3 font-medium text-gray-700">
              No customer orders yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when customers
              purchase your products.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders
              .slice(0, 5)
              .map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition hover:border-green-100 hover:bg-green-50/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Buyer: {order.buyer}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="font-bold text-green-700">
                      ₦
                      {Number(
                        order.total
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-sm capitalize text-gray-500">
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
          PRODUCTS
      ================================================== */}

      <section className="mb-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
              What You Sell
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Business Products
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the products, agricultural supplies
              and goods your business offers.
            </p>
          </div>

          <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            {productCount}{" "}
            {productCount === 1
              ? "Product"
              : "Products"}
          </span>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="text-sm text-green-700">
              Total Products
            </p>

            <p className="mt-2 text-2xl font-bold text-green-800">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm text-emerald-700">
              In Stock
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {inStockProducts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-600">
              Unavailable
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-800">
              {unavailableProducts.length}
            </p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            to="/farmer/products/create"
            className="rounded-2xl bg-gray-50 p-6 transition hover:bg-green-50"
          >
            <div className="text-2xl">➕</div>

            <h3 className="mt-3 text-lg font-semibold text-green-700">
              Add Product
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Add a new product to your business
              inventory.
            </p>
          </Link>

          <Link
            to="/farmer/profile"
            className="rounded-2xl bg-gray-50 p-6 transition hover:bg-green-50"
          >
            <div className="text-2xl">🏢</div>

            <h3 className="mt-3 text-lg font-semibold text-green-700">
              Business Profile
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Update your AgricWise business identity,
              categories and information.
            </p>
          </Link>
        </div>

        {isProductsLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="text-gray-500">
              Loading products...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
            <div className="text-4xl">📦</div>

            <p className="mt-4 font-medium text-gray-700">
              You haven't added any products yet.
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Add products, agricultural supplies or
              goods so customers can discover what your
              business offers.
            </p>

            <Link
              to="/farmer/products/create"
              className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
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
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>

            {productCount > products.length && (
              <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                <p className="text-sm text-yellow-700">
                  Showing the first{" "}
                  {products.length} of{" "}
                  {productCount} products.
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
          BUSINESS INSIGHTS
      ================================================== */}

      <section className="mb-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            Coming Soon
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Business Analytics
          </h2>

          <div className="mt-6 flex min-h-52 items-center justify-center rounded-2xl bg-gray-50">
            <div className="px-6 text-center">
              <div className="text-4xl">📊</div>

              <p className="mt-4 text-lg font-semibold text-gray-700">
                Analytics Coming Soon
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Sales trends, revenue insights, customer
                activity, service performance and product
                performance will appear here.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            At a Glance
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Business Insights
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Products listed
              </span>

              <span className="font-semibold text-gray-900">
                {products.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Products in stock
              </span>

              <span className="font-semibold text-gray-900">
                {inStockProducts.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Services listed
              </span>

              <span className="font-semibold text-gray-900">
                {services.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Available services
              </span>

              <span className="font-semibold text-gray-900">
                {availableServices.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Customer orders
              </span>

              <span className="font-semibold text-gray-900">
                {orders.length}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <span className="text-sm text-gray-600">
                Pending orders
              </span>

              <span className="font-semibold text-yellow-700">
                {pendingOrders.length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Business status
              </span>

              <span
                className={`font-semibold ${
                  profile.is_verified
                    ? "text-green-700"
                    : "text-orange-600"
                }`}
              >
                {profile.is_verified
                  ? "Verified"
                  : "Pending Verification"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          GROWTH OPPORTUNITIES
      ================================================== */}

      <section className="mb-10">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">
            AgricWise Ecosystem
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            Grow Your Agricultural Business
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            More tools and opportunities are being built
            into AgricWise to support businesses across
            the agricultural ecosystem.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "📊",
              title: "Business Analytics",
              description:
                "Understand sales, products, customers and business performance.",
            },
            {
              icon: "👨🏾‍🌾",
              title: "Expert Connections",
              description:
                "Connect with agricultural professionals and specialists.",
            },
            {
              icon: "💡",
              title: "Business Advisory",
              description:
                "Access practical knowledge and opportunities for business growth.",
            },
            {
              icon: "🌍",
              title: "Market Opportunities",
              description:
                "Discover new connections across the wider agricultural ecosystem.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-3xl">
                {item.icon}
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <span className="mt-4 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          BUSINESS TIP
      ================================================== */}

      <section className="mb-10 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
        <div className="max-w-3xl">
          <div className="text-3xl">💡</div>

          <h2 className="mt-4 text-2xl font-bold">
            Build a Stronger Digital Presence
          </h2>

          <p className="mt-3 leading-7 text-green-50">
            Keep your business information accurate,
            add clear product details and describe your
            services properly. A complete AgricWise
            presence helps customers and other agricultural
            businesses understand what you offer.
          </p>

          <Link
            to="/farmer/profile"
            className="mt-5 inline-block rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:shadow-lg"
          >
            Review Business Profile
          </Link>
        </div>
      </section>

      {/* ==================================================
          FINAL BUSINESS CTA
      ================================================== */}

      <section className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-4xl">🌱</div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            Build Your Agricultural Business on AgricWise
          </h2>

          <p className="mx-auto mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Your AgricWise business profile brings
            together your identity, products, services
            and future opportunities in one digital
            presence.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/farmer/profile"
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Manage Business Profile
            </Link>

            <Link
              to="/farmer/products/create"
              className="rounded-xl border border-green-200 bg-green-50 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-100"
            >
              Add Product
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FarmerDashboardPage;