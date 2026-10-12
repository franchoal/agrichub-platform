
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { farmerService } from "../services/farmerService";

export const useFarmerProfile = () => {
  return useQuery({
    queryKey: ["farmer-profile"],

    queryFn: farmerService.getProfile,

    /**
     * A new user may not have created a business profile yet.
     * Do not repeatedly retry failed profile requests.
     *
     * A 404 is handled by the onboarding flow.
     * Other errors remain available to the UI so that
     * genuine API failures are not mistaken for missing profiles.
     */
    retry: false,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    throwOnError: false,

    retryOnMount: false,

    /**
     * Keep the distinction between a missing profile and
     * other errors available through the query's error state.
     */
    meta: {
      purpose: "authenticated-agricultural-business-profile",
      missingProfileStatus: 404,
    },
  });
};

/**
 * Reusable check for components that need to distinguish
 * an expected missing profile from other request failures.
 */
export const isMissingFarmerProfile = (
  error: unknown,
): boolean => {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 404
  );
};
