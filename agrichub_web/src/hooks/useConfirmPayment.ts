
import { useMutation } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";

export interface PaystackInitializationResponse {
  reference: string;
  authorization_url: string;
  access_code?: string;
}

/**
 * Starts Paystack checkout for a pending payment.
 * Payment success must be verified by the backend.
 */
export const useConfirmPayment = () => {
  return useMutation<PaystackInitializationResponse, Error, number>({
    mutationFn: async (paymentId: number) => {
      if (!Number.isSafeInteger(paymentId) || paymentId <= 0) {
        throw new Error("A valid payment ID is required.");
      }

      return paymentService.initializePaystack([paymentId]);
    },
  });
};
