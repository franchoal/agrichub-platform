import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronDown,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Store,
  Users,
  Wrench,
} from "lucide-react";

import {
  usePublicAgriculturalBusinesses,
} from "../../hooks/useAgriculturalServices";

import {
  farmerService,
} from "../../services/farmerService";

import type {
  AgriculturalCategory,
  PublicAgriculturalBusiness,
} from "../../services/farmerService";

import {
  useQuery,
} from "@tanstack/react-query";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";


/*
=========================================================
AGRICWISE AGRICULTURAL BUSINESS DIRECTORY
=========================================================

Public discovery layer for:

- Farmers
- Agricultural businesses
- Suppliers
- Service providers
- Agribusiness professionals
- Other agricultural value-chain participants

Discovery is handled by the backend.

Supported parameters:

?search=<term>
?category=<category-slug>
?verified=true
?verified=false
?page=<page>

No agricultural businesses or categories are hardcoded.
=========================================================
*/

const PAGE_SIZE = 12;


const AgriculturalBusinessesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
  =======================================================
  DISCOVERY STATE
  =======================================================
  */

  const searchFromUrl = searchParams.get("search") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "";
  const verifiedFromUrl = searchParams.get("verified") ?? "";
  const pageFromUrl = Number(searchParams.get("page") ?? "1");

  const currentPage =
    Number.isFinite(pageFromUrl) && pageFromUrl > 0
      ? pageFromUrl
      : 1;

  const [searchInput, setSearchInput] =
    useState(searchFromUrl);


  /*
  =======================================================
  CATEGORY DATA
  =======================================================
  */

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
  } = useQuery<AgriculturalCategory[]>({
    queryKey: ["agricultural-categories"],
    queryFn: farmerService.getCategories,
    staleTime: 1000 * 60 * 30,
  });


  /*
  =======================================================
  PUBLIC BUSINESS DISCOVERY
  =======================================================
  */

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = usePublicAgriculturalBusinesses({
    search: searchFromUrl,
    category: categoryFromUrl,
    verified:
      verifiedFromUrl === "true" ||
      verifiedFromUrl === "false"
        ? verifiedFromUrl
        : undefined,
    page: currentPage,
  });


  const businesses =
    data?.results ?? [];


  /*
  =======================================================
  SYNCHRONIZE SEARCH INPUT WITH URL
  =======================================================
  */

  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);


  /*
  =======================================================
  DISCOVERY HELPERS
  =======================================================
  */

  const updateDiscoveryParams = (
    updates: Record<string, string | null>
  ) => {
    const nextParams = new URLSearchParams(
      searchParams
    );

    Object.entries(updates).forEach(
      ([key, value]) => {
        if (value === null || value.trim() === "") {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      }
    );

    /*
    Any change to search/filter criteria starts from
    the first page.
    */

    if (
      "search" in updates ||
      "category" in updates ||
      "verified" in updates
    ) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };


  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    updateDiscoveryParams({
      search: searchInput.trim() || null,
    });
  };


  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateDiscoveryParams({
      category: event.target.value || null,
    });
  };


  const handleVerifiedChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateDiscoveryParams({
      verified: event.target.value || null,
    });
  };


  const clearDiscovery = () => {
    setSearchInput("");
    setSearchParams({});
  };


  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(
      searchParams
    );

    if (page <= 1) {
      nextParams.delete("page");
    } else {
      nextParams.set("page", String(page));
    }

    setSearchParams(nextParams);

    window.requestAnimationFrame(() => {
      document
        .getElementById("business-directory")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };


  /*
  =======================================================
  PAGINATION
  =======================================================
  */

  const totalBusinesses = data?.count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(totalBusinesses / PAGE_SIZE)
  );

  const hasPreviousPage =
    Boolean(data?.previous);

  const hasNextPage =
    Boolean(data?.next);


  /*
  =======================================================
  DIRECTORY PAGE STATISTICS
  =======================================================

  Product/service totals are intentionally described as
  "on this page" because the backend count represents
  the total matching businesses, while product/service
  counts are attached to each returned business.
  =======================================================
  */

  const pageStats = useMemo(() => {
    const verified = businesses.filter(
      (business: PublicAgriculturalBusiness) =>
        business.is_verified
    ).length;

    const products = businesses.reduce(
      (total, business) =>
        total + business.product_count,
      0
    );

    const services = businesses.reduce(
      (total, business) =>
        total + business.service_count,
      0
    );

    return {
      verified,
      products,
      services,
    };
  }, [businesses]);


  const hasActiveFilters =
    Boolean(searchFromUrl) ||
    Boolean(categoryFromUrl) ||
    Boolean(verifiedFromUrl);


  const selectedCategory = categories.find(
    (category) =>
      category.slug === categoryFromUrl
  );


  /*
  =======================================================
  LOADING STATE
  =======================================================
  */

  if (isLoading && !data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner />

            <div>
              <p className="font-medium text-gray-900">
                Discovering agricultural businesses
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Loading the AgricWise business directory...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }


  /*
  =======================================================
  ERROR STATE
  =======================================================
  */

  if (isError && !data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <Card className="w-full p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Store className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-semibold text-gray-900">
              We couldn't load the business directory
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              There was a problem connecting to AgricWise.
              Please try again.
            </p>

            <div className="mt-6">
              <Button
                type="button"
                onClick={() => refetch()}
              >
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }


  /*
  =======================================================
  PAGE
  =======================================================
  */

  return (
    <main className="min-h-screen bg-gray-50">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-gray-950 to-gray-950" />

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3.5 py-2 text-xs font-bold text-green-300 sm:text-sm">
              <Building2 className="h-4 w-4" />

              AgricWise Business Directory
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover the people and businesses powering agriculture.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg sm:leading-8">
              Find farmers, suppliers, agricultural service
              providers, professionals and other value-chain
              participants. Explore what they do, what they
              offer and how you can connect.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#business-directory"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-400"
              >
                Discover Businesses

                <ArrowRight size={17} />
              </a>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                Explore Marketplace

                <Package size={17} />
              </Link>
            </div>

          </div>


          {/* =============================================
              SEARCH
          ============================================= */}

          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-3xl"
          >
            <div className="rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-md">

              <div className="relative">

                <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <Input
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(event.target.value)
                  }
                  placeholder="Search businesses, locations or agricultural categories..."
                  className="h-12 border-0 bg-white pl-11 pr-4 shadow-none focus:ring-0"
                />

              </div>

            </div>

            <div className="mt-3 flex flex-col gap-2 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Search by business name, location, description
                or agricultural category.
              </span>

              <span className="text-gray-500">
                Press Enter to search
              </span>
            </div>
          </form>

        </div>
      </section>


      {/* =================================================
          DISCOVERY FILTERS
      ================================================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">

            {/* CATEGORY */}

            <div className="relative">
              <label
                htmlFor="business-category"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
              >
                Agricultural category
              </label>

              <div className="relative">
                <select
                  id="business-category"
                  value={categoryFromUrl}
                  onChange={handleCategoryChange}
                  disabled={isCategoriesLoading}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                >
                  <option value="">
                    All categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.slug}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>


            {/* VERIFICATION */}

            <div className="relative">
              <label
                htmlFor="business-verification"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500"
              >
                Verification
              </label>

              <div className="relative">
                <select
                  id="business-verification"
                  value={verifiedFromUrl}
                  onChange={handleVerifiedChange}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                >
                  <option value="">
                    All businesses
                  </option>

                  <option value="true">
                    Verified only
                  </option>

                  <option value="false">
                    Not verified
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>


            {/* CATEGORY DESCRIPTION */}

            <div className="flex min-h-[68px] items-end">
              {selectedCategory ? (
                <div className="w-full rounded-xl bg-green-50 px-3 py-2.5">
                  <p className="text-xs font-bold text-green-800">
                    {selectedCategory.name}
                  </p>

                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-green-700/80">
                    {selectedCategory.description}
                  </p>
                </div>
              ) : (
                <div className="hidden w-full rounded-xl bg-gray-50 px-3 py-2.5 lg:block">
                  <p className="text-xs font-medium leading-5 text-gray-500">
                    Browse the agricultural value chain by
                    category or verification status.
                  </p>
                </div>
              )}
            </div>


            {/* CLEAR */}

            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearDiscovery}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-bold text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:w-auto"
                >
                  Clear filters
                </button>
              </div>
            )}

          </div>

        </div>
      </section>


      {/* =================================================
          DIRECTORY STATS
      ================================================= */}

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 divide-x divide-gray-200 sm:grid-cols-4">

            <div className="px-3 py-2 first:pl-0 sm:px-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Store className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Businesses
                </span>
              </div>

              <p className="mt-1 text-2xl font-black text-gray-900">
                {totalBusinesses}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Matching directory
              </p>
            </div>


            <div className="px-3 py-2 sm:px-6">
              <div className="flex items-center gap-2 text-gray-500">
                <ShieldCheck className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Verified
                </span>
              </div>

              <p className="mt-1 text-2xl font-black text-gray-900">
                {pageStats.verified}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                On this page
              </p>
            </div>


            <div className="border-t border-gray-200 px-3 py-2 sm:border-t-0 sm:px-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Package className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Products
                </span>
              </div>

              <p className="mt-1 text-2xl font-black text-gray-900">
                {pageStats.products}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                From this page
              </p>
            </div>


            <div className="border-t border-gray-200 px-3 py-2 sm:border-t-0 sm:px-6">
              <div className="flex items-center gap-2 text-gray-500">
                <Wrench className="h-4 w-4" />

                <span className="text-xs font-bold uppercase tracking-wide">
                  Services
                </span>
              </div>

              <p className="mt-1 text-2xl font-black text-gray-900">
                {pageStats.services}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                From this page
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =================================================
          DIRECTORY
      ================================================= */}

      <section
        id="business-directory"
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">

          {/* =============================================
              RESULTS HEADER
          ============================================= */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Explore the ecosystem
              </p>

              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Agricultural Businesses
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {totalBusinesses === 0
                  ? "No matching businesses"
                  : `${totalBusinesses} ${
                      totalBusinesses === 1
                        ? "business"
                        : "businesses"
                    } found`}
              </p>

              {isFetching && (
                <p className="mt-1 text-xs font-medium text-green-600">
                  Updating results...
                </p>
              )}

            </div>


            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearDiscovery}
                className="self-start rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
              >
                Clear filters
              </button>
            )}

          </div>


          {/* =============================================
              EMPTY STATE
          ============================================= */}

          {businesses.length === 0 ? (

            <Card className="p-8 sm:p-12">
              <div className="mx-auto max-w-md text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {hasActiveFilters
                    ? "No businesses found"
                    : "No businesses available"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {hasActiveFilters
                    ? "We couldn't find an agricultural business matching these discovery filters. Try another search, category or verification option."
                    : "There are currently no agricultural businesses available in the AgricWise directory."}
                </p>

                {hasActiveFilters && (
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={clearDiscovery}
                    >
                      View All Businesses
                    </Button>
                  </div>
                )}

              </div>
            </Card>

          ) : (

            /* =============================================
               BUSINESS GRID
            ============================================= */

            <div className="relative">

              <div
                className={`grid gap-5 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
                  isFetching
                    ? "opacity-60"
                    : "opacity-100"
                }`}
              >

                {businesses.map((business) => (

                  <Link
                    key={business.id}
                    to={`/businesses/${business.slug}`}
                    className="group block"
                  >

                    <Card className="flex h-full flex-col overflow-hidden transition duration-200 group-hover:-translate-y-1 group-hover:border-green-200 group-hover:shadow-xl">

                      {/* ===================================
                          BUSINESS HEADER
                      =================================== */}

                      <div className="border-b border-gray-100 bg-gradient-to-br from-green-50 via-white to-white p-5">

                        <div className="flex items-start justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 transition group-hover:bg-green-600 group-hover:text-white">
                              <Store className="h-6 w-6" />
                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-green-700">
                                {business.farm_name}
                              </h3>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />

                                <span className="truncate">
                                  {business.farm_location}
                                </span>
                              </div>

                            </div>

                          </div>


                          {business.is_verified && (
                            <div
                              title="Verified AgricWise business"
                              className="flex shrink-0 items-center justify-center rounded-full bg-blue-50 p-1.5 text-blue-600"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                          )}

                        </div>


                        {/* =================================
                            CATEGORIES
                        ================================= */}

                        {business.business_categories.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">

                            {business.business_categories
                              .slice(0, 3)
                              .map((category) => (
                                <span
                                  key={category.id}
                                  className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 ring-1 ring-gray-200"
                                >
                                  {category.name}
                                </span>
                              ))}

                            {business.business_categories.length > 3 && (
                              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200">
                                +
                                {business.business_categories.length -
                                  3}
                              </span>
                            )}

                          </div>
                        )}

                      </div>


                      {/* ===================================
                          BUSINESS BODY
                      =================================== */}

                      <div className="flex flex-1 flex-col p-5">

                        <p className="line-clamp-3 text-sm leading-6 text-gray-600">
                          {business.farm_description ||
                            "Agricultural business on AgricWise."}
                        </p>


                        {/* =================================
                            ACTIVITY
                        ================================= */}

                        <div className="mt-5 grid grid-cols-2 gap-2">

                          <div className="rounded-xl bg-gray-50 p-3">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Package className="h-4 w-4" />

                              <span className="text-xs font-medium">
                                Products
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-bold text-gray-900">
                              {business.product_count}
                            </p>
                          </div>


                          <div className="rounded-xl bg-gray-50 p-3">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Wrench className="h-4 w-4" />

                              <span className="text-xs font-medium">
                                Services
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-bold text-gray-900">
                              {business.service_count}
                            </p>
                          </div>

                        </div>


                        {/* =================================
                            ACTION
                        ================================= */}

                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                          <span className="text-xs font-semibold text-gray-500">
                            View business presence
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 transition group-hover:gap-2.5">
                            Explore
                            <ArrowRight size={15} />
                          </span>

                        </div>

                      </div>

                    </Card>

                  </Link>

                ))}

              </div>

            </div>

          )}


          {/* =============================================
              PAGINATION
          ============================================= */}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 sm:flex-row">

              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>


              <div className="flex items-center gap-2">

                <button
                  type="button"
                  disabled={!hasPreviousPage}
                  onClick={() =>
                    goToPage(
                      Math.max(
                        1,
                        currentPage - 1
                      )
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>


                <button
                  type="button"
                  disabled={!hasNextPage}
                  onClick={() =>
                    goToPage(
                      currentPage + 1
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>

              </div>

            </div>
          )}

        </div>
      </section>


      {/* =================================================
          ECOSYSTEM BRIDGE
      ================================================= */}

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="grid gap-5 md:grid-cols-3">

            <Link
              to="/products"
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/40 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <Package size={20} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Explore Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover products listed by agricultural
                businesses across the marketplace.
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-green-700">
                Visit Marketplace
                <ArrowRight size={14} />
              </span>
            </Link>


            <Link
              to="/"
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/40 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Users size={20} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Join the Community
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Connect with people, businesses and
                agricultural professionals on AgricWise.
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                Enter AgricWise
                <ArrowRight size={14} />
              </span>
            </Link>


            <Link
              to="/farmer"
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-green-200 hover:bg-green-50/40 hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Building2 size={20} />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                Build Your Presence
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create your agricultural business presence
                and showcase what you offer.
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700">
                Open Business Workspace
                <ArrowRight size={14} />
              </span>
            </Link>

          </div>

        </div>
      </section>


      {/* =================================================
          BUSINESS CTA
      ================================================= */}

      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="relative overflow-hidden rounded-[28px] bg-gray-950 px-6 py-10 sm:px-10 sm:py-12">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex items-center gap-2 text-sm font-bold text-green-400">
                  <Users className="h-4 w-4" />

                  Grow your agricultural presence
                </div>

                <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                  Put your agricultural business where opportunity can find you.
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base">
                  Create your AgricWise business presence,
                  showcase your products and services, and
                  connect with people across the agricultural
                  value chain.
                </p>

              </div>


              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

                <Link to="/register">
                  <Button type="button">
                    Create Your Business
                  </Button>
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-gray-900"
                >
                  Explore Marketplace
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
};


export default AgriculturalBusinessesPage;