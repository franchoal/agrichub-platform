import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  farmerProfileSchema,
  type FarmerProfileFormData,
} from "../../validators/farmerProfileSchema";

import { useFarmerProfile } from "../../hooks/useFarmerProfile";

import { useUpdateFarmerProfile } from "../../hooks/useUpdateFarmerProfile";

import {
  farmerService,
  type AgriculturalCategory,
} from "../../services/farmerService";

import { Button, Input } from "../ui";

const FarmerProfileForm = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  /*
  ==========================================
  RETURN DESTINATION
  ==========================================
  */

  const requestedReturnTo = searchParams.get("returnTo");

  const returnTo =
    requestedReturnTo && requestedReturnTo.startsWith("/")
      ? requestedReturnTo
      : "/farmer/dashboard";

  /*
  ==========================================
  EXISTING BUSINESS PROFILE
  ==========================================
  */

  const {
    data: existingProfile,
    isLoading: profileLoading,
  } = useFarmerProfile();

  /*
  ==========================================
  AGRICULTURAL CATEGORIES
  ==========================================
  */

  const [categories, setCategories] = useState<AgriculturalCategory[]>([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);

        const data = await farmerService.getCategories();

        if (!isMounted) {
          return;
        }

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error(
            "Unexpected agricultural categories response:",
            data
          );

          setCategories([]);

          setCategoriesError(
            "We could not load the agricultural categories. Please refresh and try again."
          );
        }
      } catch (error) {
        console.error("Failed to load agricultural categories:", error);

        if (isMounted) {
          setCategoriesError(
            "We could not load the agricultural categories. Please refresh and try again."
          );

          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setCategoriesLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  /*
  ==========================================
  FORM
  ==========================================
  */

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FarmerProfileFormData>({
    resolver: zodResolver(farmerProfileSchema),

    defaultValues: {
      farm_name: "",
      farm_location: "",
      farm_description: "",
      category_ids: [],
    },
  });

  /*
  ==========================================
  LOAD EXISTING PROFILE
  ==========================================
  */

  useEffect(() => {
    if (!existingProfile) {
      return;
    }

    reset({
      farm_name: existingProfile.farm_name || "",

      farm_location: existingProfile.farm_location || "",

      farm_description: existingProfile.farm_description || "",

      category_ids: Array.isArray(existingProfile.business_categories)
        ? existingProfile.business_categories.map((category) => category.id)
        : [],
    });
  }, [existingProfile, reset]);

  /*
  ==========================================
  PROFILE MODE
  ==========================================
  */

  const isEditMode = !!existingProfile;

  /*
  ==========================================
  SAVE PROFILE
  ==========================================
  */

  const saveProfile = useUpdateFarmerProfile(() => {
    navigate(returnTo, {
      replace: true,
    });
  });

  /*
  ==========================================
  SELECTED CATEGORIES
  ==========================================
  */

  const watchedCategoryIds = watch("category_ids");

  const selectedCategoryIds = Array.isArray(watchedCategoryIds)
    ? watchedCategoryIds
    : [];

  /*
  ==========================================
  CATEGORY SELECTION
  ==========================================
  */

  const toggleCategory = (categoryId: number) => {
    const isSelected = selectedCategoryIds.includes(categoryId);

    const next = isSelected
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];

    setValue("category_ids", next, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  /*
  ==========================================
  SUBMIT
  ==========================================
  */

  const onSubmit: SubmitHandler<FarmerProfileFormData> = (data) => {
    saveProfile.mutate(data);
  };

  /*
  ==========================================
  INITIAL LOADING
  ==========================================
  */

  if (profileLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-100 border-t-green-600" />

          <div>
            <p className="text-sm font-semibold text-gray-800">
              Checking your AgricWise business profile...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Please wait while we prepare your business workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
  ==========================================
  CATEGORY COUNT
  ==========================================
  */

  const selectedCount = selectedCategoryIds.length;

  /*
  ==========================================
  RENDER
  ==========================================
  */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10"
      noValidate
    >
      {/* =====================================
          PROFILE STATUS
      ===================================== */}

      <div
        className={`overflow-hidden rounded-2xl border ${
          isEditMode
            ? "border-blue-100 bg-blue-50"
            : "border-green-100 bg-green-50"
        }`}
      >
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            {isEditMode ? "✏️" : "🌱"}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className={`font-bold ${
                  isEditMode ? "text-blue-900" : "text-green-900"
                }`}
              >
                {isEditMode
                  ? "Manage Your AgricWise Business"
                  : "Create Your AgricWise Business"}
              </h2>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  isEditMode
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isEditMode ? "Existing Profile" : "New Profile"}
              </span>
            </div>

            <p
              className={`mt-2 text-sm leading-6 ${
                isEditMode ? "text-blue-800" : "text-green-800"
              }`}
            >
              {isEditMode
                ? "Keep your business information accurate so customers, partners, professionals, and the AgricWise community can understand what you offer."
                : "Create a business or professional identity for your farm, company, enterprise, organization, or agricultural activity on AgricWise."}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          SECTION 1 — AGRICULTURAL CATEGORIES
      ===================================== */}

      <section aria-labelledby="business-categories">
        <div className="mb-5">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-sm font-bold text-green-700">
              1
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="business-categories"
                  className="text-lg font-bold text-gray-900"
                >
                  What does your business do?
                </h2>

                {selectedCount > 0 && (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">
                    {selectedCount} selected
                  </span>
                )}
              </div>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                Select every agricultural category that accurately represents
                your business or professional activity. You can choose more
                than one.
              </p>
            </div>
          </div>
        </div>

        {categoriesLoading && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />

              <p className="text-sm font-medium text-green-800">
                Loading agricultural categories...
              </p>
            </div>
          </div>
        )}

        {categoriesError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-medium text-red-800">
                  Categories could not be loaded
                </p>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {categoriesError}
                </p>
              </div>
            </div>
          </div>
        )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => {
                const selected = selectedCategoryIds.includes(category.id);

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-pressed={selected}
                    className={`group rounded-2xl border p-4 text-left transition duration-200 ${
                      selected
                        ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                        : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-50/40 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                          selected
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-300 bg-white group-hover:border-green-400"
                        }`}
                      >
                        {selected && (
                          <span className="text-xs font-bold">✓</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3
                          className={`text-sm font-semibold ${
                            selected ? "text-green-800" : "text-gray-900"
                          }`}
                        >
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length === 0 && (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
              <p className="text-sm text-yellow-800">
                No agricultural categories are currently available. Please
                refresh the page and try again.
              </p>
            </div>
          )}

        {errors.category_ids && (
          <p
            role="alert"
            className="mt-3 text-sm font-medium text-red-500"
          >
            {errors.category_ids.message}
          </p>
        )}
      </section>

      {/* =====================================
          SECTION 2 — BUSINESS IDENTITY
      ===================================== */}

      <section aria-labelledby="business-identity">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-sm font-bold text-green-700">
            2
          </span>

          <div>
            <h2
              id="business-identity"
              className="text-lg font-bold text-gray-900"
            >
              Business identity
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use the name customers, partners, suppliers, buyers, or other
              agricultural professionals know your business by.
            </p>
          </div>
        </div>

        <Input
          label="Business Name"
          placeholder="e.g. Green Valley Farms Ltd"
          {...register("farm_name")}
          error={errors.farm_name?.message}
        />

        <p className="mt-2 text-xs leading-5 text-gray-500">
          This name will represent your business across your AgricWise
          presence.
        </p>
      </section>

      {/* =====================================
          SECTION 3 — LOCATION
      ===================================== */}

      <section aria-labelledby="business-location">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
            3
          </span>

          <div>
            <h2
              id="business-location"
              className="text-lg font-bold text-gray-900"
            >
              Where do you operate?
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add the primary location of your business or the area where you
              provide your agricultural products and services.
            </p>
          </div>
        </div>

        <Input
          label="Business Location"
          placeholder="e.g. Abeokuta, Ogun State"
          {...register("farm_location")}
          error={errors.farm_location?.message}
        />

        <p className="mt-2 text-xs leading-5 text-gray-500">
          A city, town, state, or useful operating-area description is enough
          for now.
        </p>
      </section>

      {/* =====================================
          SECTION 4 — BUSINESS DESCRIPTION
      ===================================== */}

      <section aria-labelledby="business-description">
        <div className="mb-5 flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700">
            4
          </span>

          <div>
            <h2
              id="business-description"
              className="text-lg font-bold text-gray-900"
            >
              Tell people about your business
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Give customers and potential partners a clear picture of what
              you do, what you offer, and who you serve.
            </p>
          </div>
        </div>

        <label
          htmlFor="farm_description"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Business Description
        </label>

        <textarea
          id="farm_description"
          {...register("farm_description")}
          rows={7}
          placeholder="Tell people what your business does, the agricultural products or services you provide, who you serve, where you operate, and what makes your business valuable..."
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />

        {errors.farm_description && (
          <p role="alert" className="mt-2 text-sm text-red-500">
            {errors.farm_description.message}
          </p>
        )}

        <p className="mt-2 text-xs leading-5 text-gray-500">
          Keep it factual and clear. This information becomes part of your
          business identity on AgricWise.
        </p>
      </section>

      {/* =====================================
          PROFILE FOUNDATION SUMMARY
      ===================================== */}

      <section
        aria-labelledby="profile-foundation"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6"
      >
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
              ✦
            </div>

            <div>
              <h2
                id="profile-foundation"
                className="font-bold text-gray-900"
              >
                Your AgricWise business foundation
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These details form the structured foundation of your business
                presence.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "🏢",
              title: "Business Identity",
              description: "Who your business is",
            },
            {
              icon: "🧭",
              title: "Agricultural Categories",
              description:
                selectedCount > 0
                  ? `${selectedCount} categor${
                      selectedCount === 1 ? "y" : "ies"
                    } selected`
                  : "What your business does",
            },
            {
              icon: "📍",
              title: "Operating Location",
              description: "Where your business operates",
            },
            {
              icon: "📝",
              title: "Business Description",
              description: "What you offer and who you serve",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>

                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================
          FUTURE WORKSPACE PREVIEW
      ===================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
        <div className="relative p-5 sm:p-6">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-500/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">
                ✦
              </span>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-400">
                What comes next
              </p>
            </div>

            <h2 className="mt-3 text-lg font-bold sm:text-xl">
              Your business profile is the foundation
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              After setup, your Business Dashboard becomes the workspace for
              managing products, agricultural services, orders, verification,
              and your wider AgricWise presence.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-4">
              {[
                "Products",
                "Services",
                "Orders",
                "Business Growth",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-xs font-semibold text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          SAVE
      ===================================== */}

      <div className="border-t border-gray-100 pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-gray-800">
              {isEditMode
                ? "Keep your business information up to date."
                : "Ready to build your AgricWise presence?"}
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              {isEditMode
                ? "Your changes will be reflected across your AgricWise business workspace."
                : "You can add products and services from your Business Dashboard after creating your profile."}
            </p>
          </div>

          <Button
            type="submit"
            isLoading={saveProfile.isPending || categoriesLoading}
            disabled={
              categoriesLoading ||
              !!categoriesError ||
              categories.length === 0 ||
              saveProfile.isPending
            }
          >
            {saveProfile.isPending
              ? isEditMode
                ? "Saving Changes..."
                : "Creating Business Profile..."
              : isEditMode
                ? "Save Business Changes"
                : "Create Business Profile"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FarmerProfileForm;