import { ArrowLeft, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";

import { useCreateProduct } from "../../hooks/useCreateProduct";

import type {
  ProductFormData,
} from "../../validators/productSchemas";

const CreateProductPage = () => {
  const navigate = useNavigate();

  const {
    mutate,
    isPending,
  } = useCreateProduct(() => {
    navigate(
      "/farmer/dashboard",
      {
        replace: true,
      },
    );
  });

  const handleSubmit = (
    data: ProductFormData,
  ) => {
    mutate(data);
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
              <Package size={23} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Business Inventory
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Add a Product
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Create a clear product listing for your AgricWise
                business and make it available to potential buyers.
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
            submitLabel="Add Product"
          />
        </div>
      </div>
    </main>
  );
};

export default CreateProductPage;