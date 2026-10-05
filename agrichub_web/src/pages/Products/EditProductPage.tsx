import {
  ArrowLeft,
  Pencil,
  Package,
} from "lucide-react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";

import { useFarmerProduct } from "../../hooks/useFarmerProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";

import type {
  ProductFormData,
} from "../../validators/productSchemas";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const productId = Number(id);

  const {
    data: product,
    isLoading,
    isError,
  } = useFarmerProduct(productId);

  const {
    mutate,
    isPending,
  } = useUpdateProduct(() => {
    navigate(
      "/farmer/dashboard",
      {
        replace: true,
      },
    );
  });

  if (!id || Number.isNaN(productId)) {
    return (
      <Navigate
        to="/farmer/dashboard"
        replace
      />
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-gray-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

            <p className="text-sm font-bold text-gray-700">
              Loading product...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Preparing your product details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Package
                size={24}
                className="text-red-700"
              />
            </div>

            <h1 className="mt-5 text-2xl font-black text-red-800">
              Product unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-red-700">
              We could not load this product. It may have been
              removed or you may no longer have access to it.
            </p>

            <Link
              to="/farmer/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            >
              <ArrowLeft size={16} />
              Return to Workspace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = (
    data: ProductFormData,
  ) => {
    mutate({
      id: product.id,
      data,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {/* =================================================
            BACK NAVIGATION
        ================================================= */}
        <Link
          to="/farmer/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={17} />
          Back to Business Workspace
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <Pencil size={21} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Business Inventory
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Edit Product
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Update your product information, pricing,
                inventory or availability.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            PRODUCT CONTEXT
        ================================================= */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
                <Package
                  size={22}
                  className="text-gray-400"
                />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-lg font-black text-gray-900">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Update this AgricWise business listing below.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            FORM
        ================================================= */}
        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <ProductForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            initialValues={{
              category: product.category,
              name: product.name,
              description: product.description,
              price: Number(product.price),
              quantity: product.quantity,
              unit:
                product.unit as ProductFormData["unit"],
              is_available: product.is_available,
              image: null,
            }}
            submitLabel="Update Product"
          />
        </div>
      </div>
    </main>
  );
};

export default EditProductPage;