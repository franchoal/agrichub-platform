import { api } from "./api";

export interface Payment {
  id: number;
  order_id: number;
  buyer: string;
  method: "card" | "bank_transfer";
  status: "pending" | "successful" | "failed" | "refunded";
  amount: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentConfirmResponse {
  message: string;
  payment: Payment;
}

export interface PaystackInitializeResponse {
  message: string;
  reference: string;
  authorization_url: string;
  access_code?: string;
}

export interface PaystackVerifyResponse {
  message?: string;
  payments: Payment[];
}

export const paymentService = {
  getPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>("/payments/");

    return response.data;
  },

  getPayment: async (id: number): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}/`);

    return response.data;
  },

  /**
   * Initialize one Paystack transaction for all payments
   * belonging to the current buyer's checkout.
   */
  initializePaystack: async (
    paymentIds: number[],
  ): Promise<PaystackInitializeResponse> => {
    if (paymentIds.length === 0) {
      throw new Error("At least one payment is required.");
    }

    const response = await api.post<PaystackInitializeResponse>(
      "/payments/paystack/initialize/",
      {
        payment_ids: [...new Set(paymentIds)],
      },
    );

    return response.data;
  },

  /**
   * Ask the backend to verify the Paystack reference.
   * The backend, not the frontend, determines payment status.
   */
  verifyPaystack: async (
    reference: string,
  ): Promise<PaystackVerifyResponse> => {
    const normalizedReference = reference.trim();

    if (!normalizedReference) {
      throw new Error("A Paystack transaction reference is required.");
    }

    const response = await api.post<PaystackVerifyResponse>(
      "/payments/paystack/verify/",
      {
        reference: normalizedReference,
      },
    );

    return response.data;
  },

  /**
   * Retained for compatibility with existing callers.
   * The backend currently disables direct client-side confirmation.
   * Use verifyPaystack() for Paystack transactions instead.
   */
  confirmPayment: async (
    id: number,
  ): Promise<PaymentConfirmResponse> => {
    const response = await api.post<PaymentConfirmResponse>(
      `/payments/${id}/confirm/`,
    );

    return response.data;
  },
};