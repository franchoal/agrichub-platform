import { useState } from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  isMissingFarmerProfile,
  useFarmerProfile,
} from "../../hooks/useFarmerProfile";

import FarmerProfileForm from "../../components/farmer/FarmerProfileForm";

const FarmerProfilePage = () => {
  const location = useLocation();

  const [showForm, setShowForm] = useState(false);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
    refetch: refetchProfile,
  } = useFarmerProfile();

  const isEditMode =
    new URLSearchParams(location.search).get("edit") === "true";

  const hasExistingProfile = Boolean(profile);

  const isPublished = Boolean(profile?.is_published);

  const isMissingProfile =
    isProfileError &&
    isMissingFarmerProfile(profileError);

  const hasUnexpectedProfileError =
    isProfileError && !isMissingProfile;

  const showBusinessInvitation =
    !hasExistingProfile &&
    !isEditMode &&
    !showForm;

  if (isProfileLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div
          className="text-center"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-600" />

          <p className="text-sm text-slate-600">
            Loading your business profile...
          </p>
        </div>
      </main>
    );
  }

  if (hasUnexpectedProfileError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-10">
        <section
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
          role="alert"
        >
          <ShieldCheck className="mx-auto h-10 w-10 text-amber-600" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load your business profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We couldn't retrieve your AgricWise business
            information. Please try again.
          </p>

          <button
            type="button"
            onClick={() => {
              void refetchProfile();
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
          >
            Try again
            <ArrowRight className="h-4 w-4" />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">

        {/* NEW BUSINESS: SIMPLE INVITATION */}

        {showBusinessInvitation && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Agricultural business imagery */}

            <div className="relative min-h-[260px] overflow-hidden bg-green-950 sm:min-h-[340px]">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85"
                alt="Green agricultural fields representing farming and agricultural businesses"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-950/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Building2 className="h-4 w-4" />
                  My AgricWise Business
                </span>

                <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                  Your business belongs here.
                </h1>
              </div>
            </div>

            {/* Short invitation */}

            <div className="p-5 sm:p-8">
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Join AgricWise Africa and create your business
                presence. Whether you farm, supply agricultural
                inputs, process produce, provide services, or
                trade agricultural products, there's a place
                for your business here.
              </p>

              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 sm:w-auto"
              >
                Create My Business Presence
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-5 flex items-start gap-2 text-sm text-slate-500">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />

                <p>
                  Start with your business details. Add products
                  and services as you grow.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* BUSINESS PROFILE FORM */}

        {!showBusinessInvitation && (
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-white p-5 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <Building2 className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      {isEditMode
                        ? "Edit your business"
                        : hasExistingProfile
                          ? "Your business profile"
                          : "Create your business presence"}
                    </h1>

                    {isPublished && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Published
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {hasExistingProfile
                      ? "Manage the information that represents your business on AgricWise."
                      : "Tell us about your business to get started."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <FarmerProfileForm />
            </div>
          </section>
        )}

        {/* EXISTING BUSINESS WORKSPACE */}

        {hasExistingProfile && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Your Business Workspace
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Manage your agricultural business and its
                  products and services.
                </p>
              </div>

              <Link
                to="/farmer/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
              >
                Open Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

      </div>
    </main>
  );
};

export default FarmerProfilePage;