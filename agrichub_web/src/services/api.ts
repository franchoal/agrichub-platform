import axios from "axios";
import { env } from "../config/env";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: env.apiBaseUrl,
});

/**
 * Attach JWT token automatically
 */
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    const publicRoutes = [
      "/accounts/login/",
      "/accounts/register/",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (accessToken && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    /**
     * IMPORTANT:
     * Do not set Content-Type globally.
     * Axios decides between application/json and multipart/form-data.
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle 401 Unauthorized & Automatic Token Refresh
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried retrying this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Retrieve refresh token from your Zustand store (or localStorage if stored there)
        const refreshToken = useAuthStore.getState().refreshToken; // Adjust if stored elsewhere

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call your Django backend refresh endpoint (adjust URL if yours differs, e.g., "/accounts/token/refresh/")
        const response = await axios.post(`${env.apiBaseUrl}/accounts/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;

        // Update your Zustand store with the new access token
        // (Make sure useAuthStore has a method like setAccessToken or updateToken)
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Update authorization header and retry the original failed request (e.g., loading Order #33)
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear auth state and redirect to login
        useAuthStore.getState().logout?.(); // Or clear tokens manually
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);