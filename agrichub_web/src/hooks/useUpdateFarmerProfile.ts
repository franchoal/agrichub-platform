import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";

import { toast } from "react-hot-toast";

import {
  farmerService,
} from "../services/farmerService";

import type {
  UpdateFarmerProfileData,
} from "../services/farmerService";

export const useUpdateFarmerProfile = (
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateFarmerProfileData
    ) => {
      try {
        return await farmerService.updateProfile(
          data
        );
      } catch (error) {
        /**
         * If the agricultural business profile
         * doesn't exist yet, create it instead.
         */
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          return farmerService.createProfile(
            data
          );
        }

        throw error;
      }
    },

    onSuccess: () => {
      toast.success(
        "AgricWise business profile saved successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["farmer-profile"],
      });

      if (onSuccess) {
        onSuccess();
      }
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          error.response?.data
        );

        const message =
          error.response?.data?.detail ||
          "Unable to save AgricWise business profile.";

        toast.error(message);

        return;
      }

      toast.error(
        "Unable to save AgricWise business profile."
      );
    },
  });
};