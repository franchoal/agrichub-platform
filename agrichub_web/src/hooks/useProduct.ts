import { useQuery } from "@tanstack/react-query";

import { productService } from "../services/productService";

export const useProduct = (
  id: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id && enabled,
  });
};