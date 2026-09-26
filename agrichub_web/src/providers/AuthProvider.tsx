import {
  type ReactNode,
  useEffect,
  useState,
} from "react";

import { getProfile } from "../services/profileService";
import { useAuthStore } from "../store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const hasHydrated = useAuthStore(
    (state) => state.hasHydrated
  );

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const validateSession = async () => {
      if (
        !accessToken ||
        !isAuthenticated
      ) {
        setIsCheckingSession(false);
        return;
      }

      try {
        await getProfile();
      } catch {
        logout();
      } finally {
        setIsCheckingSession(false);
      }
    };

    validateSession();
  }, [
    hasHydrated,
    accessToken,
    isAuthenticated,
    logout,
  ]);

  if (
    !hasHydrated ||
    isCheckingSession
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">
            🌾
          </div>

          <p className="font-semibold text-green-700">
            Loading AgricWise...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;