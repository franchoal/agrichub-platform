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
      ==========================================
      Save Authentication
      ==========================================
      */

      login({
        user: response.user,
        access: response.access,
        refresh: response.refresh,
      });

      toast.success(
        "Login successful!"
      );

      /*
      ==========================================
      AGRICWISE FLOW

      Normal login
        ↓
      Authenticate person
        ↓
      Save session
        ↓
      AgricWise Home

      Seller/business login
        ↓
      Authenticate person
        ↓
      Save session
        ↓
      Return to Farmer Portal
        ↓
      Existing farmer → Dashboard
      New farmer → Profile setup
      ==========================================
      */

      navigate(
        options?.redirectTo || "/",
        {
          replace: true,
        }
      );
    },

    onError: (error) => {
      if (
        axios.isAxiosError(error)
      ) {
        const message =
          error.response?.data?.detail ||
          "Invalid email or password.";

        toast.error(
          message
        );

        return;
      }

      toast.error(
        "Login failed."
      );
    },
  });
};