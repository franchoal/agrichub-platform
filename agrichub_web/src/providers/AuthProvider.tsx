
import {
  type ReactNode,
  useEffect,
  useState,
} from "react";
import axios from "axios";

import logoIcon from "../assets/logo/logo-icon.png";
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

    let cancelled = false;

    const validateSession = async () => {
      setIsCheckingSession(true);

      if (!accessToken || !isAuthenticated) {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        await getProfile();
      } catch (error: unknown) {
        // Only clear credentials when the server explicitly
        // rejects the access token. Preserve the session on
        // network errors and temporary server failures.
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setIsCheckingSession(false);
        }
      }
    };

    void validateSession();

    return () => {
      cancelled = true;
    };
  }, [
    hasHydrated,
    accessToken,
    isAuthenticated,
    logout,
  ]);

  if (!hasHydrated || isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <img
          src={logoIcon}
          alt="AgricWise"
          className="h-28 w-28 object-contain"
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
