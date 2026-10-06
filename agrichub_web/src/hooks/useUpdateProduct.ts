import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import { toast } from "react-hot-toast";

import {
  farmerService,
  type UpdateFarmerProductData,
} from "../services/farmerService";

interface UpdateProductPayload {
  id: number;
  data: UpdateFarmerProductData;
}

export const useUpdateProduct = (
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: UpdateProductPayload) =>
      farmerService.updateProduct(
        id,
        data
      ),

    onSuccess: async (
      _updatedProduct,
      variables
    ) => {
      toast.success(
        "Product updated successfully."
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
            "farmer-product",
            variables.id,
          ],
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
          error.response?.data?.detail ??
          (typeof error.response?.data ===
          "object"
            ? Object.values(
                error.response.data
              )
                .flat()
                .join("\n")
            : "Unable to update product.");

        toast.error(message);

        return;
      }

      toast.error(
        "Unable to update product."
      );
    },
  });
};