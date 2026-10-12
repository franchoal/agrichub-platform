import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";
import { toast } from "react-hot-toast";

import { farmerService } from "../services/farmerService";

import type {
  FarmerProfile,
  UpdateFarmerProfileData,
} from "../services/farmerService";

/**
 * Saves the authenticated user's AgricWise business profile.
 *
 * The backend remains responsible for authentication,
 * authorization, and profile ownership.
 *
 * A fresh profile lookup determines whether to create or update.
 * Only an explicit 404 permits creation.
 *
 * Saving does not publish or verify the business.
 */
export const useUpdateFarmerProfile = (
  onSuccess?: (profile: FarmerProfile) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateFarmerProfileData,
    ): Promise<FarmerProfile> => {
      try {
        // Check the authenticated user's current profile.
        await farmerService.getProfile();

        // An existing profile must be updated, not duplicated.
        return await farmerService.updateProfile(data);
      } catch (error: unknown) {
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          // Create only when the backend explicitly confirms
          // that the authenticated user has no profile.
          return farmerService.createProfile(data);
        }

        // Never interpret 401, 403, network errors, or server
        // failures as evidence that a profile is missing.
        throw error;
      }
    },

    onSuccess: async (profile) => {
      // Update the authenticated profile cache immediately.
      queryClient.setQueryData(
        ["farmer-profile"],
        profile,
      );

      // Refresh public business directory data.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["public-agricultural-businesses"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["public-agricultural-business"],
        }),
      ]);

      toast.success(
        "AgricWise business profile saved successfully.",
      );

      // The onboarding form remains responsible for navigation.
      onSuccess?.(profile);
    },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "AgricWise business profile error:",
          error.response?.data ?? error.message,
        );

        const responseData = error.response?.data as
          | {
              detail?: string;
            }
          | undefined;

        let message =
          "Unable to save your AgricWise business profile.";

        if (responseData?.detail) {
          message = responseData.detail;
        } else if (error.response?.status === 401) {
          message =
            "Your session has expired. Please sign in again.";
        } else if (error.response?.status === 403) {
          message =
            "You do not have permission to perform this action.";
        } else if (error.response?.status === 400) {
          message =
            "Some business details are invalid. Please review the form.";
        } else if (error.response?.status === 404) {
          message =
            "Your business profile endpoint could not be found. Please contact support if the problem continues.";
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
        error instanceof Error
          ? error.message
          : "Unable to save your AgricWise business profile.",
      );
    },
  });
};
