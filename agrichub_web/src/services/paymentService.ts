import { api } from "./api";

export interface Payment {
  id: number;
  order_id: number;
  buyer: string;
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

export interface PaymentConfirmResponse {
  message: string;
  payment: Payment;
}

export const paymentService = {
  getPayments: async (): Promise<Payment[]> => {
    const response =
      await api.get<Payment[]>("/payments/");

    return response.data;
  },

  getPayment: async (
    id: number
  ): Promise<Payment> => {
    const response =
      await api.get<Payment>(
        `/payments/${id}/`
      );

    return response.data;
  },

  confirmPayment: async (
    id: number
  ): Promise<PaymentConfirmResponse> => {
    const response =
      await api.post<PaymentConfirmResponse>(
        `/payments/${id}/confirm/`
      );

    return response.data;
  },
};