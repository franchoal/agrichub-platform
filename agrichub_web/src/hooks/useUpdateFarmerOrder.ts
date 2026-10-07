import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  orderService,
  type UpdateOrderStatusData,
} from "../services/orderService";

export const useUpdateFarmerOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusData;
    }) =>
      orderService.updateFarmerOrderStatus(
        id,
        data
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["farmer-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "farmer-order",
          variables.id,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};