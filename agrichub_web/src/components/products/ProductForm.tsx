import { useState } from "react";

import {
  useForm,
  Controller,
  type FieldErrors,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormInput,
  type ProductFormData,
} from "../../validators/productSchemas";

import { useCategories } from "../../hooks/useCategories";

import {
  Button,
  Input,
} from "../ui";

interface ProductFormProps {
  onSubmit: (
    data: ProductFormData
  ) => void;

  isSubmitting?: boolean;

  initialValues?: Partial<ProductFormData>;

  submitLabel?: string;
}

const ProductForm = ({
  onSubmit,
  isSubmitting = false,
  initialValues,
  submitLabel = "Save Product",
}: ProductFormProps) => {

  const {
    data: categories,
    isLoading: categoriesLoading,
  } = useCategories();

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      is_available: true,
      ...initialValues,
    },
  });

  const onValid = (
    data: ProductFormInput
  ) => {

    console.log("RAW FORM DATA");
    console.log(data);

    const parsedData =
      productSchema.parse(data);

    console.log("VALIDATED DATA");
    console.log(parsedData);

    onSubmit(parsedData);

  };

  const onInvalid = (
    errors: FieldErrors<ProductFormInput>
  ) => {

    console.log("FORM ERRORS");
    console.log(errors);

  };

  return (

    <form
      onSubmit={handleSubmit(
        onValid,
        onInvalid
      )}
      className="space-y-6"
    >

      {/* Category */}

      <div>

        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          {...register("category")}
          disabled={categoriesLoading}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none"
        >

          <option value="">
            Select Category
          </option>

          {categories?.map((category) => (

            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>

          ))}

        </select>

        {errors.category && (

          <p className="mt-1 text-sm text-red-500">
            {errors.category.message}
          </p>

        )}

      </div>

      {/* Product Name */}

      <Input
        label="Product Name"
        placeholder="Fresh Tomatoes"
        {...register("name")}
        error={errors.name?.message}
      />

      {/* Description */}

      <div>

        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          rows={5}
          {...register("description")}
          placeholder="Describe your product..."
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none"
        />

        {errors.description && (

          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>

        )}

      </div>

      {/* Price */}

      <Input
        type="number"
        label="Price (₦)"
        placeholder="2500"
        {...register("price")}
        error={errors.price?.message}
      />

      {/* Quantity */}

      <Input
        type="number"
        label="Quantity"
        placeholder="100"
        {...register("quantity")}
        error={errors.quantity?.message}
      />

      {/* Unit */}

      <div>

        <label className="mb-2 block text-sm font-medium">
          Unit
        </label>

        <select
          {...register("unit")}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-green-600 focus:outline-none"
        >

          <option value="">
            Select Unit
          </option>

          <option value="kg">
            Kilogram (kg)
          </option>

          <option value="bag">
            Bag
          </option>

          <option value="basket">
            Basket
          </option>

          <option value="crate">
            Crate
          </option>

          <option value="bunch">
            Bunch
          </option>

          <option value="piece">
            Piece
          </option>

          <option value="ton">
            Ton
          </option>

        </select>

        {errors.unit && (

          <p className="mt-1 text-sm text-red-500">
            {errors.unit.message}
          </p>

        )}

      </div>

      {/* Availability */}

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

        <label className="flex cursor-pointer items-start gap-3">

          <input
            type="checkbox"
            {...register("is_available")}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />

          <div>

            <p className="font-medium text-gray-900">
              Available for sale
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Keep this enabled when buyers can currently order
              this product. Disable it temporarily when the product
              is not available for sale.
            </p>

          </div>

        </label>

      </div>

      {/* Product Image */}

      <Controller
        control={control}
        name="image"
        render={({ field }) => (

          <div>

            <label className="mb-2 block text-sm font-medium">
              Product Image
            </label>

            <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 transition hover:border-green-500">

              <input
                type="file"
                accept="image/*"
                onChange={(event) => {

                  const file =
                    event.target.files?.[0] ?? null;

                  field.onChange(file);

                  if (file) {

                    setImagePreview(
                      URL.createObjectURL(file)
                    );

                  } else {

                    setImagePreview(null);

                  }

                }}
              />

              <p className="mt-3 text-sm text-gray-500">
                JPG, PNG or WEBP
              </p>

            </div>

            {imagePreview && (

              <div className="mt-5">

                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-56 w-full rounded-xl border object-cover"
                />

                <button
                  type="button"
                  onClick={() => {

                    field.onChange(null);

                    setImagePreview(null);

                  }}
                  className="mt-4 rounded-lg border border-red-500 px-5 py-2 text-red-600 transition hover:bg-red-50"
                >
                  Remove Image
                </button>

              </div>

            )}

          </div>

        )}
      />

      <div className="border-t pt-6">

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving Product..."
            : submitLabel}
        </Button>

      </div>

    </form>

  );

};

export default ProductForm;