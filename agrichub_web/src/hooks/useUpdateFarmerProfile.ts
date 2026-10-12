
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
 * It checks the backend profile state before deciding whether
 * to create a first profile or update an existing profile.
 *
 * Onboarding flow:
 *
 * Step 1: Business Foundation
 *        ↓
 *   saveProfile()
 *        ↓
 * Step 2: Products
 *        ↓
 * Step 3: Services
 *        ↓
 * Step 4: Review
 *        ↓
 *   publishProfile()
 */
export const useUpdateFarmerProfile = (
  onSuccess?: (profile: FarmerProfile) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateFarmerProfileData,
    ): Promise<FarmerProfile> => {
      let profileExists = false;

      try {
        // Check the authenticated user's actual profile state.
        // The backend now returns 404 when no profile exists.
        await farmerService.getProfile();
        profileExists = true;
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          profileExists = false;
        } else {
          // Authentication, authorization, network and server
          // errors must not trigger an attempt to create a profile.
          throw error;
        }
      }

      if (profileExists) {
        // An existing profile must be updated, not duplicated.
        return farmerService.updateProfile(data);
      }

      // No profile exists, so create the user's first draft.
      return farmerService.createProfile(data);
    },

    onSuccess: async (profile) => {
      // Synchronize the authenticated profile cache immediately.
      queryClient.setQueryData(
        ["farmer-profile"],
        profile,
      );

      // Refresh public business data where relevant.
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
        "AgricWise business profile saved successfully.",
      );

      // The onboarding page remains responsible for navigation.
      // Saving a profile does not publish the business.
      onSuccess?.(profile);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "AgricWise business profile error:",
          error.response?.data ?? error.message,
        );

        const responseData = error.response?.data;

        let message =
          "Unable to save AgricWise business profile.";

        if (
          responseData &&
          typeof responseData === "object"
        ) {
          const detail = (
            responseData as {
              detail?: string;
            }
          ).detail;

          if (detail) {
            message = detail;
          } else if (error.response?.status === 401) {
            message =
              "Your session has expired. Please sign in again.";
          } else if (error.response?.status === 403) {
            message =
              "You do not have permission to perform this action.";
          } else if (error.response?.status === 400) {
            message =
              "Some business details are invalid. Please review the form.";
          }
        } else if (!error.response) {
          message =
            "Unable to reach AgricWise. Check your connection and try again.";
        }

        toast.error(message);
        return;
      }

      console.error(
        "Unexpected AgricWise business profile error:",
        error,
      );

      toast.error(
        "Unable to save AgricWise business profile.",
      );
    },
  });
};
