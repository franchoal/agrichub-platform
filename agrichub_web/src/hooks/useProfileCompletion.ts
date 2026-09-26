import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../services/profileService";

export const useProfileCompletion = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};