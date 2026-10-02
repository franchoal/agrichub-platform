import { useEffect, useState } from "react";

import type { FormEvent } from "react";

import type {
  AgriculturalService,
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
} from "../../services/farmerService";

interface AgriculturalServiceFormProps {
  service?: AgriculturalService | null;
  isSubmitting?: boolean;
  onSubmit: (
    data:
      | CreateAgriculturalServiceData
      | UpdateAgriculturalServiceData
  ) => void | Promise<void>;
  onCancel?: () => void;
}

interface FormState {
  name: string;
  description: string;
  location: string;
  price: string;
  price_unit: string;
  is_available: boolean;
}

const initialFormState: FormState = {
  name: "",
  description: "",
  location: "",
  price: "",
  price_unit: "",
  is_available: true,
};

function AgriculturalServiceForm({
  service,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: AgriculturalServiceFormProps) {
  const [form, setForm] =
    useState<FormState>(initialFormState);

  const isEditing = Boolean(service);

  useEffect(() => {
    if (!service) {
      setForm(initialFormState);
      return;
    }

    setForm({
      name: service.name ?? "",
      description: service.description ?? "",
      location: service.location ?? "",
      price: service.price ?? "",
      price_unit: service.price_unit ?? "",
      is_available: service.is_available,
    });
  }, [service]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAvailabilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((current) => ({
      ...current,
      is_available: event.target.checked,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedDescription =
      form.description.trim();
    const trimmedLocation =
      form.location.trim();
    const trimmedPriceUnit =
      form.price_unit.trim();

    if (!trimmedName || !trimmedDescription) {
      return;
    }

    const price =
      form.price.trim() === ""
        ? null
        : form.price.trim();

    if (isEditing) {
      const updateData: UpdateAgriculturalServiceData = {
        name: trimmedName,
        description: trimmedDescription,
        location: trimmedLocation,
        price,
        price_unit: trimmedPriceUnit,
        is_available: form.is_available,
      };

      await onSubmit(updateData);
      return;
    }

    const createData: CreateAgriculturalServiceData = {
      name: trimmedName,
      description: trimmedDescription,
      location: trimmedLocation,
      price,
      price_unit: trimmedPriceUnit,
      is_available: form.is_available,
    };

    await onSubmit(createData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="service-name"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Service Name
        </label>

        <input
          id="service-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Farm Advisory & Expert Consultation"
          disabled={isSubmitting}
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      <div>
        <label
          htmlFor="service-description"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Service Description
        </label>

        <textarea
          id="service-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what this service offers and how it helps agricultural businesses or farmers."
          rows={4}
          disabled={isSubmitting}
          required
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>

      <div>
        <label
          htmlFor="service-location"
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          Service Location
        </label>

        <input
          id="service-location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          placeholder="e.g. Abeokuta, Ogun State"
          disabled={isSubmitting}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        <p className="mt-1.5 text-xs text-gray-500">
          Leave blank if the service is available
          remotely or nationwide.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="service-price"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Starting Price
          </label>

          <input
            id="service-price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            placeholder="Optional"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>

        <div>
          <label
            htmlFor="service-price-unit"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Price Unit
          </label>

          <input
            id="service-price-unit"
            name="price_unit"
            type="text"
            value={form.price_unit}
            onChange={handleChange}
            placeholder="e.g. per acre, per visit"
            disabled={isSubmitting}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-50"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={handleAvailabilityChange}
          disabled={isSubmitting}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />

        <span>
          <span className="block text-sm font-semibold text-gray-800">
            Service is currently available
          </span>

          <span className="mt-1 block text-xs text-gray-500">
            Turn this off when you temporarily stop
            accepting requests for this service.
          </span>
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !form.name.trim() ||
            !form.description.trim()
          }
          className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Adding..."
            : isEditing
              ? "Update Service"
              : "Add Service"}
        </button>
      </div>
    </form>
  );
}

export default AgriculturalServiceForm;