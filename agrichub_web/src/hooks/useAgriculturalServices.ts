import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AgriculturalService,
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
  PaginatedPublicAgriculturalBusinesses,
  PublicAgriculturalBusinessDetail,
} from "../services/farmerService";

import { farmerService } from "../services/farmerService";

/* =========================================================
   Agricultural Services
========================================================= */

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
    }) => farmerService.updateService(id, data),

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

/* =========================================================
   Public Agricultural Business Directory
========================================================= */

export const PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY = [
  "public-agricultural-businesses",
];

export const usePublicAgriculturalBusinesses = () => {
  return useQuery<PaginatedPublicAgriculturalBusinesses>({
    queryKey: PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
    queryFn: farmerService.getPublicBusinesses,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

/* =========================================================
   Public Agricultural Business Detail
========================================================= */

export const publicAgriculturalBusinessQueryKey = (
  id: number
) => [
  "public-agricultural-business",
  id,
];

export const usePublicAgriculturalBusiness = (
  id: number
) => {
  return useQuery<PublicAgriculturalBusinessDetail>({
    queryKey: publicAgriculturalBusinessQueryKey(id),
    queryFn: () => farmerService.getPublicBusiness(id),
    enabled: Number.isFinite(id) && id > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};