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
  UpdateFarmerProfileData,
} from "../services/farmerService";

export const useUpdateFarmerProfile = (
  onSuccess?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateFarmerProfileData
    ): Promise<FarmerProfile> => {
      try {
        return await farmerService.updateProfile(
          data
        );
      } catch (error) {
        /**
         * A 404 means the authenticated user does not
         * have an agricultural business profile yet.
         *
         * In that case, create the profile instead.
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

    onSuccess: async (profile) => {
      /**
       * Immediately synchronize the authenticated
       * profile cache with the backend response.
       */
      queryClient.setQueryData(
        ["farmer-profile"],
        profile
      );

      /**
       * The profile is also the source of the public
       * agricultural business identity.
       *
       * Invalidate the public directory and all public
       * business-detail queries so visitors do not
       * continue seeing stale business information.
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
        "AgricWise business profile saved successfully."
      );

      if (onSuccess) {
        onSuccess();
      }
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "AgricWise business profile error:",
          error.response?.data
        );

        const responseData =
          error.response?.data;

        let message =
          "Unable to save AgricWise business profile.";

        if (
          responseData &&
          typeof responseData === "object"
        ) {
          const detail =
            (responseData as {
              detail?: string;
            }).detail;

          if (detail) {
            message = detail;
          }
        }

        toast.error(message);

        return;
      }

      console.error(
        "Unexpected AgricWise business profile error:",
        error
      );

      toast.error(
        "Unable to save AgricWise business profile."
      );
    },
  });
};