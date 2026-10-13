
export interface CartItem {
  id: number;

  product: number;

  product_name: string;

  product_price: string;

  product_image: string | null;

  quantity: number;

  subtotal: string;
}

export interface Cart {
  id: number;

  items: CartItem[];

  total: string;

  created_at: string;

  updated_at: string;
}

export interface AddToCartData {
  product: number;

  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
