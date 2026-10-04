import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  farmerProfileSchema,
  type FarmerProfileFormData,
} from "../../validators/farmerProfileSchema";

import {
  useFarmerProfile,
} from "../../hooks/useFarmerProfile";

import {
  useUpdateFarmerProfile,
} from "../../hooks/useUpdateFarmerProfile";

import {
  farmerService,
  type AgriculturalCategory,
} from "../../services/farmerService";

import {
  Button,
  Input,
} from "../ui";


const FarmerProfileForm = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();


  /*
  ==========================================
  RETURN DESTINATION
  ==========================================
  */

  const requestedReturnTo =
    searchParams.get("returnTo");

  const returnTo =
    requestedReturnTo &&
    requestedReturnTo.startsWith("/")
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

  const [
    categories,
    setCategories,
  ] = useState<AgriculturalCategory[]>(
    []
  );

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  const [
    categoriesError,
    setCategoriesError,
  ] = useState<string | null>(null);


  useEffect(() => {
    let isMounted = true;

    const loadCategories =
      async () => {
        try {
          setCategoriesLoading(true);
          setCategoriesError(null);

          const data =
            await farmerService.getCategories();

          if (!isMounted) {
            return;
          }

          /*
          ==========================================
          SAFETY NORMALIZATION
          ==========================================
          */

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
          console.error(
            "Failed to load agricultural categories:",
            error
          );

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
    formState: {
      errors,
    },
  } = useForm<FarmerProfileFormData>({
    resolver:
      zodResolver(
        farmerProfileSchema
      ),

    defaultValues: {
      farm_name: "",
      farm_location: "",
      farm_description: "",
      category_ids: [],
    },
  });


  /*
  ==========================================
  LOAD EXISTING PROFILE INTO FORM
  ==========================================
  
  The backend returns:

    business_categories: [
      {
        id,
        name,
        slug,
        description
      }
    ]

  The form expects:

    category_ids: number[]

  So we convert the existing categories
  into their IDs before resetting the form.
  */

  useEffect(() => {
    if (!existingProfile) {
      return;
    }

    reset({
      farm_name:
        existingProfile.farm_name || "",

      farm_location:
        existingProfile.farm_location || "",

      farm_description:
        existingProfile.farm_description || "",

      category_ids:
        Array.isArray(
          existingProfile.business_categories
        )
          ? existingProfile.business_categories.map(
              (category) =>
                category.id
            )
          : [],
    });
  }, [
    existingProfile,
    reset,
  ]);


  /*
  ==========================================
  PROFILE MODE
  ==========================================
  
  Existing profile:
    EDIT MODE

  No existing profile:
    CREATE / SETUP MODE

  Important:
  useUpdateFarmerProfile already handles
  the backend fallback:

    PUT → 404 → POST
  */

  const isEditMode =
    !!existingProfile;


  /*
  ==========================================
  SAVE PROFILE MUTATION
  ==========================================
  */

  const saveProfile =
    useUpdateFarmerProfile(() => {
      navigate(returnTo, {
        replace: true,
      });
    });


  /*
  ==========================================
  SELECTED CATEGORY IDS
  ==========================================
  */

  const watchedCategoryIds =
    watch("category_ids");


  /*
  ==========================================
  SAFETY NORMALIZATION
  ==========================================
  */

  const selectedCategoryIds =
    Array.isArray(
      watchedCategoryIds
    )
      ? watchedCategoryIds
      : [];


  /*
  ==========================================
  CATEGORY SELECTION
  ==========================================
  */

  const toggleCategory = (
    categoryId: number
  ) => {
    const current =
      Array.isArray(
        selectedCategoryIds
      )
        ? selectedCategoryIds
        : [];

    const isSelected =
      current.includes(
        categoryId
      );

    const next =
      isSelected
        ? current.filter(
            (id) =>
              id !== categoryId
          )
        : [
            ...current,
            categoryId,
          ];

    setValue(
      "category_ids",
      next,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };


  /*
  ==========================================
  SUBMIT
  ==========================================
  */

  const onSubmit:
    SubmitHandler<
      FarmerProfileFormData
    > = (data) => {
      saveProfile.mutate(data);
    };


  /*
  ==========================================
  INITIAL PROFILE LOADING
  ==========================================
  */

  if (profileLoading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-green-100 border-t-green-600 animate-spin" />

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
  PROFILE LOAD ERROR
  ==========================================

  A profile-not-found response is expected
  for a first-time business setup.

  Therefore profileError alone does NOT
  prevent the form from being displayed.

  The save mutation already handles a
  missing profile through its 404 fallback.
  */


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10"
    >

      {/* =====================================
          MODE INDICATOR
      ===================================== */}

      <div
        className={`rounded-2xl border p-5 sm:p-6 ${
          isEditMode
            ? "border-blue-100 bg-blue-50"
            : "border-green-100 bg-green-50"
        }`}
      >
        <div className="flex items-start gap-4">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm`}
          >
            {isEditMode
              ? "✏️"
              : "🌱"}
          </div>

          <div>

            <h2
              className={`font-bold ${
                isEditMode
                  ? "text-blue-900"
                  : "text-green-900"
              }`}
            >
              {isEditMode
                ? "Manage Your AgricWise Business Profile"
                : "Create Your AgricWise Business Identity"}
            </h2>

            <p
              className={`mt-1 text-sm leading-6 ${
                isEditMode
                  ? "text-blue-800"
                  : "text-green-800"
              }`}
            >
              {isEditMode
                ? "Keep your business information accurate and up to date so customers, partners and the AgricWise community can understand what you offer."
                : "Whether you are a farmer, input supplier, equipment provider, consultant, processor, buyer or another agricultural professional, tell the AgricWise community what your business does."}
            </p>

          </div>
        </div>
      </div>


      {/* =====================================
          BUSINESS CATEGORIES
      ===================================== */}

      <section>

        <div className="mb-5">

          <div className="mb-2 flex items-center gap-3">

            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-sm font-bold text-green-700">
              1
            </span>

            <h2 className="text-lg font-bold text-gray-900">
              What Does Your Business Do?
            </h2>

          </div>

          <p className="max-w-3xl text-sm leading-6 text-gray-600">
            Select all the categories that best describe
            your agricultural business, products or
            professional services. You can select more
            than one.
          </p>

        </div>


        {categoriesLoading && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />

              <p className="text-sm font-medium text-green-800">
                Loading agricultural business categories...
              </p>

            </div>

          </div>
        )}


        {categoriesError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex items-start gap-3">

              <span className="text-lg">
                ⚠️
              </span>

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
          Array.isArray(categories) &&
          categories.length > 0 && (

            <div className="grid gap-3 sm:grid-cols-2">

              {categories.map(
                (category) => {

                  const selected =
                    selectedCategoryIds.includes(
                      category.id
                    );

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          category.id
                        )
                      }
                      aria-pressed={
                        selected
                      }
                      className={`
                        rounded-2xl border p-4
                        text-left transition
                        ${
                          selected
                            ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                            : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40"
                        }
                      `}
                    >

                      <div className="flex items-start gap-3">

                        <div
                          className={`
                            mt-0.5 flex h-5 w-5
                            shrink-0 items-center
                            justify-center rounded-md
                            border
                            ${
                              selected
                                ? "border-green-600 bg-green-600 text-white"
                                : "border-gray-300 bg-white"
                            }
                          `}
                        >
                          {selected && (
                            <span className="text-xs font-bold">
                              ✓
                            </span>
                          )}
                        </div>


                        <div className="min-w-0">

                          <h3
                            className={`
                              text-sm font-semibold
                              ${
                                selected
                                  ? "text-green-800"
                                  : "text-gray-900"
                              }
                            `}
                          >
                            {category.name}
                          </h3>


                          {category.description && (
                            <p className="mt-1 text-xs leading-5 text-gray-500">
                              {
                                category.description
                              }
                            </p>
                          )}

                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </div>
          )}


        {!categoriesLoading &&
          !categoriesError &&
          categories.length === 0 && (

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <p className="text-sm text-yellow-800">
                No agricultural business categories
                are currently available. Please refresh
                the page and try again.
              </p>

            </div>
          )}


        {errors.category_ids && (
          <p className="mt-3 text-sm text-red-500">
            {
              errors.category_ids.message
            }
          </p>
        )}

      </section>


      {/* =====================================
          BUSINESS NAME
      ===================================== */}

      <section>

        <div className="mb-5 flex items-start gap-3">

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-sm font-bold text-green-700">
            2
          </span>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Business Identity
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Use the name customers, partners and other
              people in the agricultural ecosystem know
              your business by.
            </p>

          </div>

        </div>


        <Input
          label="Business Name"
          placeholder="e.g. Green Valley Farms Ltd"
          {...register("farm_name")}
          error={
            errors.farm_name?.message
          }
        />


        <p className="mt-2 text-xs leading-5 text-gray-500">
          This is the name that will represent your
          business across your AgricWise profile.
        </p>

      </section>


      {/* =====================================
          LOCATION
      ===================================== */}

      <section>

        <div className="mb-5 flex items-start gap-3">

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
            3
          </span>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Where Do You Operate?
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Add the main location of your business or
              the area where you provide your agricultural
              products and services.
            </p>

          </div>

        </div>


        <Input
          label="Business Location"
          placeholder="e.g. Abeokuta, Ogun State"
          {...register(
            "farm_location"
          )}
          error={
            errors.farm_location?.message
          }
        />


        <p className="mt-2 text-xs leading-5 text-gray-500">
          You can use a city, town, state or other useful
          location description.
        </p>

      </section>


      {/* =====================================
          DESCRIPTION
      ===================================== */}

      <section>

        <div className="mb-5 flex items-start gap-3">

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-700">
            4
          </span>

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Tell People About Your Business
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Give customers and potential partners a clear
              picture of what you do and the value you provide.
            </p>

          </div>

        </div>


        <label className="mb-2 block text-sm font-medium text-gray-700">
          Business Description
        </label>


        <textarea
          {...register(
            "farm_description"
          )}
          rows={7}
          placeholder="Tell people what your business does, the agricultural products or services you provide, the people you serve, where you operate, and what makes your business valuable..."
          className="
            w-full rounded-2xl border
            border-gray-300 px-4 py-3
            text-sm leading-6 text-gray-900
            outline-none transition
            placeholder:text-gray-400
            focus:border-green-600
            focus:ring-2
            focus:ring-green-100
          "
        />


        {errors.farm_description && (
          <p className="mt-2 text-sm text-red-500">
            {
              errors
                .farm_description
                .message
            }
          </p>
        )}


        <p className="mt-2 text-xs leading-5 text-gray-500">
          A clear description helps people understand
          your business before they contact you.
        </p>

      </section>


      {/* =====================================
          PROFILE CHECKLIST
      ===================================== */}

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6">

        <div className="mb-4">

          <h2 className="font-bold text-gray-900">
            Your Business Profile
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These details form the foundation of your
            AgricWise business presence.
          </p>

        </div>


        <div className="grid gap-3 sm:grid-cols-2">

          {[
            {
              icon: "🏢",
              title: "Business Identity",
              description:
                "Your business name",
            },
            {
              icon: "🧭",
              title: "Business Category",
              description:
                "What your business does",
            },
            {
              icon: "📍",
              title: "Operating Location",
              description:
                "Where your business operates",
            },
            {
              icon: "📝",
              title: "Business Description",
              description:
                "What you offer and who you serve",
            },
          ].map((item) => (

            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl bg-white p-3"
            >

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                {item.icon}
              </div>

              <div>

                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>

                <p className="text-xs text-gray-500">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================
          SAVE
      ===================================== */}

      <div className="border-t border-gray-100 pt-7">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

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
            isLoading={
              saveProfile.isPending ||
              categoriesLoading
            }
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