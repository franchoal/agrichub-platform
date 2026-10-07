import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Package,
  Pencil,
  Send,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useFarmerProducts } from "../../hooks/useFarmerProducts";
import { useAgriculturalServices } from "../../hooks/useAgriculturalServices";
import { useFarmerProfile } from "../../hooks/useFarmerProfile";
import { usePublishFarmerProfile } from "../../hooks/usePublishFarmerProfile";

const FarmerOnboardingReviewPage = () => {
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useFarmerProfile();

  const {
    data: productsData,
    isLoading: isProductsLoading,
  } = useFarmerProducts();

  const {
    data: services,
    isLoading: isServicesLoading,
  } = useAgriculturalServices();

  /*
  =========================================================
  PUBLICATION
  =========================================================
  */

  const publishProfile = usePublishFarmerProfile(
    (publishedProfile) => {
      navigate(
        `/businesses/${publishedProfile.slug}`,
        {
          replace: true,
        }
      );
    }
  );

  /*
  =========================================================
  DATA
  =========================================================
  */

  const products = productsData?.results ?? [];

  const isLoading =
    isProfileLoading ||
    isProductsLoading ||
    isServicesLoading;

  /*
  =========================================================
  PUBLICATION READINESS
  =========================================================

  Products and services are intentionally NOT included.

  The backend publication contract requires only:

    1. Business name
    2. Business location
    3. At least one ACTIVE agricultural category

  The frontend category serializer does not expose `is_active`,
  so the frontend only checks that at least one category exists.

  The backend remains authoritative and verifies that the
  selected category is active before publication.
  */

  const hasBusinessName =
    Boolean(profile?.farm_name?.trim());

  const hasLocation =
    Boolean(profile?.farm_location?.trim());

  const hasCategory =
    Boolean(
      profile?.business_categories &&
      profile.business_categories.length > 0
    );

  const isReadyToPublish =
    hasBusinessName &&
    hasLocation &&
    hasCategory;

  /*
  =========================================================
  PUBLISH
  =========================================================
  */

  const handlePublish = () => {
    if (
      !isReadyToPublish ||
      publishProfile.isPending
    ) {
      return;
    }

    publishProfile.mutate();
  };

  /*
  =========================================================
  LOADING
  =========================================================
  */

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-10">
        <div className="mx-auto flex max-w-4xl items-center justify-center">
          <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

            <p className="text-sm font-medium text-slate-600">
              Preparing your business review...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  =========================================================
  PROFILE NOT FOUND
  =========================================================
  */

  if (!profile) {
    return (
      <div className="min-h-[70vh] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-slate-400" />

            <h1 className="text-xl font-bold text-slate-900">
              Business profile not found
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              Complete your agricultural business foundation
              before reviewing your AgricWise presence.
            </p>

            <Link
              to="/farmer/profile"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Business Foundation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">
          <Link
            to="/farmer/onboarding/services"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                  Step 4 of 4
                </span>

                <span className="text-sm text-slate-500">
                  Final review
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Review &amp; Publish
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Review your AgricWise business presence before
                making it publicly discoverable.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            PROGRESS
        ========================================== */}

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">
              Onboarding progress
            </span>

            <span className="text-sm font-semibold text-green-700">
              100%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-full rounded-full bg-green-600" />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[11px] font-medium sm:text-xs">
            <div className="text-green-700">
              Business Foundation
            </div>

            <div className="text-green-700">
              Products
              <span className="ml-1 text-slate-400">
                optional
              </span>
            </div>

            <div className="text-green-700">
              Services
              <span className="ml-1 text-slate-400">
                optional
              </span>
            </div>

            <div className="font-bold text-slate-900">
              Review &amp; Publish
            </div>
          </div>
        </div>

        {/* ==========================================
            BUSINESS FOUNDATION
        ========================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Business Foundation
                </h2>

                <p className="text-xs text-slate-500">
                  Your core business identity
                </p>
              </div>
            </div>

            <Link
              to="/farmer/profile?edit=true"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              <Pencil className="h-4 w-4" />

              <span className="hidden sm:inline">
                Edit
              </span>
            </Link>
          </div>

          <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Business name
              </p>

              <p className="font-semibold text-slate-900">
                {profile.farm_name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </p>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                <p className="font-medium text-slate-700">
                  {profile.farm_location || "Not provided"}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Agricultural business categories
              </p>

              {profile.business_categories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.business_categories.map(
                    (category) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                      >
                        {category.name}
                      </span>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-600">
                  No agricultural business category selected.
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Business description
              </p>

              <p className="whitespace-pre-line text-sm leading-6 text-slate-600">
                {profile.farm_description ||
                  "No business description provided yet."}
              </p>
            </div>

          </div>
        </section>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Package className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900">
                    Products
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Optional
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Products you offer through AgricWise
                </p>
              </div>
            </div>

            <Link
              to="/farmer/onboarding/products"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              <Pencil className="h-4 w-4" />

              <span className="hidden sm:inline">
                Add / Edit
              </span>
            </Link>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {products.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {product.name}
                        </h3>

                        {product.category_name && (
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {product.category_name}
                          </p>
                        )}
                      </div>

                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    </div>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-3 text-sm font-semibold text-slate-800">
                      {product.price}{" "}
                      {product.unit && (
                        <span className="font-normal text-slate-500">
                          / {product.unit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                <Package className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                <p className="text-sm font-medium text-slate-600">
                  No products added yet.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  This is okay. Products can be added later
                  from your business workspace.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ==========================================
            SERVICES
        ========================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Wrench className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-slate-900">
                    Services
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                    Optional
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Services your business provides
                </p>
              </div>
            </div>

            <Link
              to="/farmer/onboarding/services"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
            >
              <Pencil className="h-4 w-4" />

              <span className="hidden sm:inline">
                Add / Edit
              </span>
            </Link>
          </div>

          <div className="px-5 py-5 sm:px-6">
            {services && services.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {service.name}
                      </h3>

                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    </div>

                    {service.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                        {service.description}
                      </p>
                    )}

                    {service.location && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {service.location}
                      </div>
                    )}

                    {service.price && (
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {service.price}

                        {service.price_unit && (
                          <span className="font-normal text-slate-500">
                            {" "}
                            / {service.price_unit}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-center">
                <Wrench className="mx-auto mb-2 h-8 w-8 text-slate-300" />

                <p className="text-sm font-medium text-slate-600">
                  No services added yet.
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  This is okay. Services can be added later
                  from your business workspace.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ==========================================
            PUBLICATION READINESS
        ========================================== */}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Publication readiness
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Only your core business identity is required
                before publication. Products and services are
                optional.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <ReadinessItem
              label="Business name"
              complete={hasBusinessName}
            />

            <ReadinessItem
              label="Business location"
              complete={hasLocation}
            />

            <ReadinessItem
              label="At least one agricultural business category"
              complete={hasCategory}
            />
          </div>
        </section>

        {/* ==========================================
            INCOMPLETE FOUNDATION NOTICE
        ========================================== */}

        {!isReadyToPublish && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />

              <div>
                <h3 className="font-semibold text-amber-900">
                  Your business is not ready to publish yet
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Complete the required Business Foundation
                  information above before publishing your
                  AgricWise business.
                </p>

                <Link
                  to="/farmer/profile?edit=true"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-amber-900 underline underline-offset-4"
                >
                  <Pencil className="h-4 w-4" />
                  Complete Business Foundation
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            PUBLICATION NOTICE
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />

            <div>
              <h3 className="font-semibold text-green-900">
                What happens when you publish?
              </h3>

              <p className="mt-1 text-sm leading-6 text-green-800">
                Your AgricWise business presence becomes publicly
                discoverable. Visitors will be able to find your
                business and view the information you have chosen
                to provide.
              </p>

              <p className="mt-2 text-sm leading-6 text-green-800">
                Publication does not mean AgricWise has verified
                your business. Verification is a separate process.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/farmer/onboarding/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>

          <button
            type="button"
            onClick={handlePublish}
            disabled={
              !isReadyToPublish ||
              publishProfile.isPending
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {publishProfile.isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish My AgricWise Business
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PUBLICATION READINESS ITEM
========================================================= */

interface ReadinessItemProps {
  label: string;
  complete: boolean;
}

const ReadinessItem = ({
  label,
  complete,
}: ReadinessItemProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
      <CheckCircle2
        className={`h-5 w-5 shrink-0 ${
          complete
            ? "text-green-600"
            : "text-slate-300"
        }`}
      />

      <span
        className={`text-sm font-medium ${
          complete
            ? "text-slate-700"
            : "text-slate-500"
        }`}
      >
        {label}
      </span>

      <span className="ml-auto text-xs font-semibold">
        {complete ? (
          <span className="text-green-600">
            Complete
          </span>
        ) : (
          <span className="text-slate-400">
            Required
          </span>
        )}
      </span>
    </div>
  );
};

export default FarmerOnboardingReviewPage;