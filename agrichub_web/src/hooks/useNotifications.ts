import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../services/notificationService";
import { useAuthStore } from "../store/authStore";

interface UseNotificationsOptions {
  enabled?: boolean;
}

export const useNotifications = (
  options?: UseNotificationsOptions
) => {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  return useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
};
