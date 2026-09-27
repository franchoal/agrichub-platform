import { api } from "./api";


export interface CheckoutData {
  delivery_address: string;
  payment_method: "card" | "bank_transfer";
}


export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: string;
}


export interface Order {
  id: number;
  buyer: string;
  farmer: string;
  status: string;
  total: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}


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


export interface CheckoutOrderResult {
  order: Order;
  payment: CheckoutPayment;
  delivery: CheckoutDelivery;
}


export interface CheckoutResponse {
  message: string;
  orders: CheckoutOrderResult[];
}


export interface PaginatedOrders {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}


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