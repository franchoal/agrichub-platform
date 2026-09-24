import { api } from "./api";

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  location: string;
  bio: string;
  photo: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  location?: string;
  bio?: string;
  photo?: File | null;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(
    "/accounts/profile/"
  );

  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileData
): Promise<UserProfile> => {
  const formData = new FormData();

  if (data.first_name !== undefined) {
    formData.append("first_name", data.first_name);
  }

  if (data.last_name !== undefined) {
    formData.append("last_name", data.last_name);
  }

  if (data.phone_number !== undefined) {
    formData.append("phone_number", data.phone_number);
  }

  if (data.location !== undefined) {
    formData.append("location", data.location);
  }

  if (data.bio !== undefined) {
    formData.append("bio", data.bio);
  }

  if (data.photo !== undefined && data.photo !== null) {
    formData.append("photo", data.photo);
  }

  const response = await api.patch<UserProfile>(
    "/accounts/profile/",
    formData
  );

  return response.data;
};