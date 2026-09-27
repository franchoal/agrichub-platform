import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";

import { useFarmerProduct } from "../../hooks/useFarmerProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";

import type { ProductFormData } from "../../validators/productSchemas";

const EditProductPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

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
    navigate("/farmer");
  });

  useEffect(() => {
    if (id && Number.isNaN(productId)) {
      navigate("/farmer");
    }
  }, [id, productId, navigate]);

  const handleSubmit = (
    data: ProductFormData
  ) => {
    mutate({
      id: productId,

      data: {
        category: Number(data.category),
        name: data.name,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
        unit: data.unit,
        is_available: data.is_available,
        image: data.image ?? undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="animate-pulse space-y-6">

          <div className="h-52 rounded-3xl bg-gray-200" />

          <div className="h-32 rounded-3xl bg-gray-100" />

          <div className="h-[700px] rounded-3xl bg-gray-100" />

        </div>

      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">

        <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center shadow-sm">

          <h2 className="text-2xl font-bold text-red-700">
            Product Not Found
          </h2>

          <p className="mt-3 text-red-600">
            We couldn't find the product you're trying to edit.
          </p>

          <button
            onClick={() => navigate("/farmer")}
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Return to Dashboard
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* Hero */}

      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white shadow-xl">

        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/5" />

        <div className="relative">

          <p className="text-sm uppercase tracking-widest text-green-100">
            Farmer Marketplace
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Update Your Product
          </h1>

          <p className="mt-4 max-w-3xl text-green-100">
            Keep your product listing accurate and up to date.
            Updating prices, stock levels, descriptions and images
            helps buyers make informed purchasing decisions.
          </p>

        </div>

      </section>

      {/* Information */}

      <section className="mb-8 rounded-3xl border border-blue-100 bg-blue-50 p-6">

        <h2 className="text-lg font-semibold text-blue-900">
          Before You Save
        </h2>

        <ul className="mt-4 space-y-2 text-sm text-blue-700">

          <li>✓ Review your current selling price.</li>

          <li>✓ Update available stock quantity.</li>

          <li>✓ Update product availability when necessary.</li>

          <li>✓ Replace outdated product images if necessary.</li>

          <li>✓ Ensure your description accurately reflects the product.</li>

        </ul>

      </section>

      {/* Form */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">

        <div className="mb-8">

          <h2 className="text-2xl font-bold">
            Product Information
          </h2>

          <p className="mt-2 text-gray-500">
            Edit the information below and save your changes.
          </p>

        </div>

        <ProductForm
          initialValues={{
            category: product.category,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            quantity: product.quantity,
            unit:
              product.unit as ProductFormData["unit"],
            is_available: product.is_available,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel={
            isPending
              ? "Saving Changes..."
              : "Save Changes"
          }
        />

      </section>

      {/* Footer */}

      <section className="mt-10 rounded-3xl border bg-white p-8 text-center shadow-sm">

        <h2 className="text-2xl font-bold">
          Keep Your Marketplace Fresh
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Accurate product information builds buyer confidence,
          improves visibility, and increases your chances of making successful sales.
        </p>

      </section>

    </main>
  );
};

export default EditProductPage;