import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Eye,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";

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
     CORE BUSINESS DATA
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
     DERIVED BUSINESS DATA
  ========================================================= */

  const productCount =
    productsData?.count ?? products.length;

  const inStockProducts = products.filter(
    (product) =>
      product.quantity > 0 &&
      product.is_available
  );

  const unavailableProducts = products.filter(
    (product) =>
      !product.is_available ||
      product.quantity <= 0
  );

  const availableServices = services.filter(
    (service) => service.is_available
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  );

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

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

  /* =========================================================
     USER DISPLAY NAME
  ========================================================= */

  const firstName =
    user?.first_name?.trim() ||
    user?.last_name?.trim() ||
    user?.email?.split("@")[0]?.trim() ||
    "Business Owner";

  /* =========================================================
     AUTHENTICATION / PROFILE GUARDS
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

          <p className="text-sm font-semibold text-gray-700">
            Loading your AgricWise Business Workspace...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Preparing your business activity.
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

  const scrollToServiceForm = () => {
    window.setTimeout(() => {
      document
        .getElementById("service-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const openCreateServiceForm = () => {
    resetServiceForm();
    setShowServiceForm(true);
    scrollToServiceForm();
  };

  const openEditServiceForm = (
    service: AgriculturalService
  ) => {
    resetCreateService();
    resetUpdateService();

    setEditingService(service);
    setShowServiceForm(true);

    scrollToServiceForm();
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
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <section className="mb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-green-700">
                  <Store className="h-3.5 w-3.5" />
                  My AgricWise Business
                </span>

                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage your business presence, products,
                services and customer activity from one
                AgricWise workspace.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to={`/businesses/${profile.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-200 hover:text-green-700"
              >
                <Eye className="h-4 w-4" />
                View Public Profile
              </Link>

              <Link
                to="/farmer/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                <UserRound className="h-4 w-4" />
                Manage Profile
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS COMMAND CENTER
        ===================================================== */}

        <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 p-6 text-white shadow-lg sm:p-8">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10">
                  Business Command Center
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/10">
                  {profileCompletion}% profile complete
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                {profile.farm_name ||
                  "Build your AgricWise presence."}
              </h2>

              <div className="mt-3 flex items-start gap-2 text-sm text-green-100">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{profile.farm_location}</span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
                Your AgricWise business presence brings your
                identity, products, services and agricultural
                opportunities together in one place.
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

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                to="/farmer/products/create"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-green-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>

              <button
                type="button"
                onClick={openCreateServiceForm}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Add Service
              </button>

              <Link
                to="/products"
                className="hidden items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-green-50 transition hover:bg-white/10 sm:inline-flex"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <CircleAlert className="h-5 w-5" />
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
                    Complete your identity, location,
                    categories and description so your public
                    business presence is more useful.
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
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Complete Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* =====================================================
            KEY BUSINESS METRICS
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Business overview
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              At a Glance
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {/* PRODUCTS */}

            <Link
              to="#products"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Package className="h-5 w-5" />
                </span>

                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {productCount}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {inStockProducts.length} currently available
              </p>
            </Link>

            {/* SERVICES */}

            <Link
              to="#services"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Wrench className="h-5 w-5" />
                </span>

                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {services.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {availableServices.length} currently available
              </p>
            </Link>

            {/* ORDERS */}

            <Link
              to="/farmer/orders"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                  <ShoppingCart className="h-5 w-5" />
                </span>

                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">
                {orders.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {pendingOrders.length} awaiting action
              </p>
            </Link>

            {/* TRUST */}

            <Link
              to="/farmer/profile"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    profile.is_verified
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {profile.is_verified ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <CircleAlert className="h-5 w-5" />
                  )}
                </span>

                <ChevronRight className="h-4 w-4 text-gray-300" />
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
            </Link>
          </div>
        </section>

        {/* =====================================================
            VERIFICATION STATUS
        ===================================================== */}

        {!profile.is_verified && (
          <section className="mb-8 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                  <CircleAlert className="h-5 w-5" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-yellow-700">
                    Verification Pending
                  </span>

                  <h2 className="mt-1 text-lg font-bold text-yellow-900">
                    Your business is awaiting verification
                  </h2>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-yellow-700">
                    You can continue building your AgricWise
                    presence while your business profile is
                    awaiting review.
                  </p>
                </div>
              </div>

              <Link
                to="/farmer/profile"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-700"
              >
                Review Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
              Manage your business
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/farmer/products/create"
              className="group rounded-2xl bg-green-600 p-5 text-white shadow-sm transition hover:-translate-y-1 hover:bg-green-700 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Package className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-bold">
                Add Product
              </h3>

              <p className="mt-1 text-sm text-green-100">
                List products, supplies or agricultural goods.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold">
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Wrench className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Add Service
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Showcase professional, technical or
                operational services.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-green-700">
                Add service
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>

            <Link
              to="/farmer/orders"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <ShoppingCart className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Manage Orders
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review customer purchases and business activity.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-green-700">
                View orders
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              to="/notifications"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Bell className="h-5 w-5" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Notifications
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Stay informed about activity affecting your
                business.
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-green-700">
                View notifications
                <ArrowRight className="h-3.5 w-3.5" />
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
                ×
              </button>
            </div>

            {(isCreateServiceError ||
              isUpdateServiceError) && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                We could not save this service. Please check
                the information and try again.
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
                What you offer
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Agricultural Services
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Showcase professional, technical and
                operational services your business provides.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateServiceForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Service
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
              <CircleAlert className="mx-auto h-8 w-8 text-red-500" />

              <p className="mt-3 font-medium text-red-700">
                Unable to load your services.
              </p>

              <p className="mt-2 text-sm text-red-600">
                Please refresh the page and try again.
              </p>
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Wrench className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No services added yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                Add the services you provide so customers
                and agricultural businesses can understand
                the full value you offer.
              </p>

              <button
                type="button"
                onClick={openCreateServiceForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
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
            RECENT ORDERS
        ===================================================== */}

        <section
          id="orders"
          className="mb-8 scroll-mt-6 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Sales activity
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Recent Customer Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Monitor recent purchases from your customers.
              </p>
            </div>

            <Link
              to="/farmer/orders"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-2xl bg-gray-50 px-6 py-10 text-center">
              <ShoppingCart className="mx-auto h-9 w-9 text-gray-300" />

              <p className="mt-3 font-medium text-gray-700">
                No customer orders yet
              </p>

              <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                Orders will appear here when customers
                purchase your products.
              </p>

              {productCount === 0 && (
                <Link
                  to="/farmer/products/create"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
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
                      ).toLocaleString("en-NG")}
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
                What you sell
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Business Products
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
                Manage the products, agricultural supplies and
                goods your business offers.
              </p>
            </div>

            <Link
              to="/farmer/products/create"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
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
                Available
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
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                <Package className="h-7 w-7" />
              </div>

              <p className="mt-4 font-medium text-gray-700">
                You haven't added any products yet.
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add products, agricultural supplies or goods
                so customers can discover what your business
                offers.
              </p>

              <Link
                to="/farmer/products/create"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
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
                    Additional product pagination can be
                    introduced as the business management
                    experience grows.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* =====================================================
            PUBLIC BUSINESS PRESENCE
        ===================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Eye className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-green-600">
                Your public AgricWise presence
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                This is how people discover your business.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                Your public business profile connects your
                business identity with the products and
                services you offer across AgricWise.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <Store className="h-5 w-5 text-green-700" />

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    Business identity
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Name, location, categories and description.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Package className="h-5 w-5 text-green-700" />

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    Products
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Products and agricultural goods you offer.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <Wrench className="h-5 w-5 text-green-700" />

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    Services
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Professional and technical capabilities.
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />

                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    Trust
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Verification and accurate business
                    information.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/businesses/${profile.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  <Eye className="h-4 w-4" />
                  View Public Profile
                </Link>

                <Link
                  to="/farmer/profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:text-green-700"
                >
                  Edit Business Profile
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-emerald-800 p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-200">
                Presence status
              </p>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <span className="text-sm text-green-100">
                    Profile completion
                  </span>

                  <span className="text-3xl font-bold">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{
                      width: `${profileCompletion}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-green-100">
                    Categories
                  </span>

                  <span className="font-semibold">
                    {businessCategories.length}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-green-100">
                    Products
                  </span>

                  <span className="font-semibold">
                    {productCount}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-green-100">
                    Services
                  </span>

                  <span className="font-semibold">
                    {services.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-100">
                    Verification
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    {profile.is_verified && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {profile.is_verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AGRICWISE BUSINESS ECOSYSTEM
        ===================================================== */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-gray-950 p-6 text-white sm:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
              AgricWise Ecosystem
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Your business is part of something bigger.
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
              AgricWise is being structured to connect
              agricultural businesses, farmers, buyers,
              professionals and opportunities across the
              value chain.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Store className="h-5 w-5 text-green-400" />

              <h3 className="mt-3 text-sm font-semibold">
                Business Discovery
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Make your business discoverable through your
                public AgricWise presence.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <ShoppingCart className="h-5 w-5 text-green-400" />

              <h3 className="mt-3 text-sm font-semibold">
                Marketplace
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Put your agricultural products where buyers
                can discover them.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Wrench className="h-5 w-5 text-green-400" />

              <h3 className="mt-3 text-sm font-semibold">
                Services
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Showcase capabilities beyond physical
                products.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <UserRound className="h-5 w-5 text-green-400" />

              <h3 className="mt-3 text-sm font-semibold">
                Community
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Participate in a growing agricultural
                ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            BUSINESS TIP
        ===================================================== */}

        <section className="mb-8 rounded-3xl bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-white shadow-lg sm:p-8">
          <div className="max-w-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Store className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              Keep your AgricWise presence accurate
            </h2>

            <p className="mt-3 text-sm leading-7 text-green-50 sm:text-base">
              Clear business information, accurate products
              and well-described services make it easier for
              people across the agricultural value chain to
              understand what you offer.
            </p>

            <Link
              to="/farmer/profile"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-700 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Review Business Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto max-w-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <Store className="h-6 w-6" />
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Keep building your AgricWise business
            </h2>

            <p className="mx-auto mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              Your AgricWise workspace brings your business
              identity, products, services and customer
              activity together in one digital presence.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={`/businesses/${profile.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <Eye className="h-4 w-4" />
                View Public Profile
              </Link>

              <Link
                to="/farmer/products/create"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-100"
              >
                <Plus className="h-4 w-4" />
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