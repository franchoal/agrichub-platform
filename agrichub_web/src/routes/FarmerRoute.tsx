import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { useFarmerProfile } from "../hooks/useFarmerProfile";

const FarmerRoute = () => {
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
  Existing Farmer/Seller Workspace
  ==========================================

  AgricWise no longer assigns permanent
  Buyer/Farmer account roles.

  FarmerProfile is retained as a transitional
  capability/workspace for users who want to
  operate as agricultural sellers/farmers.

  This is separate from the universal
  AgricWise personal profile.
  */

  const {
    isLoading,
    isError,
    data: farmerProfile,
  } = useFarmerProfile();

  /*
  ==========================================
  Loading
  ==========================================
  */

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl">
            🌾
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Loading AgricWise Workspace...
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Please wait.
          </p>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  No Farmer/Seller Workspace
  ==========================================

  Do NOT redirect to /farmer/profile.

  /profile is now the universal personal
  profile for every AgricWise member.

  A FarmerProfile will be created later when
  the user chooses to become a seller/farmer
  through the appropriate agricultural
  activity flow.
  */

  if (isError || !farmerProfile) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  /*
  ==========================================
  Farmer/Seller Workspace Exists
  ==========================================
  */

  return <Outlet />;
};

export default FarmerRoute;