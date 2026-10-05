import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Package,
  Search,
  Store,
  Users,
  Wrench,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  usePublicAgriculturalBusiness,
} from "../../hooks/useAgriculturalServices";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

/*
=========================================================
PUBLIC AGRICULTURAL BUSINESS PROFILE
=========================================================

Public-facing AgricWise business presence.

Backend remains the source of truth for:

- Business identity
- Location
- Categories
- Verification
- Products
- Agricultural services

No private account information is exposed.

This page represents the public digital presence of an
agricultural business on AgricWise.
=========================================================
*/

const AgriculturalBusinessDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const businessId = Number(id);

  const {
    data: business,
    isLoading,
    isError,
    refetch,
  } = usePublicAgriculturalBusiness(businessId);

  /*
  =======================================================
  HELPERS
  =======================================================
  */

  const formatPrice = (
    price: string | number | null | undefined
  ) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return null;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return String(price);
    }

    return `₦${numericPrice.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const scrollToSection = (sectionId: string) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /*
  =======================================================
  INVALID BUSINESS ID
  =======================================================
  */

  if (
    !id ||
    !Number.isFinite(businessId) ||
    businessId <= 0
  ) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-10">
          <Card className="w-full p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Store className="h-7 w-7 text-gray-400" />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-gray-900">
              Business not found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              The business address you requested is not
              valid or is no longer available.
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => navigate("/businesses")}
              >
                Browse Businesses
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /*
  =======================================================
  LOADING
  =======================================================
  */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner />

            <div>
              <p className="font-medium text-gray-900">
                Loading business profile
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Preparing this AgricWise business presence...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
  =======================================================
  ERROR / NOT FOUND
  =======================================================
  */

  if (isError || !business) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-10">
          <Card className="w-full p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Store className="h-7 w-7 text-gray-400" />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-gray-900">
              Business unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We couldn't load this agricultural business.
              It may no longer be available or there may be
              a temporary connection problem.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => refetch()}
              >
                Try Again
              </Button>

              <Button
                type="button"
                onClick={() => navigate("/businesses")}
              >
                Browse Businesses
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  /*
  =======================================================
  DERIVED VALUES
  =======================================================
  */

  const hasProducts = business.products.length > 0;
  const hasServices = business.services.length > 0;

  /*
  =======================================================
  PAGE
  =======================================================
  */

  return (
    <main className="min-h-screen bg-gray-50">
      {/* =================================================
          BACK NAVIGATION
      ================================================= */}

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/businesses")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Businesses</span>
          </button>

          <Link
            to="/products"
            className="hidden items-center gap-1.5 text-sm font-medium text-green-700 transition hover:text-green-800 sm:inline-flex"
          >
            Explore Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* =================================================
          BUSINESS HERO
      ================================================= */}

      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-green-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* BUSINESS IDENTITY */}

            <div className="flex min-w-0 gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur sm:h-20 sm:w-20">
                <Store className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                    {business.farm_name}
                  </h1>

                  {business.is_verified && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-start gap-2 text-sm text-green-100">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{business.farm_location}</span>
                </div>

                {business.business_categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {business.business_categories.map(
                      (category) => (
                        <span
                          key={category.id}
                          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10"
                        >
                          {category.name}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* BUSINESS COUNTS */}

            <div className="grid grid-cols-2 gap-3 sm:flex lg:shrink-0">
              <div className="min-w-[120px] rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur">
                <div className="flex items-center gap-2 text-green-100">
                  <Package className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Products
                  </span>
                </div>

                <p className="mt-1 text-xl font-bold">
                  {business.product_count}
                </p>
              </div>

              <div className="min-w-[120px] rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/10 backdrop-blur">
                <div className="flex items-center gap-2 text-green-100">
                  <Wrench className="h-4 w-4" />

                  <span className="text-xs font-medium">
                    Services
                  </span>
                </div>

                <p className="mt-1 text-xl font-bold">
                  {business.service_count}
                </p>
              </div>
            </div>
          </div>

          {/* HERO ACTIONS */}

          {(hasProducts || hasServices) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {hasProducts && (
                <button
                  type="button"
                  onClick={() => scrollToSection("products")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-900 shadow-sm transition hover:bg-green-50"
                >
                  <Package className="h-4 w-4" />
                  Explore Products
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}

              {hasServices && (
                <button
                  type="button"
                  onClick={() => scrollToSection("services")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Wrench className="h-4 w-4" />
                  Explore Services
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          BUSINESS CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <div className="min-w-0 space-y-8">
            {/* BUSINESS DESCRIPTION */}

            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Store className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    About this business
                  </h2>

                  <p className="text-xs text-gray-500">
                    AgricWise business profile
                  </p>
                </div>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                {business.farm_description ||
                  "This agricultural business has not added a public description yet."}
              </p>
            </Card>

            {/* =================================================
                PRODUCTS
            ================================================= */}

            <section
              id="products"
              className="scroll-mt-24"
            >
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-700" />

                    <h2 className="text-xl font-semibold text-gray-900">
                      Products
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Products currently available from this
                    business.
                  </p>
                </div>

                {hasProducts && (
                  <span className="hidden shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:inline-flex">
                    {business.products.length}{" "}
                    {business.products.length === 1
                      ? "product"
                      : "products"}
                  </span>
                )}
              </div>

              {!hasProducts ? (
                <Card className="p-6 text-center">
                  <Package className="mx-auto h-9 w-9 text-gray-300" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No products are currently listed.
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This business may add products in the
                    future.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.products.map((product) => {
                    const formattedPrice = formatPrice(
                      product.price
                    );

                    return (
                      <Card
                        key={product.id}
                        className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Link
                          to={`/products/${product.id}`}
                          className="group block"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package className="h-10 w-10 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <Link
                              to={`/products/${product.id}`}
                              className="min-w-0"
                            >
                              <h3 className="line-clamp-2 font-semibold text-gray-900 transition hover:text-green-700">
                                {product.name}
                              </h3>
                            </Link>

                            {product.category_name && (
                              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                                {product.category_name}
                              </span>
                            )}
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
                            {product.description}
                          </p>

                          <div className="mt-4 flex items-end justify-between gap-3">
                            <div className="min-w-0">
                              {formattedPrice && (
                                <p className="text-lg font-bold text-gray-900">
                                  {formattedPrice}
                                </p>
                              )}

                              <p className="mt-0.5 text-xs text-gray-500">
                                {product.quantity}{" "}
                                {product.unit}
                                {product.quantity !== 1
                                  ? "s"
                                  : ""}
                              </p>
                            </div>

                            <Link
                              to={`/products/${product.id}`}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                            >
                              View
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =================================================
                SERVICES
            ================================================= */}

            <section
              id="services"
              className="scroll-mt-24"
            >
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <Wrench className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Agricultural services
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Services currently offered by this
                      business.
                    </p>
                  </div>

                  {hasServices && (
                    <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:inline-flex">
                      {business.services.length}
                    </span>
                  )}
                </div>
              </div>

              {!hasServices ? (
                <Card className="p-6 text-center">
                  <Wrench className="mx-auto h-9 w-9 text-gray-300" />

                  <p className="mt-3 text-sm font-medium text-gray-700">
                    No services are currently listed.
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    This business may add agricultural
                    services in the future.
                  </p>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {business.services.map((service) => {
                    const formattedPrice = formatPrice(
                      service.price
                    );

                    return (
                      <Card
                        key={service.id}
                        className="overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {service.image ? (
                          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                            <img
                              src={service.image}
                              alt={service.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-300 hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-gray-50">
                            <Wrench className="h-10 w-10 text-gray-300" />
                          </div>
                        )}

                        <div className="p-5">
                          <h3 className="font-semibold text-gray-900">
                            {service.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {service.description}
                          </p>

                          {service.location && (
                            <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

                              <span>
                                {service.location}
                              </span>
                            </div>
                          )}

                          {formattedPrice && (
                            <div className="mt-4 border-t border-gray-100 pt-4">
                              <p className="text-lg font-bold text-gray-900">
                                {formattedPrice}
                              </p>

                              {service.price_unit && (
                                <p className="mt-0.5 text-xs text-gray-500">
                                  {service.price_unit}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Store className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Explore this business
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover products and agricultural services
                offered through AgricWise.
              </p>

              <div className="mt-5 space-y-3">
                {hasProducts && (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() =>
                      scrollToSection("products")
                    }
                  >
                    Explore Products
                  </Button>
                )}

                {hasServices && (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() =>
                      scrollToSection("services")
                    }
                  >
                    Explore Services
                  </Button>
                )}

                <Link
                  to="/products"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                  <Search className="h-4 w-4" />
                  Explore Marketplace
                </Link>

                <Link
                  to="/register"
                  className="block"
                >
                  <Button
                    type="button"
                    className="w-full"
                  >
                    Join AgricWise
                  </Button>
                </Link>
              </div>
            </Card>

            {/* BUSINESS SUMMARY */}

            <Card className="mt-4 p-5 sm:p-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Business presence
              </h3>

              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">
                      Location
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {business.farm_location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <Package className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Listed products
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {business.product_count}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <Wrench className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Listed services
                    </p>

                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {business.service_count}
                    </p>
                  </div>
                </div>

                {business.is_verified && (
                  <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        AgricWise status
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-blue-700">
                        Verified business
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* ECOSYSTEM CARD */}

            <Card className="mt-4 overflow-hidden">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                  <Users className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  More agriculture, one ecosystem
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Discover agricultural businesses,
                  products, services and opportunities
                  across AgricWise.
                </p>

                <Link
                  to="/businesses"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 transition hover:text-green-800"
                >
                  Discover more businesses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          </aside>
        </div>
      </section>

      {/* =================================================
          MOBILE ECOSYSTEM CTA
      ================================================= */}

      <section className="border-t border-gray-200 bg-white lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl bg-gradient-to-br from-green-900 to-emerald-800 p-6 text-white shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Store className="h-5 w-5" />
            </div>

            <h2 className="mt-4 text-xl font-bold">
              Build your presence on AgricWise
            </h2>

            <p className="mt-2 text-sm leading-6 text-green-100">
              Showcase your agricultural business,
              products and services to people looking
              for opportunities across the ecosystem.
            </p>

            <Link
              to="/register"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-900 transition hover:bg-green-50"
            >
              Create your AgricWise presence
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AgriculturalBusinessDetailsPage;