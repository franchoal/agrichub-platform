import { api } from "./api";

/* ==============================
   Agricultural Category Types
============================== */

export interface AgriculturalCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface PaginatedAgriculturalCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgriculturalCategory[];
}

/* ==============================
   Farmer / Agricultural Business
   Profile Types
============================== */

export interface FarmerProfile {
  id: number;
  farm_name: string;
  farm_location: string;
  farm_description: string;
  business_categories: AgriculturalCategory[];
  is_verified: boolean;
}

export interface CreateFarmerProfileData {
  farm_name: string;
  farm_location: string;
  farm_description: string;
  category_ids: number[];
}

export interface UpdateFarmerProfileData {
  farm_name: string;
  farm_location: string;
  farm_description: string;
  category_ids: number[];
}

/* ==============================
   Agricultural Service Types
============================== */

export interface AgriculturalService {
  id: number;
  business: number;
  business_name: string;
  name: string;
  description: string;
  location: string;
  price: string | null;
  price_unit: string;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgriculturalServiceData {
  name: string;
  description: string;
  location?: string;
  price?: string | null;
  price_unit?: string;
  is_available?: boolean;
}

export interface UpdateAgriculturalServiceData {
  name?: string;
  description?: string;
  location?: string;
  price?: string | null;
  price_unit?: string;
  is_available?: boolean;
}

/* ==============================
   Product Types
============================== */

export interface FarmerProduct {
  id: number;
  category: number;
  category_name: string;
  name: string;
  description: string;
  price: string;
  quantity: number;
  unit: string;
  image: string | null;
  is_available: boolean;
}

/* ==============================
   Paginated Farmer Products
============================== */

export interface PaginatedFarmerProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: FarmerProduct[];
}

export interface CreateFarmerProductData {
  category: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  is_available: boolean;
  image?: File | null;
}

export interface UpdateFarmerProductData {
  category?: number;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  is_available?: boolean;
  image?: File | null;
}

/* ==============================
   Agricultural Services Response
============================== */

export interface PaginatedAgriculturalServices {
  count: number;
  next: string | null;
  previous: string | null;
  results: AgriculturalService[];
}

/* ==============================
   Farmer Service
============================== */

export const farmerService = {
  /**
   * ==============================
   * Agricultural Categories
   * ==============================
   */

  getCategories: async (): Promise<AgriculturalCategory[]> => {
    const response =
      await api.get<PaginatedAgriculturalCategories>(
        "/farmers/categories/"
      );

    return response.data.results;
  },

  /**
   * ==============================
   * Agricultural Business Profile
   * ==============================
   */

  getProfile: async (): Promise<FarmerProfile> => {
    const response =
      await api.get<FarmerProfile>(
        "/farmers/profile/"
      );

    return response.data;
  },

  createProfile: async (
    data: CreateFarmerProfileData
  ): Promise<FarmerProfile> => {
    const response =
      await api.post<FarmerProfile>(
        "/farmers/profile/create/",
        data
      );

    return response.data;
  },

  updateProfile: async (
    data: UpdateFarmerProfileData
  ): Promise<FarmerProfile> => {
    const response =
      await api.put<FarmerProfile>(
        "/farmers/profile/",
        data
      );

    return response.data;
  },

  /**
   * ==============================
   * Agricultural Services
   * ==============================
   */

  getMyServices: async (): Promise<
    AgriculturalService[]
  > => {
    const response =
      await api.get<AgriculturalService[]>(
        "/farmers/services/"
      );

    return response.data;
  },

  getService: async (
    id: number
  ): Promise<AgriculturalService> => {
    const response =
      await api.get<AgriculturalService>(
        `/farmers/services/${id}/`
      );

    return response.data;
  },

  createService: async (
    data: CreateAgriculturalServiceData
  ): Promise<AgriculturalService> => {
    const response =
      await api.post<AgriculturalService>(
        "/farmers/services/",
        data
      );

    return response.data;
  },

  updateService: async (
    id: number,
    data: UpdateAgriculturalServiceData
  ): Promise<AgriculturalService> => {
    const response =
      await api.patch<AgriculturalService>(
        `/farmers/services/${id}/`,
        data
      );

    return response.data;
  },

  deleteService: async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/farmers/services/${id}/`
    );
  },

  /**
   * ==============================
   * Farmer Products
   * ==============================
   */

  getMyProducts: async (): Promise<PaginatedFarmerProducts> => {
    const response =
      await api.get<PaginatedFarmerProducts>(
        "/farmers/products/"
      );

    return response.data;
  },

  getProduct: async (
    id: number
  ): Promise<FarmerProduct> => {
    const response =
      await api.get<FarmerProduct>(
        `/farmers/products/${id}/`
      );

    return response.data;
  },

  createProduct: async (
    data: CreateFarmerProductData
  ): Promise<FarmerProduct> => {
    const formData = new FormData();

    formData.append(
      "category",
      String(data.category)
    );

    formData.append(
      "name",
      data.name
    );

    formData.append(
      "description",
      data.description
    );

    formData.append(
      "price",
      String(data.price)
    );

    formData.append(
      "quantity",
      String(data.quantity)
    );

    formData.append(
      "unit",
      data.unit
    );

    formData.append(
      "is_available",
      String(data.is_available)
    );

    if (data.image instanceof File) {
      formData.append(
        "image",
        data.image,
        data.image.name
      );
    }

    const response =
      await api.post<FarmerProduct>(
        "/farmers/products/",
        formData
      );

    return response.data;
  },

  updateProduct: async (
    id: number,
    data: UpdateFarmerProductData
  ): Promise<FarmerProduct> => {
    const formData = new FormData();

    if (data.category !== undefined) {
      formData.append(
        "category",
        String(data.category)
      );
    }

    if (data.name !== undefined) {
      formData.append(
        "name",
        data.name
      );
    }

    if (data.description !== undefined) {
      formData.append(
        "description",
        data.description
      );
    }

    if (data.price !== undefined) {
      formData.append(
        "price",
        String(data.price)
      );
    }

    if (data.quantity !== undefined) {
      formData.append(
        "quantity",
        String(data.quantity)
      );
    }

    if (data.unit !== undefined) {
      formData.append(
        "unit",
        data.unit
      );
    }

    if (data.is_available !== undefined) {
      formData.append(
        "is_available",
        String(data.is_available)
      );
    }

    if (data.image instanceof File) {
      formData.append(
        "image",
        data.image,
        data.image.name
      );
    }

    const response =
      await api.patch<FarmerProduct>(
        `/farmers/products/${id}/`,
        formData
      );

    return response.data;
  },

  deleteProduct: async (
    id: number
  ): Promise<void> => {
    await api.delete(
      `/farmers/products/${id}/`
    );
  },
};