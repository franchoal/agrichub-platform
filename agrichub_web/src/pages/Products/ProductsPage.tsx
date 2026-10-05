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
      <main className="min-h-[60vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <div className="rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="text-sm font-semibold text-gray-700">
              Loading AgricWise Marketplace...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Finding available agricultural products.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-[60vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl">
              !
            </div>

            <h2 className="mt-5 text-2xl font-bold text-red-800">
              Unable to load the marketplace
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
              We could not retrieve the available products right now.
              Please refresh the page and try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            >
              Refresh Marketplace
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-10 pb-12">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[540px] overflow-hidden rounded-[32px] bg-green-950 sm:min-h-[580px]">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

        <div className="relative z-10 flex min-h-[540px] items-center px-6 py-16 sm:min-h-[580px] sm:px-10 lg:px-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:text-sm">
              <Store size={14} className="text-green-300" />

              AgricWise Marketplace
            </div>

            <h1 className="mt-7 text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Discover.
              <span className="text-green-300">
                {" "}
                Connect.
              </span>
              <br />
              Trade with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Discover agricultural products from farmers,
              agribusinesses and suppliers, explore what is
              available and connect with the people behind
              the products.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/businesses"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-green-800 shadow-xl transition duration-200 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-2xl"
              >
                Explore Businesses

                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#marketplace-products"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Play
                  size={16}
                  fill="currentColor"
                />

                Explore Products
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-white/65">
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
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <Store size={20} />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-green-700">
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

        <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Building2 size={20} />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-700">
            Businesses
          </p>

          <p className="mt-1 text-2xl font-black text-gray-900">
            {isLoadingBusinesses ? "—" : businessCount}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            agricultural businesses
          </p>
        </div>

        <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
            <Users size={20} />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-yellow-700">
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

        <div className="rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Wrench size={20} />
          </div>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-purple-700">
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
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <Search size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                AgricWise Marketplace
              </p>

              <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                Find what your agricultural business needs.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Browse products across the agricultural value
                chain. Search by name, category and price,
                then explore the businesses behind the listings.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/businesses"
                  className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
                >
                  Find Businesses
                  <ArrowRight size={14} />
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
                >
                  Join the Community
                  <Users size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-gray-950 p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-300">
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
      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <Filter size={19} />
            </div>

            <div>
              <h2 className="text-xl font-black text-gray-900">
                Browse Categories
              </h2>

              <p className="text-xs text-gray-500">
                Explore products across the agricultural value chain.
              </p>
            </div>
          </div>

          <Link
            to="/businesses"
            className="hidden items-center gap-1 text-xs font-bold text-green-700 sm:inline-flex"
          >
            Businesses
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => selectCategory("")}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              category === ""
                ? "bg-green-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================
          FILTER PANEL
      ========================================================= */}
      <section className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <SlidersHorizontal size={19} />
            </div>

            <div>
              <h2 className="text-lg font-black text-gray-900">
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
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700 sm:hidden"
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
          className={`p-5 sm:p-6 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
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
                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <p className="text-xs font-medium text-gray-500">
                Filters are currently active.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-xs font-bold text-green-700 transition hover:text-green-800"
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
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
              Marketplace Listings
            </p>

            <h2 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
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
            className="w-fit rounded-full border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-600 transition hover:border-green-600 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset Filters
          </button>
        </div>
      </section>

      {/* =========================================================
          PRODUCT RESULTS
      ========================================================= */}
      <section>
        {(products?.results?.length ?? 0) === 0 ? (
          <ProductEmpty />
        ) : (
          <>
            <ProductGrid
              products={products?.results ?? []}
            />

            <div className="mt-12">
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
          <section className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                  Behind the marketplace
                </p>

                <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
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
                className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-green-700 transition hover:text-green-800"
              >
                View all businesses
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {businesses.results.slice(0, 3).map((business) => (
                <Link
                  key={business.id}
                  to={`/businesses/${business.id}`}
                  className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:bg-green-50/40 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                      <Building2 size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="truncate font-black text-gray-900 group-hover:text-green-700">
                          {business.farm_name}
                        </h3>

                        {business.is_verified && (
                          <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">
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

                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-xs">
                    <span className="text-gray-500">
                      {business.product_count}{" "}
                      {business.product_count === 1
                        ? "product"
                        : "products"}
                    </span>

                    <span className="inline-flex items-center gap-1 font-bold text-green-700">
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
      <section className="relative overflow-hidden rounded-[32px]">
        <img
          src={marketplaceBanner}
          alt="Agricultural business owner displaying products"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/95 via-green-900/80 to-green-800/45" />

        <div className="relative px-6 py-16 text-center sm:px-10 sm:py-20 lg:px-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
            Grow your agricultural presence
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-4xl lg:text-5xl">
            More than a product listing.
            <span className="block text-green-300">
              Build your AgricWise presence.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-green-100 sm:text-lg sm:leading-8">
            Create your AgricWise business profile, showcase
            products and services, connect with the agricultural
            community and build a trusted presence across the
            value chain.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/farmer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-green-800 transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Open Business Workspace

              <ArrowRight size={17} />
            </Link>

            <Link
              to="/businesses"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-green-800"
            >
              Explore Businesses

              <Building2 size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;