import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useFarmerProfile } from "../hooks/useFarmerProfile";
import { useAuthStore } from "../store/authStore";

const FarmerRoute = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const {
    isLoading,
    isError,
    data: farmerProfile,
  } = useFarmerProfile();

  /*
  ==========================================
  AUTHENTICATION
  ==========================================
  */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
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

  FarmerRoute is only entered by routes
  that require an existing FarmerProfile.

  The profile creation page itself remains
  outside FarmerRoute.
  */

  if (isError || !farmerProfile) {
    return (
      <Navigate
        to="/farmer/profile"
        replace
      />
    );
  }


  /*
  ==========================================
  GUIDED ONBOARDING
  ==========================================

  These routes must remain accessible while
  the business is still unpublished.

  The user needs to be able to:

    - add products
    - add services
    - review the business
    - return to the foundation step
  */

  const onboardingPaths = [
    "/farmer/onboarding/products",
    "/farmer/onboarding/services",
    "/farmer/onboarding/review",
  ];

  const isOnboardingRoute = onboardingPaths.includes(
    location.pathname
  );


  /*
  ==========================================
  UNPUBLISHED BUSINESS
  ==========================================

  An existing but unpublished business has
  not completed the publication lifecycle.

  Allow the guided onboarding routes.

  Prevent direct access to the normal
  business workspace until publication.

  This preserves the distinction between:

    PROFILE EXISTS
          ≠
    BUSINESS IS PUBLISHED
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

  Published businesses can use the normal
  AgricWise business workspace.
  */

  return <Outlet />;
};

export default FarmerRoute;