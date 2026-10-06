import {
  Edit3,
  MapPin,
  Trash2,
} from "lucide-react";

import type {
  AgriculturalService,
} from "../../services/farmerService";

interface AgriculturalServiceCardProps {
  service: AgriculturalService;
  onEdit: (service: AgriculturalService) => void;
  onDelete: (service: AgriculturalService) => void;
  isDeleting?: boolean;
}

function AgriculturalServiceCard({
  service,
  onEdit,
  onDelete,
  isDeleting = false,
}: AgriculturalServiceCardProps) {
  const numericPrice =
    service.price !== null
      ? Number(service.price)
      : null;

  const formattedPrice =
    numericPrice !== null &&
    Number.isFinite(numericPrice)
      ? `₦${numericPrice.toLocaleString()}`
      : null;

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-base font-bold text-gray-900">
              {service.name}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                service.is_available
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {service.is_available
                ? "Available"
                : "Unavailable"}
            </span>
          </div>

          {service.location && (
            <div className="mt-2 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
              <MapPin
                size={14}
                className="shrink-0"
              />

              <span className="truncate">
                {service.location}
              </span>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(service)}
            disabled={isDeleting}
            aria-label={`Edit ${service.name}`}
            title="Edit service"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit3 size={16} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(service)}
            disabled={isDeleting}
            aria-label={`Delete ${service.name}`}
            title="Delete service"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6 text-gray-600">
        {service.description}
      </p>

      {formattedPrice && (
        <div className="mt-4 flex flex-wrap items-baseline gap-1">
          <span className="text-sm font-bold text-gray-900">
            {formattedPrice}
          </span>

          {service.price_unit && (
            <span className="text-xs text-gray-500">
              / {service.price_unit}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export default AgriculturalServiceCard;