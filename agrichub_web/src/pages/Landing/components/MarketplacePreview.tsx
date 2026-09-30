import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import { useProducts } from "../../../hooks/useProducts";

import ProductGrid from "../../../components/products/ProductGrid";

function MarketplacePreview() {
const {
data: products,
isLoading,
isError,
} = useProducts({
page: 1,
ordering: "-created_at",
});

const featuredProducts =
products?.results?.slice(0, 4) ?? [];

return ( <section
   id="marketplace-preview"
   className="relative overflow-hidden bg-white px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24"
 > <div className="relative mx-auto max-w-7xl">
{/* Section introduction */} <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8"> <div className="max-w-2xl"> <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-green-700 sm:px-4 sm:text-xs sm:tracking-[0.18em]"> <ShoppingBag size={14} />
AgricWise Marketplace </div>

```
        <h2 className="text-[2rem] font-black leading-[1.08] tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          Agriculture is better
          <span className="text-green-600">
            {" "}
            when opportunity meets the market.
          </span>
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:mt-5 sm:text-lg sm:leading-8">
          Discover agricultural products from farmers and sellers,
          explore opportunities and connect with the people who
          keep agriculture moving.
        </p>
      </div>

      {/* Desktop CTA */}
      <Link
        to="/products"
        className="group hidden shrink-0 items-center gap-2 rounded-full border border-green-600 px-6 py-3.5 text-sm font-bold text-green-700 transition duration-200 hover:bg-green-600 hover:text-white lg:inline-flex"
      >
        View Marketplace

        <ArrowRight
          size={18}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>

    {/* Products */}
    <div className="mt-9 sm:mt-11">
      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm sm:rounded-3xl"
            >
              <div className="aspect-square animate-pulse bg-gray-100" />

              <div className="space-y-2.5 p-3.5 sm:space-y-3 sm:p-5">
                <div className="h-3.5 w-20 animate-pulse rounded bg-gray-100 sm:h-4 sm:w-24" />

                <div className="h-4 w-full animate-pulse rounded bg-gray-100 sm:h-5 sm:w-3/4" />

                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100 sm:h-5 sm:w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-[24px] border border-gray-200 bg-gray-50 px-5 py-10 text-center sm:rounded-3xl sm:px-6 sm:py-12">
          <ShoppingBag
            size={34}
            className="mx-auto text-gray-400"
          />

          <h3 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
            Marketplace is getting ready
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            We couldn't load the latest products right now.
            You can still explore the full AgricWise Marketplace.
          </p>

          <Link
            to="/products"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-700 sm:mt-6 sm:px-6"
          >
            Explore Marketplace

            <ArrowRight size={17} />
          </Link>
        </div>
      )}

      {/* Products */}
      {!isLoading &&
        !isError &&
        featuredProducts.length > 0 && (
          <ProductGrid
            products={featuredProducts}
          />
        )}

      {/* Empty state */}
      {!isLoading &&
        !isError &&
        featuredProducts.length === 0 && (
          <div className="rounded-[24px] border border-gray-100 bg-gray-50 px-5 py-10 text-center sm:rounded-3xl sm:px-6 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700 sm:h-16 sm:w-16">
              <ShoppingBag size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-gray-900 sm:mt-5 sm:text-xl">
              The marketplace is growing
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Agricultural products will appear here as farmers
              and sellers begin listing on AgricWise.
            </p>

            <Link
              to="/products"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-green-600 px-5 py-3 text-sm font-bold text-green-700 transition hover:bg-green-600 hover:text-white sm:mt-6 sm:px-6"
            >
              Explore Marketplace

              <ArrowRight size={17} />
            </Link>
          </div>
        )}
    </div>

    {/* Mobile CTA */}
    <div className="mt-7 lg:hidden">
      <Link
        to="/products"
        className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/10 transition hover:bg-green-700"
      >
        View Marketplace

        <ArrowRight
          size={18}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </Link>
    </div>
  </div>
</section>


);
}

export default MarketplacePreview;
