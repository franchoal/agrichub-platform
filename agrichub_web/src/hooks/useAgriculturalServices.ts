import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  farmerService,
} from "../services/farmerService";

import type {
  AgriculturalService,
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
  PublicAgriculturalBusinessDetail,
  PublicAgriculturalBusinessesParams,
  PaginatedPublicAgriculturalBusinesses,
} from "../services/farmerService";


/* =========================================================
   QUERY KEYS
========================================================= */

export const AGRICULTURAL_SERVICES_QUERY_KEY = [
  "agricultural-services",
];


/* =========================================================
   PUBLIC AGRICULTURAL BUSINESS QUERY KEYS
========================================================= */

export const PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY = [
  "public-agricultural-businesses",
];

export const PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY = [
  "public-agricultural-business",
];


/* =========================================================
   MY AGRICULTURAL SERVICES
========================================================= */

export const useAgriculturalServices = () => {
  return useQuery<AgriculturalService[]>({
    queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
    queryFn: farmerService.getMyServices,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};


/* =========================================================
   CREATE AGRICULTURAL SERVICE
========================================================= */

export const useCreateAgriculturalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateAgriculturalServiceData
    ) => farmerService.createService(data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY,
        }),
      ]);
    },
  });
};


/* =========================================================
   UPDATE AGRICULTURAL SERVICE
========================================================= */

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
      farmerService.updateService(
        id,
        data
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY,
        }),
      ]);
    },
  });
};


/* =========================================================
   DELETE AGRICULTURAL SERVICE
========================================================= */

export const useDeleteAgriculturalService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      id: number
    ) =>
      farmerService.deleteService(id),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: AGRICULTURAL_SERVICES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
        }),

        queryClient.invalidateQueries({
          queryKey: PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY,
        }),
      ]);
    },
  });
};


/* =========================================================
   PUBLIC AGRICULTURAL BUSINESS DIRECTORY
=========================================================

   Backend-driven discovery.

   Supported parameters:

   ?search=<term>
   ?category=<category-slug>
   ?verified=true
   ?verified=false
   ?page=<page>

   The backend performs the actual filtering and pagination.
========================================================= */

export const usePublicAgriculturalBusinesses = (
  params: PublicAgriculturalBusinessesParams = {}
) => {
  const normalizedSearch =
    params.search?.trim() ?? "";

  const normalizedCategory =
    params.category?.trim() ?? "";

  const normalizedPage =
    params.page && params.page > 0
      ? params.page
      : 1;

  return useQuery<PaginatedPublicAgriculturalBusinesses>({
    queryKey: [
      ...PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
      {
        search: normalizedSearch,
        category: normalizedCategory,
        verified: params.verified ?? "",
        page: normalizedPage,
      },
    ],

    queryFn: () =>
      farmerService.getPublicBusinesses({
        search:
          normalizedSearch || undefined,

        category:
          normalizedCategory || undefined,

        verified:
          params.verified,

        page:
          normalizedPage,
      }),

    staleTime: 1000 * 60 * 5,

    placeholderData:
      (previousData) =>
        previousData,
  });
};


/* =========================================================
   PUBLIC AGRICULTURAL BUSINESS DETAIL
=========================================================

   Business profiles themselves are public.

   This hook therefore remains usable for guests.

   The business identifier may be either:

   - A numeric legacy business ID
   - A human-readable business slug

   The identifier is intentionally preserved exactly as
   supplied so the backend can resolve both formats.

   `enabled` is provided so callers can explicitly control
   whether the request should run, which is useful when a
   route depends on another piece of state being hydrated.
========================================================= */

export const usePublicAgriculturalBusiness = (
  identifier: string | number | undefined,
  enabled = true
) => {
  const normalizedIdentifier =
    typeof identifier === "string"
      ? identifier.trim()
      : identifier;

  const isValidIdentifier =
    typeof normalizedIdentifier === "number"
      ? Number.isInteger(normalizedIdentifier) &&
        normalizedIdentifier > 0
      : Boolean(normalizedIdentifier);

  return useQuery<PublicAgriculturalBusinessDetail>({
    queryKey: [
      ...PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY,
      normalizedIdentifier,
    ],

    queryFn: () =>
      farmerService.getPublicBusiness(
        normalizedIdentifier as string | number
      ),

    enabled:
      enabled && isValidIdentifier,

    staleTime: 1000 * 60 * 5,
  });
};


/* =========================================================
   PUBLIC BUSINESS CACHE HELPERS
========================================================= */

/**
 * Invalidates the public agricultural business directory
 * and all public business detail queries.
 *
 * Useful after a product/service/profile mutation changes
 * what is publicly visible about a business.
 */
export const invalidatePublicAgriculturalBusinessQueries = async (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey:
        PUBLIC_AGRICULTURAL_BUSINESSES_QUERY_KEY,
    }),

    queryClient.invalidateQueries({
      queryKey:
        PUBLIC_AGRICULTURAL_BUSINESS_QUERY_KEY,
    }),
  ]);
};