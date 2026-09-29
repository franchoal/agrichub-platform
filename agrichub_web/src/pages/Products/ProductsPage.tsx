import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";

import {
  marketplaceBanner,
} from "../../assets/images";

import { useDebounce } from "../../hooks/useDebounce";
import { useCategories } from "../../hooks/useCategories";
import { useProducts } from "../../hooks/useProducts";

import Pagination from "../../components/common/Pagination";
import ProductEmpty from "../../components/products/ProductEmpty";
import ProductGrid from "../../components/products/ProductGrid";

const ProductsPage = () => {
  const [search, setSearch] = useState("");

  const debouncedSearch =
    useDebounce(search);

  const [category, setCategory] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  const [ordering, setOrdering] =
    useState("-created_at");

  const [page, setPage] =
    useState(1);

  const {
    data: categories = [],
  } = useCategories();

  const {
    data: products,
    isLoading,
    isError,
  } = useProducts({
    page,
    search: debouncedSearch,
    ordering,
    category: category
      ? Number(category)
      : undefined,
    price__gte: minPrice
      ? Number(minPrice)
      : undefined,
    price__lte: maxPrice
      ? Number(maxPrice)
      : undefined,
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setOrdering("-created_at");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        Loading marketplace...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-700">
          Unable to load products
        </h2>

        <p className="mt-2 text-red-600">
          Please refresh the page and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden rounded-[32px]">

        <img
          src={marketplaceBanner}
          alt="Nigeria's Digital Agricultural Marketplace"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-green-700/40" />

        <div className="relative px-8 py-24 lg:px-16">

          <div className="max-w-3xl">

            <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
              🌾 Fresh Produce From Verified Nigerian Farmers
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white lg:text-6xl">
              Marketplace
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-green-100">
              Discover vegetables, fruits, grains, livestock and more from trusted farmers across Nigeria. Shop confidently with transparent pricing and quality produce.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              {/* BECOME A SELLER */}

              <Link
                to="/farmer"
                className="flex items-center gap-2 rounded-2xl bg-white px-7 py-4 font-semibold text-green-700 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Become a Seller

                <ArrowRight size={18} />
              </Link>

              {/* FARMER PORTAL */}

              <Link
                to="/farmer"
                className="flex items-center gap-2 rounded-2xl border border-white/70 bg-green-950/30 px-7 py-4 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-green-950/50"
              >
                Farmer Portal

                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CATEGORY CHIPS ================= */}

      <section>

        <div className="mb-5 flex items-center gap-3">

          <Filter
            size={20}
            className="text-green-700"
          />

          <h2 className="text-xl font-bold text-gray-900">
            Browse Categories
          </h2>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              category === ""
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>

          {categories.map((item) => (

            <button
              key={item.id}
              onClick={() => {
                setCategory(String(item.id));
                setPage(1);
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                category === String(item.id)
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {item.name}
            </button>

          ))}

        </div>

      </section>


      {/* ================= FILTERS ================= */}

      <section className="rounded-[28px] bg-white p-8 shadow">

        <div className="mb-6 flex items-center gap-3">

          <Search
            size={20}
            className="text-green-700"
          />

          <h2 className="text-xl font-bold">
            Filter Products
          </h2>

        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600"
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3"
          >

            <option value="">
              All Categories
            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            ))}

          </select>

          <input
            type="number"
            placeholder="Minimum Price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3"
          />

          <input
            type="number"
            placeholder="Maximum Price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3"
          />

          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-gray-300 px-4 py-3"
          >

            <option value="-created_at">
              Newest
            </option>

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

      </section>


      {/* ================= TOOLBAR ================= */}

      <section className="flex flex-col items-start justify-between gap-5 rounded-3xl bg-white p-6 shadow md:flex-row md:items-center">

        <div>

          <h2 className="text-3xl font-bold text-gray-900">
            Available Products
          </h2>

          <p className="mt-2 text-gray-500">
            {products?.count ?? 0} Product{(products?.count ?? 0) !== 1 ? "s" : ""} Found
          </p>

        </div>

        <button
          onClick={clearFilters}
          className="rounded-xl border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
        >
          Reset Filters
        </button>

      </section>


      {/* ================= RESULTS ================= */}

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
                total={products?.count ?? 0}
                pageSize={12}
                onPageChange={setPage}
              />

            </div>

          </>

        )}

      </section>


      {/* ================= CTA ================= */}

      <section className="relative overflow-hidden rounded-[32px]">

        <img
          src={marketplaceBanner}
          alt="Become a Farmer"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-green-700/40" />

        <div className="relative px-8 py-20 text-center lg:px-16">

          <h2 className="text-4xl font-extrabold text-white lg:text-5xl">
            Are You a Farmer?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-100">
            Join thousands of Nigerian farmers selling directly to buyers
            across Nigeria. Upload products, receive orders, grow your
            customer base and increase your farm income with
            AgricWise Marketplace.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">

            <Link
              to="/farmer"
              className="rounded-2xl bg-white px-8 py-4 font-bold text-green-700 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              Become a Seller
            </Link>

            <Link
              to="/farmer"
              className="rounded-2xl border border-white px-8 py-4 font-bold text-white transition hover:bg-white hover:text-green-700"
            >
              Farmer Portal
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default ProductsPage;
