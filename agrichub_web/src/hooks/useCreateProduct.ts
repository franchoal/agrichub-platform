import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import { toast } from "react-hot-toast";

import {
  farmerService,
  type CreateFarmerProductData,
} from "../services/farmerService";

export const useCreateProduct = (
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateFarmerProductData
    ) =>
      farmerService.createProduct(data),

    onSuccess: async () => {
      toast.success(
        "Product created successfully!"
      );

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["farmer-products"],
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

      onSuccess?.();
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
            : "Failed to create product.";

        toast.error(message);

        return;
      }

      toast.error(
        "Failed to create product."
      );
    },
  });
};