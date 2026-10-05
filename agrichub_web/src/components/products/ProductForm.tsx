import { useEffect, useState } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ImagePlus,
  Package,
  Trash2,
} from "lucide-react";

import {
  productSchema,
  type ProductFormData,
  type ProductFormInput,
} from "../../validators/productSchemas";

import { useCategories } from "../../hooks/useCategories";

interface ProductFormProps {
  initialValues?: Partial<ProductFormInput>;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "bag", label: "Bag" },
  { value: "basket", label: "Basket" },
  { value: "crate", label: "Crate" },
  { value: "bunch", label: "Bunch" },
  { value: "piece", label: "Piece" },
  { value: "ton", label: "Ton" },
] as const;

const ProductForm = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Product",
}: ProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: initialValues?.category ?? undefined,
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price ?? undefined,
      quantity: initialValues?.quantity ?? undefined,
      unit: initialValues?.unit ?? "kg",
      is_available: initialValues?.is_available ?? true,
      image: initialValues?.image ?? null,
    },
  });

  const selectedImage = watch("image");

  useEffect(() => {
    if (!selectedImage || !(selectedImage instanceof File)) {
      setImagePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setValue("image", file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!file) {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setValue("image", null, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setImagePreview(null);
  };

  const onValid = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onValid)}
      className="space-y-6"
    >
      {/* =========================================================
          PRODUCT IDENTITY
      ========================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
            <Package size={20} />
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Product identity
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Tell buyers what you are offering and where it belongs in
              the agricultural value chain.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Agricultural category
            </label>

            <select
              id="category"
              {...register("category")}
              disabled={categoriesLoading || categoriesError}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {categoriesLoading
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {categoriesError && (
              <p className="mt-2 text-sm text-red-600">
                Unable to load agricultural categories.
              </p>
            )}

            {errors.category?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.category.message)}
              </p>
            )}
          </div>

          {/* Product name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product name
            </label>

            <input
              id="name"
              type="text"
              placeholder="e.g. Improved Maize Seeds"
              {...register("name")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            {errors.name?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.name.message)}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Product description
            </label>

            <textarea
              id="description"
              rows={5}
              placeholder="Describe the product, quality, intended use, variety, or other useful information for buyers."
              {...register("description")}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            {errors.description?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.description.message)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          PRICING & INVENTORY
      ========================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Pricing & inventory
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Help buyers understand your pricing and current stock
            availability.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                ₦
              </span>

              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...register("price")}
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            {errors.price?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.price.message)}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Available quantity
            </label>

            <input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 100"
              {...register("quantity")}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            {errors.quantity?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.quantity.message)}
              </p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="unit"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Quantity unit
            </label>

            <select
              id="unit"
              {...register("unit")}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              {UNIT_OPTIONS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>

            {errors.unit?.message && (
              <p className="mt-2 text-sm text-red-600">
                {String(errors.unit.message)}
              </p>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-end">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <input
                type="checkbox"
                {...register("is_available")}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />

              <span>
                <span className="block text-sm font-medium text-gray-800">
                  Available for purchase
                </span>

                <span className="block text-xs text-gray-500">
                  Buyers can discover and enquire about this product.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRODUCT PRESENTATION
      ========================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900">
            Product presentation
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add a clear product image to help buyers understand what
            you are offering.
          </p>
        </div>

        <Controller
          name="image"
          control={control}
          render={() => (
            <div>
              {imagePreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-64 w-full object-cover sm:h-80"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-red-600 shadow-sm transition hover:bg-white"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="product-image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition hover:border-green-500 hover:bg-green-50/40"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
                    <ImagePlus size={22} />
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    Add a product image
                  </span>

                  <span className="mt-1 text-xs text-gray-500">
                    Use a clear image that accurately represents your
                    product.
                  </span>

                  <span className="mt-4 inline-flex items-center rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white">
                    Choose Image
                  </span>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        />

        {errors.image?.message && (
          <p className="mt-2 text-sm text-red-600">
            {String(errors.image.message)}
          </p>
        )}
      </section>

      {/* =========================================================
          SUBMIT
      ========================================================= */}
      <section className="rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-green-700"
            />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                Ready to publish your listing?
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Your product will become part of your AgricWise
                business presence and marketplace inventory.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </section>
    </form>
  );
};

export default ProductForm;