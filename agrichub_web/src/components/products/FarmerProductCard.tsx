import { Link } from "react-router-dom";

import type { FarmerProduct } from "../../services/farmerService";

import { Button, Card } from "../ui";

interface FarmerProductCardProps {
  product: FarmerProduct;
  onDelete: (id: number) => void;
}

const FarmerProductCard = ({
  product,
  onDelete,
}: FarmerProductCardProps) => {
  const isInStock =
    product.quantity > 0 && product.is_available;

  return (
    <Card className="group overflow-hidden p-0">
      {/* Product Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100 sm:h-56">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-xl">
              🌾
            </div>

            <span className="text-sm">
              No product image
            </span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm ${
              isInStock
                ? "bg-green-600/95 text-white"
                : "bg-gray-900/80 text-white"
            }`}
          >
            {isInStock ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Category */}
        {product.category_name && (
          <div className="absolute bottom-3 left-3">
            <span className="rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {product.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="space-y-4 p-5">
        {/* Name */}
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-gray-900">
            {product.name}
          </h3>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-green-700">
            Business Product
          </p>
        </div>

        {/* Description */}
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-gray-600">
          {product.description}
        </p>

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-green-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700">
              Selling Price
            </p>

            <p className="mt-1 text-xl font-bold text-green-800">
              ₦{product.price}
            </p>

            <p className="mt-0.5 text-[11px] text-green-600">
              per {product.unit}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              Inventory
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {product.quantity}
            </p>

            <p className="mt-0.5 text-[11px] text-gray-500">
              {product.unit} available
            </p>
          </div>
        </div>

        {/* Status Information */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isInStock ? "bg-green-500" : "bg-gray-400"
              }`}
            />

            <span className="text-sm font-medium text-gray-700">
              {isInStock
                ? "Ready for buyers"
                : "Not currently available"}
            </span>
          </div>

          {!product.is_available && (
            <span className="text-xs text-gray-400">
              Listing disabled
            </span>
          )}

          {product.is_available && product.quantity <= 0 && (
            <span className="text-xs font-medium text-orange-600">
              Out of stock
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <Link
            to={`/farmer/products/${product.id}/edit`}
            className="block"
          >
            <Button className="w-full">
              Edit Product
            </Button>
          </Link>

          <Button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FarmerProductCard;