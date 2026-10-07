import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

interface UseLoginOptions {
  redirectTo?: string;
}

export const useLogin = (
  options?: UseLoginOptions
) => {
  const navigate = useNavigate();

  const login = useAuthStore(
    (state) => state.login
  );

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (response) => {
      /*
       * ==========================================
       * SAVE AUTHENTICATION
       * ==========================================
       *
       * Persist the authenticated session before
       * navigating anywhere.
       */
      login({
        user: response.user,
        access: response.access,
        refresh: response.refresh,
      });

      toast.success("Login successful!");

      /*
       * ==========================================
       * POST-LOGIN DESTINATION
       * ==========================================
       *
       * The destination has already been validated
       * by LoginPage.
       *
       * Normal login:
       *   /login
       *      ↓
       *   /
       *
       * Business login:
       *   /login?returnTo=/farmer
       *      ↓
       *   /farmer
       *      ↓
       *   FarmerPortalPage decides the next step:
       *
       *   No business profile
       *      → /farmer/profile
       *
       *   Existing unpublished business
       *      → /farmer/onboarding/review
       *
       *   Published business
       *      → /farmer/dashboard
       *
       * The authentication hook therefore does NOT
       * need to know anything about farmer profiles,
       * onboarding, publication, or verification.
       */
      navigate(
        options?.redirectTo || "/",
        {
          replace: true,
        }
      );
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.detail ||
          "Invalid email or password.";

        toast.error(message);

        return;
      }

      toast.error("Login failed.");
    },
  });
};