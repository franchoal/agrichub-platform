
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  isMissingFarmerProfile,
  useFarmerProfile,
} from "../hooks/useFarmerProfile";

import { useAuthStore } from "../store/authStore";

const FarmerRoute = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const {
    isLoading,
    isError,
    error,
    refetch,
    data: farmerProfile,
  } = useFarmerProfile();

  /*
  ==========================================
  AUTHENTICATION
  ==========================================
  */

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  /*
  ==========================================
  PROFILE LOADING
  ==========================================
  */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading your agricultural business...
          </p>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  PROFILE DOES NOT EXIST
  ==========================================
  
  Only a confirmed 404 should be interpreted as
  a missing profile when the query has failed.

  The profile creation page remains outside
  FarmerRoute.
  */

  if (isError && isMissingFarmerProfile(error)) {
    return <Navigate to="/farmer/profile" replace />;
  }

  /*
  ==========================================
  PROFILE REQUEST FAILED
  ==========================================
  
  Do not mistake authorization, server, or
  network failures for a new user's missing profile.
  */

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load your business
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            We couldn't retrieve your AgricWise business profile.
            Please check your connection and try again.
          </p>

          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="mt-5 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  PROFILE DOES NOT EXIST
  ==========================================
  
  A successful query should return a profile.
  If no profile data is available, send the user
  to the foundation step.
  */

  if (!farmerProfile) {
    return <Navigate to="/farmer/profile" replace />;
  }

  /*
  ==========================================
  GUIDED ONBOARDING
  ==========================================
  */

  const onboardingPaths = [
    "/farmer/onboarding/products",
    "/farmer/onboarding/services",
    "/farmer/onboarding/review",
  ];

  const isOnboardingRoute = onboardingPaths.includes(
    location.pathname,
  );

  /*
  ==========================================
  UNPUBLISHED BUSINESS
  ==========================================
  
  An existing but unpublished business can continue
  onboarding but cannot enter the normal workspace.
  */

  if (
    !farmerProfile.is_published &&
    !isOnboardingRoute
  ) {
    return (
      <Navigate
        to="/farmer/onboarding/review"
        replace
      />
    );
  }

  /*
  ==========================================
  PUBLISHED BUSINESS
  ==========================================
  */

  return <Outlet />;
};

export default FarmerRoute;
