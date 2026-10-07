import {
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AgriculturalServiceForm from "../../components/farmer/AgriculturalServiceForm";

import {
  useCreateAgriculturalService,
} from "../../hooks/useAgriculturalServices";

import type {
  CreateAgriculturalServiceData,
  UpdateAgriculturalServiceData,
} from "../../services/farmerService";

const CreateServicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOnboarding =
    location.pathname ===
    "/farmer/onboarding/services";

  const {
    mutate,
    isPending,
  } = useCreateAgriculturalService();


  /*
  =========================================================
  FORM SUBMISSION
  =========================================================
  */

  const handleSubmit = async (
    data:
      | CreateAgriculturalServiceData
      | UpdateAgriculturalServiceData
  ) => {
    /*
     * This page is create-only.
     *
     * AgriculturalServiceForm is reusable for both create
     * and update operations, so its onSubmit contract accepts
     * both payload types. Because this page has no `service`
     * prop and therefore can never edit an existing service,
     * only the create payload is valid here.
     */

    if (!data.name || !data.description) {
      return;
    }

    const createData: CreateAgriculturalServiceData = {
      name: data.name,
      description: data.description,
      location: data.location,
      price: data.price,
      price_unit: data.price_unit,
      is_available: data.is_available,
    };

    mutate(createData, {
      onSuccess: () => {
        if (isOnboarding) {
          navigate(
            "/farmer/onboarding/review",
            {
              replace: true,
            }
          );

          return;
        }

        navigate(
          "/farmer/dashboard",
          {
            replace: true,
          }
        );
      },
    });
  };


  /*
  =========================================================
  SKIP SERVICE STEP
  =========================================================

  Services are optional for publication.

  The business can still publish when it has completed
  the required Business Foundation:

    - business name
    - business location
    - at least one active business category

  Therefore onboarding users can continue directly to
  Review & Publish without creating a service.
  */

  const handleSkip = () => {
    navigate(
      "/farmer/onboarding/review",
      {
        replace: true,
      }
    );
  };


  /*
  =========================================================
  NAVIGATION TARGETS
  =========================================================
  */

  const backPath = isOnboarding
    ? "/farmer/onboarding/products"
    : "/farmer/dashboard";

  const backLabel = isOnboarding
    ? "Back to Products"
    : "Back to Business Workspace";


  /*
  =========================================================
  PAGE CONTENT
  =========================================================
  */

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* =================================================
            BACK NAVIGATION
        ================================================= */}

        <Link
          to={backPath}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-green-700"
        >
          <ArrowLeft size={17} />
          {backLabel}
        </Link>


        {/* =================================================
            ONBOARDING PROGRESS
        ================================================= */}

        {isOnboarding && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                Business Setup
              </p>

              <p className="text-sm font-semibold text-gray-500">
                Step 3 of 4
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-3/4 rounded-full bg-green-600" />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] font-semibold sm:text-xs">
              <div className="text-green-700">
                Business Foundation
              </div>

              <div className="text-green-700">
                Products
              </div>

              <div className="text-green-700">
                Services
              </div>

              <div className="text-gray-400">
                Review &amp; Publish
              </div>
            </div>
          </div>
        )}


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8">
          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
              <BriefcaseBusiness size={23} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                {isOnboarding
                  ? "Step 3 · What You Provide"
                  : "Business Services"}
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                {isOnboarding
                  ? "Add Your Services"
                  : "Add a Service"}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                {isOnboarding
                  ? "Tell potential customers about the agricultural services your business provides. You can manage and add more services later."
                  : "Create a clear service listing for your AgricWise business and make it available to potential customers."}
              </p>
            </div>

          </div>
        </div>


        {/* =================================================
            ONBOARDING CONTEXT
        ================================================= */}

        {isOnboarding && (
          <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4">
            <p className="text-sm leading-6 text-green-900">
              Services help customers understand the expertise,
              support, and agricultural solutions your business
              provides. Add the services you currently offer;
              you can update them later from your business
              workspace.
            </p>
          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <div className="rounded-[28px] border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <AgriculturalServiceForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </div>


        {/* =================================================
            OPTIONAL SERVICE STEP
        ================================================= */}

        {isOnboarding && (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <p className="text-xs leading-5 text-gray-500">
              Services are optional. You can add them later
              from your AgricWise business workspace.
            </p>

            <button
              type="button"
              onClick={handleSkip}
              disabled={isPending}
              className="text-sm font-semibold text-gray-600 underline decoration-gray-300 underline-offset-4 transition hover:text-green-700 hover:decoration-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Skip Services for Now
            </button>
          </div>
        )}

      </div>
    </main>
  );
};

export default CreateServicePage;