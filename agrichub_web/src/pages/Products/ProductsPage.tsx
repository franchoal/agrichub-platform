import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Filter,
  Play,
  Search,
  SlidersHorizontal,
  Store,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { marketplaceBanner } from "../../assets/images";

import { useDebounce } from "../../hooks/useDebounce";
import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";
import { usePublicAgriculturalBusinesses } from "../../hooks/useAgriculturalServices";

import Pagination from "../../components/common/Pagination";
import ProductEmpty from "../../components/products/ProductEmpty";
import ProductGrid from "../../components/products/ProductGrid";

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search);

  const { data: categories = [] } = useCategories();

  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({
    page,
    search: debouncedSearch,
    ordering,
    category: category ? Number(category) : undefined,
    price__gte: minPrice ? Number(minPrice) : undefined,
    price__lte: maxPrice ? Number(maxPrice) : undefined,
  });

  const {
    data: businesses,
    isLoading: isLoadingBusinesses,
  } = usePublicAgriculturalBusinesses();

  const productCount = products?.count ?? 0;
  const businessCount = businesses?.count ?? 0;

  const verifiedBusinessCount =
    businesses?.results?.filter(
      (business) => business.is_verified
    ).length ?? 0;

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    ordering !== "-created_at";

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setOrdering("-created_at");
    setPage(1);
  };

  const selectCategory = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white px-6 py-6 text-center shadow-sm sm:px-8">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="text-sm font-semibold text-gray-700">
              Loading AgricWise Marketplace...
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Finding available agricultural products.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-center sm:rounded-[28px] sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-700">
              !
            </div>

            <h2 className="mt-5 text-xl font-bold text-red-800 sm:text-2xl">
              Unable to load the marketplace
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
              We could not retrieve the available products right now.
              Please refresh the page and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Refresh Marketplace
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-w-0 overflow-x-hidden bg-gray-50 pb-10 sm:pb-12">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-4 sm:space-y-10 sm:px-6 sm:pt-6 lg:px-8">
        {/* =========================================================
            HERO
        ========================================================= */}
        <section className="relative min-h-[500px] overflow-hidden rounded-[24px] bg-green-950 sm:min-h-[560px] sm:rounded-[32px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source
              src="/video/Hero_video.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

          <div className="relative z-10 flex min-h-[500px] items-end px-5 py-10 sm:min-h-[560px] sm:items-center sm:px-10 sm:py-16 lg:px-16">
            <div className="min-w-0 max-w-3xl">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur-md sm:px-4 sm:text-sm">
                <Store
                  size={14}
                  className="shrink-0 text-green-300"
                />

                <span className="truncate">
                  AgricWise Marketplace
                </span>
              </div>

              <h1 className="mt-6 max-w-3xl text-[2.35rem] font-black leading-[1.02] tracking-tight text-white sm:mt-7 sm:text-5xl lg:text-6xl">
                Discover.
                <span className="text-green-300">
                  {" "}
                  Connect.
                </span>
                <br />
                Trade with confidence.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/85 sm:mt-6 sm:text-lg sm:leading-8">
                Discover agricultural products from farmers,
                agribusinesses and suppliers, explore what is
                available and connect with the people behind
                the products.
              </p>

              <div className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row">
                <Link
                  to="/businesses"
                  className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-green-800 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-2xl sm:w-auto sm:px-7 sm:py-3.5"
                >
                  Explore Businesses

                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#marketplace-products"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto sm:px-7 sm:py-3.5"
                >
                  <Play
                    size={16}
                    fill="currentColor"
                  />

                  Explore Products
                </a>
              </div>

              <div className="mt-7 flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 text-[11px] font-semibold text-white/65 sm:mt-9 sm:gap-x-5 sm:text-xs">
                <span>Fresh Produce</span>

                <span className="text-green-300">•</span>

                <span>Grains</span>

                <span className="text-green-300">•</span>

                <span>Livestock</span>

                <span className="text-green-300">•</span>

                <span>Agro-inputs</span>

                <span className="text-green-300">•</span>

                <span>Farm Equipment</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MARKETPLACE ECOSYSTEM
        ========================================================= */}
        <section className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <div className="min-w-0 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 sm:h-11 sm:w-11">
              <Store size={20} />
            </div>

            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-green-700 sm:mt-4 sm:text-xs">
              Marketplace
            </p>

            <p className="mt-1 text-2xl font-black text-gray-900">
              {productCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {productCount === 1
                ? "product listed"
                : "products listed"}
            </p>
          </div>

          <div className="min-w-0 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 sm:h-11 sm:w-11">
              <Building2 size={20} />
            </div>

            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-blue-700 sm:mt-4 sm:text-xs">
              Businesses
            </p>

            <p className="mt-1 text-2xl font-black text-gray-900">
              {isLoadingBusinesses ? "—" : businessCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              agricultural businesses
            </p>
          </div>

          <div className="min-w-0 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700 sm:h-11 sm:w-11">
              <Users size={20} />
            </div>

            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-yellow-700 sm:mt-4 sm:text-xs">
              Trusted Presence
            </p>

            <p className="mt-1 text-2xl font-black text-gray-900">
              {isLoadingBusinesses
                ? "—"
                : verifiedBusinessCount}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              verified businesses
            </p>
          </div>

          <div className="min-w-0 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700 sm:h-11 sm:w-11">
              <Wrench size={20} />
            </div>

            <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-purple-700 sm:mt-4 sm:text-xs">
              Beyond Products
            </p>

            <p className="mt-1 text-2xl font-black text-gray-900">
              Services
            </p>

            <p className="mt-1 text-xs text-gray-500">
              discover agricultural capabilities
            </p>
          </div>
        </section>

        {/* =========================================================
            MARKETPLACE INTRO
        ========================================================= */}
        <section className="grid min-w-0 gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:gap-6">
          <div className="min-w-0 rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm sm:rounded-[28px] sm:p-8">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700 sm:h-12 sm:w-12 sm:rounded-2xl">
                <Search size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-700 sm:text-xs sm:tracking-[0.18em]">
                  AgricWise Marketplace
                </p>

                <h2 className="mt-2 text-xl font-black leading-tight text-gray-900 sm:text-3xl">
                  Find what your agricultural business needs.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                  Browse products across the agricultural value
                  chain. Search by name, category and price,
                  then explore the businesses behind the listings.
                </p>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-2">
                  <Link
                    to="/businesses"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
                  >
                    Find Businesses
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    to="/"
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
                  >
                    Join the Community
                    <Users size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[24px] bg-gray-950 p-5 text-white shadow-sm sm:rounded-[28px] sm:p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-300 sm:text-xs sm:tracking-[0.18em]">
              Your AgricWise Journey
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-black text-green-300">
                  1
                </span>

                <span className="text-sm font-semibold text-gray-200">
                  Discover businesses
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-black text-green-300">
                  2
                </span>

                <span className="text-sm font-semibold text-gray-200">
                  Explore products & services
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-black text-green-300">
                  3
                </span>

                <span className="text-sm font-semibold text-gray-200">
                  Connect and trade
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CATEGORY NAVIGATION
        ========================================================= */}
        <section className="min-w-0">
          <div className="mb-4 flex min-w-0 items-center justify-between gap-3 sm:mb-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <Filter size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-black text-gray-900 sm:text-xl">
                  Browse Categories
                </h2>

                <p className="hidden text-xs text-gray-500 sm:block">
                  Explore products across the agricultural value chain.
                </p>
              </div>
            </div>

            <Link
              to="/businesses"
              className="hidden shrink-0 items-center gap-1 text-xs font-bold text-green-700 sm:inline-flex"
            >
              Businesses
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="-mx-4 overflow-hidden px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 overflow-x-auto pb-2 pr-4 scrollbar-hide sm:pr-0">
              <button
                type="button"
                onClick={() => selectCategory("")}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === ""
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white text-gray-700 shadow-sm ring-1 ring-gray-100 hover:bg-gray-100"
                }`}
              >
                All Products
              </button>

              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectCategory(String(item.id))}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    category === String(item.id)
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-white text-gray-700 shadow-sm ring-1 ring-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            FILTER PANEL
        ========================================================= */}
        <section className="min-w-0 overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-sm sm:rounded-[28px]">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <SlidersHorizontal size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-black text-gray-900 sm:text-lg">
                  Find Products
                </h2>

                <p className="hidden text-xs text-gray-500 sm:block">
                  Refine your marketplace search.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:hidden"
            >
              {showFilters ? (
                <>
                  <X size={15} />
                  Hide
                </>
              ) : (
                <>
                  <SlidersHorizontal size={15} />
                  Filters
                </>
              )}
            </button>
          </div>

          <div
            className={`p-4 sm:p-6 ${
              showFilters ? "block" : "hidden sm:block"
            }`}
          >
            <div className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative min-w-0 lg:col-span-2">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="min-h-11 w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="">All Categories</option>

                {categories.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                placeholder="Minimum Price"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <input
                type="number"
                min="0"
                placeholder="Maximum Price"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <select
                value={ordering}
                onChange={(e) => {
                  setOrdering(e.target.value);
                  setPage(1);
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 md:col-span-2 lg:col-span-1"
              >
                <option value="-created_at">Newest</option>

                <option value="price">
                  Price: Low → High
                </option>

                <option value="-price">
                  Price: High → Low
                </option>

                <option value="name">
                  Name A-Z
                </option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
                <p className="text-xs font-medium text-gray-500">
                  Filters are currently active.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-10 items-center justify-center gap-2 self-start text-xs font-bold text-green-700 transition hover:text-green-800 sm:self-auto"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            RESULTS HEADER
        ========================================================= */}
        <section
          id="marketplace-products"
          className="scroll-mt-24"
        >
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:pb-5">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-700 sm:text-xs sm:tracking-[0.18em]">
                Marketplace Listings
              </p>

              <h2 className="mt-1 text-xl font-black text-gray-900 sm:text-3xl">
                Available Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {productCount}{" "}
                {productCount === 1
                  ? "product"
                  : "products"}{" "}
                found
              </p>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="inline-flex min-h-10 w-fit items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Reset Filters
            </button>
          </div>
        </section>

        {/* =========================================================
            PRODUCT RESULTS
        ========================================================= */}
        <section className="min-w-0">
          {(products?.results?.length ?? 0) === 0 ? (
            <ProductEmpty />
          ) : (
            <>
              <ProductGrid
                products={products?.results ?? []}
              />

              <div className="mt-8 sm:mt-12">
                <Pagination
                  page={page}
                  total={productCount}
                  pageSize={12}
                  onPageChange={setPage}
                />
              </div>
            </>
          )}
        </section>

        {/* =========================================================
            DISCOVER BUSINESSES
        ========================================================= */}
        {!isLoadingBusinesses &&
          businesses?.results &&
          businesses.results.length > 0 && (
            <section className="min-w-0 overflow-hidden rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8">
              <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-700 sm:text-xs sm:tracking-[0.18em]">
                    Behind the marketplace
                  </p>

                  <h2 className="mt-2 text-xl font-black text-gray-900 sm:text-3xl">
                    Discover Agricultural Businesses
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                    Products are part of a bigger agricultural
                    ecosystem. Explore the businesses, farms and
                    professionals behind the listings.
                  </p>
                </div>

                <Link
                  to="/businesses"
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-sm font-bold text-green-700 transition hover:text-green-800 sm:self-auto"
                >
                  View all businesses
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-5 grid min-w-0 gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {businesses.results.slice(0, 3).map((business) => (
                  <Link
                    key={business.id}
                    to={`/businesses/${business.id}`}
                    className="group min-w-0 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50/40 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm sm:h-11 sm:w-11">
                        <Building2 size={19} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-start justify-between gap-2">
                          <h3 className="min-w-0 truncate font-black text-gray-900 group-hover:text-green-700">
                            {business.farm_name}
                          </h3>

                          {business.is_verified && (
                            <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[9px] font-bold text-green-700 sm:text-[10px]">
                              Verified
                            </span>
                          )}
                        </div>

                        <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                          {business.farm_location}
                        </p>
                      </div>
                    </div>

                    {business.business_categories.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {business.business_categories
                          .slice(0, 2)
                          .map((item) => (
                            <span
                              key={item.id}
                              className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-600"
                            >
                              {item.name}
                            </span>
                          ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-4 text-xs">
                      <span className="text-gray-500">
                        {business.product_count}{" "}
                        {business.product_count === 1
                          ? "product"
                          : "products"}
                      </span>

                      <span className="inline-flex shrink-0 items-center gap-1 font-bold text-green-700">
                        Explore
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        {/* =========================================================
            SELLER CTA
        ========================================================= */}
        <section className="relative min-w-0 overflow-hidden rounded-[24px] sm:rounded-[32px]">
          <img
            src={marketplaceBanner}
            alt="Agricultural business owner displaying products"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/85 to-green-800/55" />

          <div className="relative px-5 py-12 text-center sm:px-10 sm:py-20 lg:px-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-300 sm:text-xs sm:tracking-[0.2em]">
              Grow your agricultural presence
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-2xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              More than a product listing.
              <span className="block text-green-300">
                Build your AgricWise presence.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-green-100 sm:mt-5 sm:text-lg sm:leading-8">
              Create your AgricWise business profile, showcase
              products and services, connect with the agricultural
              community and build a trusted presence across the
              value chain.
            </p>

            <div className="mx-auto mt-7 flex w-full max-w-md flex-col justify-center gap-3 sm:mt-9 sm:max-w-none sm:flex-row">
              <Link
                to="/farmer"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-green-800 transition hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto"
              >
                Open Business Workspace

                <ArrowRight size={17} />
              </Link>

              <Link
                to="/businesses"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-green-800 sm:w-auto"
              >
                Explore Businesses

                <Building2 size={17} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductsPage;