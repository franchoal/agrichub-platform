import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useFarmerProfile } from "../../hooks/useFarmerProfile";

const FarmerPortalPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const {
    data: farmerProfile,
    isLoading,
    isError,
  } = useFarmerProfile();

  /*
   * Wait for Zustand to restore authentication state.
   * This prevents authenticated users from briefly seeing
   * the public business portal during page refresh.
   */
  if (!hasHydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl shadow-sm">
            🌾
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Loading AgricWise...
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Preparing your agricultural business workspace.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Authenticated users should not remain on the public portal.
   *
   * Existing business profile → dashboard.
   * No business profile → business onboarding/profile.
   */
  if (isAuthenticated) {
    if (isLoading) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl shadow-sm">
              🌱
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Preparing Your Business Workspace
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-600">
              Checking your AgricWise business profile and preparing your
              workspace.
            </p>
          </div>
        </main>
      );
    }

    /*
     * Existing profile → business dashboard.
     *
     * Verification controls marketplace visibility,
     * not access to the business workspace.
     */
    if (farmerProfile) {
      return <Navigate to="/farmer/dashboard" replace />;
    }

    /*
     * Authenticated user without a business profile →
     * business profile onboarding.
     */
    if (isError || !farmerProfile) {
      return <Navigate to="/farmer/profile" replace />;
    }
  }

  /*
   * Public AgricWise Business Portal.
   *
   * The /farmer route is intentionally retained for compatibility
   * with existing links and routing. The user-facing experience,
   * however, is now positioned as an agricultural business workspace.
   */
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm backdrop-blur">
              <span className="text-base">🌿</span>
              AgricWise Business Workspace
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Build, manage and grow your
              <span className="block text-green-700">
                agricultural business.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              AgricWise gives farmers, agribusinesses and agricultural
              professionals one place to showcase what they offer, connect
              with customers, manage products and services, and grow their
              presence in the agricultural marketplace.
            </p>

            {/* Business capabilities */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl">
                    🏪
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Showcase Your Business
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Create a professional agricultural business profile
                      customers can discover and trust.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                    🛒
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Sell Products
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      List farm produce, inputs, equipment and other
                      agricultural products.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-xl">
                    🛠️
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Offer Services
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Promote agricultural services, consultancy, training,
                      equipment and technical expertise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-green-100 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                    📈
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Grow Your Reach
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Connect with buyers, customers and other people across
                      the agricultural ecosystem.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audience */}
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                Built for the agricultural ecosystem
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "Farmers",
                  "Agro-input Suppliers",
                  "Agro-allied Businesses",
                  "Equipment Providers",
                  "Service Providers",
                  "Produce Buyers",
                  "Agro-processors",
                  "Consultants",
                ].map((audience) => (
                  <span
                    key={audience}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Action Card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-green-200/40 to-emerald-100/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl shadow-sm">
                  🌾
                </div>

                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-green-700">
                  Grow with AgricWise
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-gray-950 sm:text-3xl">
                  Your agricultural business, all in one place.
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600 sm:text-base">
                  Join AgricWise and build a stronger digital presence for
                  your agricultural business, products and services.
                </p>
              </div>

              {/* Primary actions */}
              <div className="mt-8 space-y-3">
                <Link
                  to="/register?returnTo=/farmer"
                  className="flex w-full items-center justify-center rounded-xl bg-green-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-base"
                >
                  Create Your Business Profile
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  to="/login?returnTo=/farmer"
                  className="flex w-full items-center justify-center rounded-xl border-2 border-green-600 bg-white px-6 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-base"
                >
                  Sign In to Your Workspace
                </Link>
              </div>

              {/* Marketplace link */}
              <div className="mt-7 border-t border-gray-100 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Looking to discover agricultural products and services?
                </p>

                <Link
                  to="/products"
                  className="mt-2 inline-flex items-center font-semibold text-green-700 transition hover:text-green-800 hover:underline"
                >
                  Explore the AgricWise Marketplace
                  <span className="ml-1">→</span>
                </Link>
              </div>

              {/* Benefits */}
              <div className="mt-7 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-5">
                <h3 className="font-bold text-gray-900">
                  What you can do on AgricWise
                </h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    "Create your business profile",
                    "List products for customers",
                    "Promote agricultural services",
                    "Manage orders",
                    "Build customer relationships",
                    "Grow your digital presence",
                  ].map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="mt-0.5 font-bold text-green-600">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust message */}
              <p className="mt-6 text-center text-xs leading-5 text-gray-500">
                Whether you produce, supply, process, buy, train or provide
                agricultural services, AgricWise gives your business a place
                to grow.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FarmerPortalPage;