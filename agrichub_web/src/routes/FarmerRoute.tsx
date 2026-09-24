import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { useFarmerProfile } from "../hooks/useFarmerProfile";


const FarmerRoute = () => {
  const location = useLocation();

  const user = useAuthStore(
    (state) => state.user
  );


  /*
  ==========================================
  Authentication
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
  Check Existing Seller/Farmer Profile
  ==========================================

  Transitional architecture:

  AgricWise does not assign permanent roles.

  The existing FarmerProfile currently
  represents the person's agricultural
  seller/farmer capability.
  */

  const {
    isLoading,
    isError,
    data: profile,
  } = useFarmerProfile();


  /*
  ==========================================
  Loading
  ==========================================
  */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">

          <div className="mb-4 text-5xl">
            🌾
          </div>

          <h2 className="text-xl font-semibold">
            Loading AgricWise Workspace...
          </h2>

          <p className="mt-2 text-gray-600">
            Please wait.
          </p>

        </div>
      </div>
    );
  }


  /*
  ==========================================
  No Farmer/Seller Profile Yet

  Redirect to profile onboarding.
  ==========================================
  */

  if (
    (isError || !profile) &&
    location.pathname !== "/farmer/profile"
  ) {
    return (
      <Navigate
        to="/farmer/profile"
        replace
      />
    );
  }


  /*
  ==========================================
  Profile Exists

  Prevent returning to onboarding.
  ==========================================
  */

  if (
    profile &&
    location.pathname === "/farmer/profile"
  ) {
    return (
      <Navigate
        to="/farmer/dashboard"
        replace
      />
    );
  }


  /*
  ==========================================
  Allow Access
  ==========================================
  */

  return <Outlet />;
};


export default FarmerRoute;