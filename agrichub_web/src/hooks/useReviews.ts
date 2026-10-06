import { useQuery } from "@tanstack/react-query";

import { reviewService } from "../services/reviewService";

export const useReviews = (
  productId: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewService.getReviews(productId),
    enabled: !!productId && enabled,
    staleTime: 1000 * 60 * 5,
  });
};