import { useQuery } from "@tanstack/react-query";

import { orderService } from "../services/orderService";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],

    queryFn: orderService.getOrders,

    /*
     * Keep order information reasonably fresh.
     *
     * Orders can change while the user is on the page,
     * so we intentionally use a short stale time.
     */
    staleTime: 1000 * 10,

    /*
     * Automatically check for order updates every
     * 15 seconds while the Orders page is active.
     */
    refetchInterval: 1000 * 15,

    /*
     * Refetch immediately when the user returns to
     * the browser/tab.
     */
    refetchOnWindowFocus: true,

    /*
     * Also refetch when the browser reconnects to
     * the internet.
     */
    refetchOnReconnect: true,
  });
};
