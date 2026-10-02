import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AgriculturalService,
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
} from "../services/farmerService";

import { farmerService } from "../services/farmerService";

export const AGRICULTURAL_SERVICES_QUERY_KEY = [
  "agricultural-services",
];

export const useAgriculturalServices = () => {
  return useQuery<AgriculturalService[]>({
    queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
    queryFn: farmerService.getMyServices,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useCreateAgriculturalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateAgriculturalServiceData
    ) => farmerService.createService(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
      });
    },
  });
};

export const useUpdateAgriculturalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAgriculturalServiceData;
    }) =>
      farmerService.updateService(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
      });
    },
  });
};

export const useDeleteAgriculturalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      farmerService.deleteService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
      });
    },
  });
};