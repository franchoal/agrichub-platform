import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";


export const useLogin = () => {

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

      Login
        ↓
      Authenticate person
        ↓
      Save session
        ↓
      AgricWise Home

      Users can choose activities from the
      AgricWise experience instead of being
      assigned a permanent account role.
      ==========================================
      */

      navigate(
        "/",
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
          error.response?.data?.detail
          ||
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