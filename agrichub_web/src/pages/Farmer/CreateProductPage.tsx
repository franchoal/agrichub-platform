import { useNavigate } from "react-router-dom";

import ProductForm from "../../components/products/ProductForm";
import { useCreateProduct } from "../../hooks/useCreateProduct";

import type { ProductFormData } from "../../validators/productSchemas";

const CreateProductPage = () => {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreateProduct(() => {
    navigate("/farmer");
  });

  const handleSubmit = (data: ProductFormData) => {
    mutate({
      category: Number(data.category),
      name: data.name,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      unit: data.unit,
      is_available: data.is_available,
      image: data.image ?? null,
    });
  };

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
            List a New Product
          </h1>

          <p className="mt-4 max-w-3xl text-green-100">
            Add fresh agricultural produce to Nigeria's Digital Agriculture Marketplace.
            Complete the product details below to make your products available
            to verified buyers across the country.
          </p>

        </div>

      </section>

      {/* Information */}

      <section className="mb-8 rounded-3xl border border-green-100 bg-green-50 p-6">

        <h2 className="text-lg font-semibold text-green-800">
          Before You Publish
        </h2>

        <ul className="mt-4 space-y-2 text-sm text-green-700">

          <li>✓ Upload a clear, high-quality product image.</li>

          <li>✓ Write an accurate product description.</li>

          <li>✓ Ensure your quantity and price are up to date.</li>

          <li>✓ Choose the correct category for better visibility.</li>

          <li>✓ Confirm the product is available for sale before publishing.</li>

        </ul>

      </section>

      {/* Product Form */}

      <section className="rounded-3xl border bg-white p-8 shadow-sm">

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-900">
            Product Information
          </h2>

          <p className="mt-2 text-gray-500">
            Complete all required fields before publishing your product.
          </p>

        </div>

        <ProductForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          submitLabel={
            isPending
              ? "Publishing Product..."
              : "Publish Product"
          }
        />

      </section>

      {/* Footer */}

      <section className="mt-10 rounded-3xl border bg-white p-8 text-center shadow-sm">

        <h2 className="text-2xl font-bold">
          Grow Your Farm Business
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Well-presented products with quality images and detailed descriptions
          receive more buyer engagement and increase your chances of making sales.
        </p>

      </section>

    </main>
  );
};

export default CreateProductPage;