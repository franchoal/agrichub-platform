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

/**
 * Saves the authenticated user's AgricWise business foundation.
 *
 * This mutation intentionally does NOT publish the business.
 *
 * Onboarding flow:
 *
 * Step 1
 *   Business Foundation
 *        ↓
 *   saveProfile()
 *        ↓
 * Step 2 Products
 *        ↓
 * Step 3 Services
 *        ↓
 * Step 4 Review
 *        ↓
 *   publishProfile()
 */
export const useUpdateFarmerProfile = (
  onSuccess?: (profile: FarmerProfile) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateFarmerProfileData
    ): Promise<FarmerProfile> => {
      try {
        return await farmerService.updateProfile(data);
      } catch (error) {
        /**
         * A 404 means the authenticated user does not
         * have an agricultural business profile yet.
         *
         * For the onboarding foundation step, creating
         * the profile is the correct fallback.
         */
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          return farmerService.createProfile(data);
        }

        throw error;
      }
    },

    onSuccess: async (profile) => {
      /**
       * Keep the authenticated business profile cache
       * synchronized immediately.
       */
      queryClient.setQueryData(
        ["farmer-profile"],
        profile
      );

      /**
       * The profile is also the source of the public
       * agricultural business identity.
       *
       * Invalidate public business queries so updated
       * information can be reflected wherever relevant.
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

      /**
       * The onboarding page decides what happens next.
       *
       * We deliberately do NOT automatically navigate
       * to the farmer dashboard here.
       */
      if (onSuccess) {
        onSuccess(profile);
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
        "Unexpected AgricWise business profile error:",
        error
      );

      toast.error(
        "Unable to save AgricWise business profile."
      );
    },
  });
};