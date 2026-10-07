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
  FarmerProfile,
} from "../services/farmerService";

export const usePublishFarmerProfile = (
  onSuccess?: (profile: FarmerProfile) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      farmerService.publishProfile,

    onSuccess: async (profile) => {
      /**
       * The authenticated profile is now published.
       */
      queryClient.setQueryData(
        ["farmer-profile"],
        profile
      );

      /**
       * Public business discovery/detail data may now
       * include this business, so refresh those caches.
       */
      await Promise.all([
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

      toast.success(
        "Your AgricWise business is now published."
      );

      if (onSuccess) {
        onSuccess(profile);
      }
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "AgricWise business publication error:",
          error.response?.data
        );

        const responseData =
          error.response?.data;

        let message =
          "Your business could not be published yet.";

        if (
          responseData &&
          typeof responseData === "object"
        ) {
          const detail =
            (
              responseData as {
                detail?: string;
              }
            ).detail;

          if (detail) {
            message = detail;
          }
        }

        toast.error(message);

        return;
      }

      console.error(
        "Unexpected AgricWise publication error:",
        error
      );

      toast.error(
        "Your business could not be published yet."
      );
    },
  });
};