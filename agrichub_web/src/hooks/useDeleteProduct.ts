import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import { toast } from "react-hot-toast";

import { farmerService } from "../services/farmerService";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      farmerService.deleteProduct(id),

    onSuccess: async () => {
      toast.success(
        "Product deleted successfully!"
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["farmer-products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "public-agricultural-businesses",
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "public-agricultural-business",
          ],
        }),
      ]);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data
        );

        const message =
          typeof error.response?.data ===
          "object"
            ? Object.values(
                error.response.data
              )
                .flat()
                .join("\n")
            : "Failed to delete product.";

        toast.error(message);

        return;
      }

      toast.error(
        "Failed to delete product."
      );
    },
  });
};