import { useState } from "react";

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
} from "../../services/farmerService";

import {
  useQuery,
} from "@tanstack/react-query";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";

const PAGE_SIZE = 12;

interface BusinessSearchFormProps {
  initialSearch: string;
  onSearch: (search: string) => void;
}

function BusinessSearchForm({
  initialSearch,
  onSearch,
}: BusinessSearchFormProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onSearch(searchInput.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 max-w-3xl"
    >
      <label
        htmlFor="business-search"
        className="sr-only"
      >
        Search agricultural businesses
      </label>

      <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

          <Input
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Business name, location or category..."
            className="h-12 border-0 bg-white pl-11 pr-3 text-gray-900 shadow-none focus:ring-0"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800 sm:min-w-32"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Search the directory, then narrow your results using
        the filters below.
      </p>
    </form>
  );
}

const AgriculturalBusinessesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Discovery state is URL-driven so search results and filters
   * remain shareable, bookmarkable and compatible with pagination.
   */

  const searchFromUrl = searchParams.get("search") ?? "";
  const categoryFromUrl = searchParams.get("category") ?? "";
  const verifiedFromUrl = searchParams.get("verified") ?? "";

  const parsedPage = Number(searchParams.get("page") ?? "1");

  const currentPage =
    Number.isSafeInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  /*
   * Load real categories from the existing backend.
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
   * Use the existing public business discovery hook.
   * No business records or category options are hardcoded.
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

  const businesses = data?.results ?? [];
  const totalBusinesses = data?.count ?? 0;

  /*
   * Update discovery parameters without discarding unrelated
   * URL parameters. Changing a filter resets pagination.
   */

  const updateDiscoveryParams = (
    updates: Record<string, string | null>,
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value.trim() === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, value);
      }
    });

    if (
      "search" in updates ||
      "category" in updates ||
      "verified" in updates
    ) {
      nextParams.delete("page");
    }

    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (search: string) => {
    updateDiscoveryParams({
      search: search || null,
    });
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateDiscoveryParams({
      category: event.target.value || null,
    });
  };

  const handleVerifiedChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    updateDiscoveryParams({
      verified: event.target.value || null,
    });
  };

  const clearDiscovery = () => {
    setSearchParams({});
  };

  const goToPage = (page: number) => {
    const nextParams = new URLSearchParams(searchParams);

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
   * Pagination uses the backend's count, previous and next
   * fields. PAGE_SIZE must remain aligned with the backend
   * pagination configuration.
   */

  const totalPages = Math.max(
    1,
    Math.ceil(totalBusinesses / PAGE_SIZE),
  );

  const hasPreviousPage = Boolean(data?.previous);
  const hasNextPage = Boolean(data?.next);

  const resultStart =
    totalBusinesses > 0
      ? (currentPage - 1) * PAGE_SIZE + 1
      : 0;

  const resultEnd = Math.min(
    currentPage * PAGE_SIZE,
    totalBusinesses,
  );

  const hasActiveFilters =
    Boolean(searchFromUrl) ||
    Boolean(categoryFromUrl) ||
    Boolean(verifiedFromUrl);

  const selectedCategory = categories.find(
    (category) => category.slug === categoryFromUrl,
  );

  /*
   * Initial loading state.
   */

  if (isLoading && !data) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <Spinner />

            <div>
              <p className="font-semibold text-gray-900">
                Loading agricultural businesses
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Please wait while we retrieve the directory.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error state with retry.
   */

  if (isError && !data) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center">
          <Card className="w-full p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Store className="h-7 w-7 text-red-600" />
            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              We couldn't load the directory
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Please check your connection and try again.
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Compact directory introduction */}

      <section className="bg-gradient-to-br from-green-950 via-gray-950 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold text-green-300">
                <Building2 className="h-4 w-4" />
                AgricWise Business Directory
              </div>

              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Find your place in the agricultural value chain.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-300 sm:text-base">
                Discover farmers, suppliers, service providers
                and other agricultural businesses. Explore their
                offerings and connect with the businesses you need.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 lg:self-auto"
            >
              <Package className="h-4 w-4" />
              Browse marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search */}

          <BusinessSearchForm
            key={searchFromUrl}
            initialSearch={searchFromUrl}
            onSearch={handleSearchSubmit}
          />
        </div>
      </section>

      {/* Compact, responsive filters */}

      <section className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto]">
            <div>
              <label
                htmlFor="business-category"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Agricultural category
              </label>

              <div className="relative">
                <select
                  id="business-category"
                  value={categoryFromUrl}
                  onChange={handleCategoryChange}
                  disabled={isCategoriesLoading}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/10 disabled:cursor-not-allowed disabled:bg-gray-50"
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

            <div>
              <label
                htmlFor="business-verification"
                className="mb-1 block text-xs font-semibold text-gray-600"
              >
                Verification status
              </label>

              <div className="relative">
                <select
                  id="business-verification"
                  value={verifiedFromUrl}
                  onChange={handleVerifiedChange}
                  className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/10"
                >
                  <option value="">All businesses</option>
                  <option value="true">Verified only</option>
                  <option value="false">Not verified</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={clearDiscovery}
                  className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 lg:w-auto"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="hidden items-end lg:flex">
                <span className="px-2 pb-3 text-xs text-gray-400">
                  Refine your search
                </span>
              </div>
            )}
          </div>

          {selectedCategory?.description && (
            <p className="mt-2 text-xs leading-5 text-gray-500">
              <span className="font-semibold text-green-800">
                {selectedCategory.name}:
              </span>{" "}
              {selectedCategory.description}
            </p>
          )}
        </div>
      </section>

      {/* Directory results */}

      <section
        id="business-directory"
        className="scroll-mt-40"
      >
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          {/* Results summary */}

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Agricultural businesses
              </h2>

              <p
                className="mt-1 text-sm text-gray-500"
                aria-live="polite"
              >
                {totalBusinesses === 0 ? (
                  "No matching businesses"
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-semibold text-gray-800">
                      {resultStart}–{resultEnd}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-800">
                      {totalBusinesses}
                    </span>{" "}
                    {totalBusinesses === 1 ? "business" : "businesses"}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Store className="h-4 w-4 text-green-700" />
              <span>
                {PAGE_SIZE} businesses per page
              </span>

              {isFetching && (
                <span className="ml-1 inline-flex items-center gap-1.5 font-medium text-green-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
                  Updating
                </span>
              )}
            </div>
          </div>

          {/* Empty state */}

          {businesses.length === 0 ? (
            <Card className="p-7 sm:p-12">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {hasActiveFilters
                    ? "No businesses match your search"
                    : "No businesses available yet"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {hasActiveFilters
                    ? "Try a different search term or change your filters to discover other agricultural businesses."
                    : "Agricultural businesses will appear here when they are available in the directory."}
                </p>

                {hasActiveFilters && (
                  <div className="mt-5">
                    <Button
                      type="button"
                      onClick={clearDiscovery}
                    >
                      View all businesses
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <div
              className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 ${
                isFetching ? "opacity-60" : "opacity-100"
              }`}
              aria-busy={isFetching}
            >
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  to={`/businesses/${business.slug}`}
                  className="group flex min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                  aria-label={`View ${business.farm_name} business profile`}
                >
                  <Card className="flex h-full w-full flex-col overflow-hidden border border-gray-200 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-green-300 group-hover:shadow-lg">
                    <div className="p-4 sm:p-5">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 transition group-hover:bg-green-700 group-hover:text-white">
                          <Store className="h-6 w-6" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-bold leading-6 text-gray-900 transition group-hover:text-green-700">
                            {business.farm_name}
                          </h3>

                          <div className="mt-1 flex min-w-0 items-start gap-1.5 text-xs leading-5 text-gray-500">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                            <span className="break-words">
                              {business.farm_location || "Location not provided"}
                            </span>
                          </div>
                        </div>

                        {business.is_verified && (
                          <span
                            title="Verified AgricWise business"
                            aria-label="Verified AgricWise business"
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">
                              Verified
                            </span>
                          </span>
                        )}
                      </div>

                      {business.business_categories?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {business.business_categories
                            .slice(0, 2)
                            .map((category) => (
                              <span
                                key={category.id}
                                className="max-w-full truncate rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-600"
                              >
                                {category.name}
                              </span>
                            ))}

                          {business.business_categories.length > 2 && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                              +{business.business_categories.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="mt-4 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-600">
                        {business.farm_description?.trim() ||
                          "Discover this agricultural business and explore its offerings on AgricWise."}
                      </p>
                    </div>

                    <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-gray-50 p-3">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Package className="h-4 w-4 shrink-0" />
                            <span className="text-xs">Products</span>
                          </div>

                          <p className="mt-1 text-base font-bold text-gray-900">
                            {business.product_count}
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-3">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Wrench className="h-4 w-4 shrink-0" />
                            <span className="text-xs">Services</span>
                          </div>

                          <p className="mt-1 text-base font-bold text-gray-900">
                            {business.service_count}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                        <span className="text-xs text-gray-500">
                          Business profile
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 transition group-hover:gap-2.5">
                          View profile
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Server-side pagination */}

          {totalPages > 1 && (
            <nav
              className="mt-8 border-t border-gray-200 pt-5"
              aria-label="Business directory pagination"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

                <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
                  <button
                    type="button"
                    disabled={!hasPreviousPage || isFetching}
                    onClick={() =>
                      goToPage(Math.max(1, currentPage - 1))
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={!hasNextPage || isFetching}
                    onClick={() => goToPage(currentPage + 1)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </section>

      {/* One compact call to action */}

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Ready to showcase your agricultural business?
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
                Create your AgricWise account to get started with
                your own business presence.
              </p>
            </div>
          </div>

          <Link
            to="/register"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default AgriculturalBusinessesPage;