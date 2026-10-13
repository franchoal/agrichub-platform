
import { useState } from "react";
import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react";

import { Button, Card } from "../ui";

import type { CartItem as CartItemType } from "../../types/cart";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const productImage = item.product_image?.trim();

  return (
    <Card className="rounded-3xl border border-gray-100 p-4 shadow-sm transition duration-300 hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start lg:items-center">
        {/* Product Image */}
        <div className="flex h-36 w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-green-100 sm:h-28 sm:w-28">
          {productImage && !imageFailed ? (
            <img
              src={productImage}
              alt={item.product_name}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <ShoppingBasket
              size={38}
              aria-hidden="true"
              className="text-green-700"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            Farm Produce
          </p>

          <h2 className="mt-2 break-words text-lg font-bold text-gray-900 sm:text-xl">
            {item.product_name}
          </h2>

          <p className="mt-3 text-sm text-gray-500">Unit Price</p>

          <p className="mt-1 text-xl font-extrabold text-green-700 sm:text-2xl">
            ₦{Number(item.product_price).toLocaleString("en-NG")}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Quantity
          </span>

          <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.product_name}`}
              className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus size={16} />
            </button>

            <div className="flex h-10 min-w-12 items-center justify-center border-x border-gray-200 px-2 text-sm font-bold">
              {item.quantity}
            </div>

            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.id, item.quantity + 1)
              }
              aria-label={`Increase quantity of ${item.product_name}`}
              className="flex h-10 w-10 items-center justify-center transition hover:bg-gray-100"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Subtotal and Remove */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4 sm:min-w-36 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>

            <h3 className="mt-1 text-xl font-extrabold text-green-700 sm:text-2xl">
              ₦{Number(item.subtotal).toLocaleString("en-NG")}
            </h3>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
