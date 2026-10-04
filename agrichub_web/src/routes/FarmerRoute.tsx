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

  The agricultural business workspace is
  available only to authenticated AgricWise
  members.
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
  AgricWise Business Workspace
  ==========================================

  FarmerProfile is retained internally for
  backend compatibility.

  From the user's perspective, this profile
  represents their agricultural business,
  farm, enterprise, service operation, or
  professional activity on AgricWise.

  We intentionally keep the existing
  FarmerProfile implementation and routes
  until the broader architecture is fully
  migrated.
  */

  const {
    isLoading,
    isError,
    data: farmerProfile,
  } = useFarmerProfile();

  /*
  ==========================================
  Loading State
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
            Loading AgricWise Business Workspace...
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Preparing your agricultural business workspace.
          </p>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  No Agricultural Business Profile
  ==========================================

  The universal /profile page remains the
  personal profile for every AgricWise member.

  Users without an agricultural business
  profile should not be forced into the
  business workspace.

  They can create their agricultural business
  profile through the appropriate onboarding
  flow.
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
  Agricultural Business Profile Exists
  ==========================================

  Allow access to the protected AgricWise
  business workspace.
  */

  return <Outlet />;
};

export default FarmerRoute;