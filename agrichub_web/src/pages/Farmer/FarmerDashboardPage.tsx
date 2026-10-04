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

  /* =========================================================
     BUSINESS DATA
  ========================================================= */

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

  /* =========================================================
     AGRICULTURAL SERVICES
  ========================================================= */

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

  /* =========================================================
     SERVICE UI STATE
  ========================================================= */

  const [showServiceForm, setShowServiceForm] =
    useState(false);

  const [editingService, setEditingService] =
    useState<AgriculturalService | null>(null);

  /* =========================================================
     DEFENSIVE DATA NORMALIZATION
  ========================================================= */

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

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const productCount =
    productsData?.count ?? products.length;

  const inStockProducts = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.is_available
  );

  const unavailableProducts = products.filter(
    (product) => !product.is_available
  );

  const availableServices = services.filter(
    (service) => service.is_available
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const profileCompletionItems = [
    Boolean(profile?.farm_name?.trim()),
    Boolean(profile?.farm_location?.trim()),
    businessCategories.length > 0,
    Boolean(profile?.farm_description?.trim()),
  ];

  const completedProfileItems =
    profileCompletionItems.filter(Boolean).length;

  const profileCompletion = Math.round(
    (completedProfileItems /
      profileCompletionItems.length) *
      100
  );

  /*
   * AuthUser does not contain a username.
   *
   * Use the authenticated user's first name first,
   * then last name, then the email prefix as a safe
   * fallback.
   */
  const firstName =
    user?.first_name?.trim() ||
    user?.last_name?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    "Business Owner";

  /* =========================================================
     AUTHENTICATION / PROFILE
  ========================================================= */

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
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <p className="text-sm font-medium text-gray-700">
            Loading your AgricWise Business Workspace...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Preparing your products, services and business activity.
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

  /* =========================================================
     PRODUCT ACTIONS
  ========================================================= */

  const handleDeleteProduct = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    deleteProduct(id);
  };

  /* =========================================================
     SERVICE ACTIONS
  ========================================================= */

  const resetServiceForm = () => {
    setEditingService(null);
    resetCreateService();
    resetUpdateService();
  };

  const openCreateServiceForm = () => {
    resetServiceForm();
    setShowServiceForm(true);

    window.setTimeout(() => {
      document
        .getElementById("service-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const openEditServiceForm = (
    service: AgriculturalService
  ) => {
    resetCreateService();
    resetUpdateService();

    setEditingService(service);
    setShowServiceForm(true);

    window.setTimeout(() => {
      document
        .getElementById("service-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
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
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">

        {/* =====================================================
            PAGE INTRO
        ===================================================== */}

        <section className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-600">
                AgricWise Business Workspace
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Manage your agricultural business, products,
                services and customer activity from one place.
              </p>
            </div>

            <Link
              to="/farmer/profile"
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-200 hover:text-green-700 sm:w-auto"
            >
              Edit Business Profile
            </Link>
          </div>
        </section>

        {/* =====================================================
            BUSINESS COMMAND CENTER HERO
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  Business Command Center
                </span>

                {profile.is_verified && (
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                    ✓ Verified Business
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                {profile.farm_name ||
                  "Grow your business on AgricWise."}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
                Showcase what you offer, connect with customers
                and build a stronger digital presence across the
                AgricWise agricultural ecosystem.
              </p>

              {businessCategories.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {businessCategories
                    .slice(0, 4)
                    .map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
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

            <div className="grid gap-3 sm:grid-cols-2 lg:w-48 lg:grid-cols-1">
              <Link
                to="/farmer/products/create"
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-green-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                + Add Product
              </Link>

              <button
                type="button"
                onClick={openCreateServiceForm}
                className="rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                + Add Service
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROFILE COMPLETION
        ===================================================== */}

        {profileCompletion < 100 && (
          <section className="mb-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-xl">
                  ✨
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-gray-900">
                      Complete your business profile
                    </h2>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                      {profileCompletion}% complete
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    A complete profile helps customers understand
                    who you are and what you offer.
                  </p>

                  <div className="mt-4 max-w-xl">
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

        {/* =====================================================
            BUSINESS OVERVIEW
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              At a glance
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Business Overview
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-xl">
                  📦
                </span>

                <span className="text-xs font-medium text-gray-400">
                  Products
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {productCount}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {inStockProducts.length} currently in stock
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  🛠️
                </span>

                <span className="text-xs font-medium text-gray-400">
                  Services
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {services.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {availableServices.length} currently available
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl">
                  🛒
                </span>

                <span className="text-xs font-medium text-gray-400">
                  Orders
                </span>
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {orders.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {pendingOrders.length} awaiting action
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                    profile.is_verified
                      ? "bg-green-50"
                      : "bg-yellow-50"
                  }`}
                >
                  {profile.is_verified ? "✓" : "⏳"}
                </span>

                <span className="text-xs font-medium text-gray-400">
                  Trust
                </span>
              </div>

              <p
                className={`mt-5 text-lg font-bold ${
                  profile.is_verified
                    ? "text-green-700"
                    : "text-orange-600"
                }`}
              >
                {profile.is_verified
                  ? "Verified"
                  : "Pending"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Business verification status
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            VERIFICATION
        ===================================================== */}

        {!profile.is_verified && (
          <section className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">
                  ⏳ Verification Pending
                </span>

                <h2 className="mt-3 text-lg font-bold text-yellow-900">
                  Your business is awaiting verification
                </h2>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-yellow-700">
                  You can continue adding products and services
                  while your business profile is awaiting review.
                </p>
              </div>

              <Link
                to="/farmer/profile"
                className="shrink-0 rounded-xl bg-yellow-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-yellow-700"
              >
                Review Profile
              </Link>
            </div>
          </section>
        )}

        {profile.is_verified && (
          <section className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl text-green-700">
                ✓
              </div>

              <div>
                <h2 className="font-bold text-green-900">
                  Your business is verified
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  Keep your business information, products and
                  services accurate and up to date.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Manage
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Jump directly to the part of your business you want
              to manage.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/farmer/products/create"
              className="group rounded-2xl bg-green-600 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-2xl">
                📦
              </div>

              <h3 className="mt-4 font-bold">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-green-100">
                List products, supplies or agricultural goods.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-white">
                Get started →
              </span>
            </Link>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                🛠️
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Add Service
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Showcase professional or technical services.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-green-700">
                Add service →
              </span>
            </button>

            <Link
              to="/farmer/orders"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                🛒
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Manage Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage customer purchases.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-green-700">
                View orders →
              </span>
            </Link>

            <Link
              to="/notifications"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                🔔
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Stay informed about activity affecting your business.
              </p>

              <span className="mt-4 inline-block text-xs font-bold text-green-700">
                View notifications →
              </span>
            </Link>
          </div>
        </section>

        {/* =====================================================
            SERVICE FORM
        ===================================================== */}

        {showServiceForm && (
          <section
            id="service-form"
            className="mb-8 scroll-mt-6 rounded-3xl border border-green-100 bg-white p-5 shadow-lg sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                  Business Services
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                  {editingService
                    ? "Edit Agricultural Service"
                    : "Add Agricultural Service"}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Describe a service your agricultural business
                  or professional practice provides.
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

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section
          id="services"
          className="mb-8 scroll-mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                What You Offer
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Agricultural Services
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Showcase the professional, technical or operational
                services your business provides.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              + Add Service
            </button>
          </div>

          {isServicesLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

              <p className="text-sm text-gray-500">
                Loading your services...
              </p>
            </div>
          ) : isServicesError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="text-3xl">⚠️</div>

              <p className="mt-3 font-medium text-red-700">
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
                Add the agricultural services you provide so
                customers and other businesses can understand
                the full value you offer.
              </p>

              <button
                type="button"
                onClick={openCreateServiceForm}
                className="mt-5 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
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

        {/* =====================================================
            ORDERS
        ===================================================== */}

        <section
          id="orders"
          className="mb-8 scroll-mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Sales Activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Recent Customer Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Keep track of recent purchases from your customers.
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

              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Orders will appear here when customers purchase
                your products.
              </p>

              {productCount === 0 && (
                <Link
                  to="/farmer/products/create"
                  className="mt-5 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Add Your First Product
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-4 transition hover:border-green-100 hover:bg-green-50/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
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

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section
          id="products"
          className="mb-8 scroll-mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                What You Sell
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Business Products
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Manage the products, agricultural supplies and goods
                your business offers.
              </p>
            </div>

            <Link
              to="/farmer/products/create"
              className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              + Add Product
            </Link>
          </div>

          <div className="mb-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
              <p className="text-sm text-green-700">
                Total Products
              </p>

              <p className="mt-2 text-2xl font-bold text-green-800">
                {productCount}
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

          {isProductsLoading ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

              <p className="text-sm text-gray-500">
                Loading products...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-3xl">
                📦
              </div>

              <p className="mt-4 font-medium text-gray-700">
                You haven't added any products yet.
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add products, agricultural supplies or goods so
                customers can discover what your business offers.
              </p>

              <Link
                to="/farmer/products/create"
                className="mt-6 inline-flex rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
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
                  <p className="text-sm font-medium text-yellow-700">
                    Showing the first {products.length} of{" "}
                    {productCount} products.
                  </p>

                  <p className="mt-1 text-xs text-yellow-600">
                    Product pagination will be added to the
                    business management experience later.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* =====================================================
            BUSINESS SNAPSHOT
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Business Snapshot
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Your Business at a Glance
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Products listed
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {productCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Services listed
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {services.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Pending orders
              </p>

              <p className="mt-2 text-2xl font-bold text-yellow-700">
                {pendingOrders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Completed orders
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {completedOrders.length}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            AGRICWISE ECOSYSTEM
        ===================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-gray-950 p-6 text-white sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
              AgricWise Ecosystem
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              More opportunities are coming.
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
              AgricWise is being built to connect agricultural
              businesses and professionals with more opportunities
              across the value chain.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "📊",
                title: "Business Analytics",
              },
              {
                icon: "👨🏾‍🌾",
                title: "Expert Connections",
              },
              {
                icon: "💡",
                title: "Business Advisory",
              },
              {
                icon: "🌍",
                title: "Market Opportunities",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-2xl">
                  {item.icon}
                </div>

                <h3 className="mt-3 text-sm font-semibold">
                  {item.title}
                </h3>

                <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-gray-300">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            BUSINESS TIP
        ===================================================== */}

        <section className="mb-8 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
          <div className="max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
              💡
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Build a stronger digital presence
            </h2>

            <p className="mt-3 text-sm leading-7 text-green-50 sm:text-base">
              Keep your business information accurate, add clear
              product details and describe your services properly.
              A complete AgricWise presence makes it easier for
              customers and other agricultural businesses to
              understand what you offer.
            </p>

            <Link
              to="/farmer/profile"
              className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Review Business Profile
            </Link>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-3xl">
              🌱
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Keep growing your business on AgricWise
            </h2>

            <p className="mx-auto mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              Your AgricWise business profile brings together your
              identity, products, services and future opportunities
              in one digital presence.
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
      </div>
    </main>
  );
};

export default FarmerDashboardPage;