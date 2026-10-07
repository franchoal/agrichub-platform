import { api } from "./api";


/*
======================================================
CHECKOUT
======================================================
*/

export interface CheckoutData {
  delivery_address: string;
  payment_method: "card" | "bank_transfer";
}


/*
======================================================
ORDER ITEMS
======================================================
*/

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}


/*
======================================================
ORDER PAYMENT
======================================================
*/

export interface OrderPayment {
  id: number;
  method: "card" | "bank_transfer";
  status:
    | "pending"
    | "successful"
    | "failed"
    | "refunded";
  amount: string;
  created_at: string;
  updated_at: string;
}


/*
======================================================
ORDER DELIVERY
======================================================
*/

export interface OrderDelivery {
  id: number;
  address: string;
  status:
    | "pending"
    | "assigned"
    | "picked_up"
    | "in_transit"
    | "delivered";
  tracking_number: string | null;
}


/*
======================================================
ORDER
======================================================
*/

export interface Order {
  id: number;
  buyer: string;
  farmer: string;
  status: string;
  total: string;
  items: OrderItem[];
  payment: OrderPayment | null;
  delivery: OrderDelivery | null;
  created_at: string;
  updated_at: string;
}


/*
======================================================
CHECKOUT PAYMENT
======================================================
*/

export interface CheckoutPayment {
  id: number;
  method: "card" | "bank_transfer";
  status:
    | "pending"
    | "successful"
    | "failed"
    | "refunded";
  amount: string;
}


/*
======================================================
CHECKOUT DELIVERY
======================================================
*/

export interface CheckoutDelivery {
  id: number;
  address: string;
  status:
    | "pending"
    | "assigned"
    | "picked_up"
    | "in_transit"
    | "delivered";
  tracking_number: string | null;
}


/*
======================================================
CHECKOUT ORDER RESULT
======================================================
*/

export interface CheckoutOrderResult {
  order: Order;
  payment: CheckoutPayment;
  delivery: CheckoutDelivery;
}


/*
======================================================
CHECKOUT RESPONSE
======================================================
*/

export interface CheckoutResponse {
  message: string;
  orders: CheckoutOrderResult[];
}


/*
======================================================
PAGINATED ORDERS
======================================================
*/

export interface PaginatedOrders {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}


/*
======================================================
FARMER ORDER STATUS UPDATE
======================================================
*/

export interface UpdateOrderStatusData {
  status:
    | "accepted"
    | "processing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "completed"
    | "cancelled";
}


/*
======================================================
ORDER SERVICE
======================================================
*/

export const orderService = {

  /*
  ==========================================
  BUYER
  ==========================================
  */

  checkout: async (
    data: CheckoutData
  ): Promise<CheckoutResponse> => {

    const response =
      await api.post<CheckoutResponse>(
        "/orders/checkout/",
        data
      );

    return response.data;
  },


  getOrders: async (): Promise<PaginatedOrders> => {

    const response =
      await api.get<PaginatedOrders>(
        "/orders/"
      );

    return response.data;
  },


  getOrder: async (
    id: number
  ): Promise<Order> => {

    const response =
      await api.get<Order>(
        `/orders/${id}/`
      );

    return response.data;
  },


  /*
  ==========================================
  FARMER
  ==========================================
  */

  getFarmerOrders:
    async (): Promise<PaginatedOrders> => {

      const response =
        await api.get<PaginatedOrders>(
          "/orders/farmer/"
        );

      return response.data;
    },


  getFarmerOrder:
    async (
      id: number
    ): Promise<Order> => {

      const response =
        await api.get<Order>(
          `/orders/farmer/${id}/`
        );

      return response.data;
    },


  updateFarmerOrderStatus:
    async (
      id: number,
      data: UpdateOrderStatusData
    ): Promise<Order> => {

      const response =
        await api.patch<Order>(
          `/orders/farmer/${id}/`,
          data
        );

      return response.data;
    },

};