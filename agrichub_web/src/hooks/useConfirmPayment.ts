import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  paymentService,
} from "../services/paymentService";

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: number) =>
      paymentService.confirmPayment(paymentId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
};