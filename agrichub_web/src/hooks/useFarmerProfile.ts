import { useQuery } from "@tanstack/react-query";

import { farmerService } from "../services/farmerService";

export const useFarmerProfile = () => {
  return useQuery({
    queryKey: ["farmer-profile"],

    queryFn: farmerService.getProfile,

    /**
     * A missing profile is expected for a new AgricWise
     * business/professional account, so don't repeatedly retry.
     */
    retry: false,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    throwOnError: false,

    retryOnMount: false,
  });
};