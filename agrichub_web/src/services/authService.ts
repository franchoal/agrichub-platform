import { api } from "./api";

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  location?: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post("/accounts/register/", data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post("/accounts/login/", data);
    return response.data;
  },
};