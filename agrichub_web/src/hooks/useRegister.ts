import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  authService,
  type RegisterData,
} from "../services/authService";

export const useRegister = (
  onSuccess?: () => void
) => {
  return useMutation({
    /*
     * Registration is responsible only for creating
     * the AgricWise account.
     *
     * It must NOT create a FarmerProfile here.
     *
     * Business onboarding begins only when the user
     * intentionally enters the business workspace.
     */
    mutationFn: (data: RegisterData) =>
      authService.register(data),

    onSuccess: () => {
      toast.success(
        "Account created successfully!"
      );

      /*
       * RegisterPage owns the next destination.
       *
       * Example:
       *
       * /register?returnTo=/farmer
       *      ↓
       * successful registration
       *      ↓
       * /login?returnTo=/farmer
       */
      onSuccess?.();
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error(
          "Registration error:",
          error.response?.data
        );

        const responseData = error.response?.data;

        let message = "Registration failed.";

        if (
          responseData &&
          typeof responseData === "object"
        ) {
          const messages = Object.values(
            responseData as Record<string, unknown>
          )
            .flatMap((value) =>
              Array.isArray(value)
                ? value
                : [value]
            )
            .filter(
              (value): value is string =>
                typeof value === "string"
            );

          if (messages.length > 0) {
            message = messages.join("\n");
          }
        }

        toast.error(message);

        return;
      }

      toast.error(
        "Registration failed."
      );
    },
  });
};