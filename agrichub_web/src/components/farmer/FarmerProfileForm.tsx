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
  useCreateFarmerProfile,
} from "../../hooks/useCreateFarmerProfile";

import {
  farmerService,
  type AgriculturalCategory,
} from "../../services/farmerService";

import {
  Button,
  Input,
} from "../ui";


const FarmerProfileForm = () => {

  const navigate =
    useNavigate();


  const [
    searchParams,
  ] = useSearchParams();


  /*
  ==========================================
  RETURN DESTINATION
  ==========================================
  */

  const requestedReturnTo =
    searchParams.get(
      "returnTo"
    );


  const returnTo =
    requestedReturnTo &&
    requestedReturnTo.startsWith("/")
      ? requestedReturnTo
      : "/farmer/dashboard";


  /*
  ==========================================
  AGRICULTURAL CATEGORIES
  ==========================================
  */

  const [
    categories,
    setCategories,
  ] = useState<
    AgriculturalCategory[]
  >([]);


  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);


  const [
    categoriesError,
    setCategoriesError,
  ] = useState<string | null>(
    null
  );


  useEffect(() => {

    let isMounted = true;


    const loadCategories =
      async () => {

        try {

          setCategoriesLoading(
            true
          );

          setCategoriesError(
            null
          );


          const data =
            await farmerService.getCategories();


          if (isMounted) {

            setCategories(
              data
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

          }

        } finally {

          if (isMounted) {

            setCategoriesLoading(
              false
            );

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
  CREATE PROFILE MUTATION
  ==========================================
  */

  const createProfile =
    useCreateFarmerProfile(
      () => {

        navigate(
          returnTo,
          {
            replace: true,
          }
        );

      }
    );


  /*
  ==========================================
  FORM
  ==========================================
  */

  const {
    register,
    handleSubmit,
    setValue,
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


  const selectedCategoryIds =
    watch(
      "category_ids"
    );


  /*
  ==========================================
  CATEGORY SELECTION
  ==========================================
  */

  const toggleCategory = (
    categoryId: number
  ) => {

    const current =
      selectedCategoryIds || [];


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
    > = (
      data
    ) => {

      createProfile.mutate(
        data
      );

    };


  return (

    <form
      onSubmit={
        handleSubmit(
          onSubmit
        )
      }
      className="space-y-8"
    >

      {/* =====================================
          BUSINESS TYPE
      ===================================== */}

      <section>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-gray-900">
            What do you do in agriculture?
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-600">
            Select all the categories that best
            describe your agricultural business,
            products or professional services.
          </p>

        </div>


        {categoriesLoading && (

          <div className="rounded-xl border border-green-100 bg-green-50 p-5">

            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />

              <p className="text-sm font-medium text-green-800">
                Loading agricultural categories...
              </p>

            </div>

          </div>

        )}


        {categoriesError && (

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">

            <p className="text-sm text-red-700">
              {categoriesError}
            </p>

          </div>

        )}


        {!categoriesLoading &&
          !categoriesError &&
          categories.length > 0 && (

            <div className="grid gap-3 sm:grid-cols-2">

              {categories.map(
                (
                  category
                ) => {

                  const selected =
                    selectedCategoryIds.includes(
                      category.id
                    );


                  return (

                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          category.id
                        )
                      }
                      className={`
                        rounded-xl border p-4
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
                            {
                              category.name
                            }
                          </h3>


                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {
                              category.description
                            }
                          </p>

                        </div>

                      </div>

                    </button>

                  );

                }
              )}

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

        <Input
          label="Business / Farm Name"
          placeholder="e.g. Green Valley Farms"
          {...register(
            "farm_name"
          )}
          error={
            errors.farm_name?.message
          }
        />

      </section>


      {/* =====================================
          LOCATION
      ===================================== */}

      <section>

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

      </section>


      {/* =====================================
          DESCRIPTION
      ===================================== */}

      <section>

        <label className="mb-2 block text-sm font-medium text-gray-700">

          About Your Business

        </label>


        <textarea
          {...register(
            "farm_description"
          )}
          rows={6}
          placeholder="Tell people what your agricultural business does, what you offer, the products or services you provide, and what makes your business useful to customers..."
          className="
            w-full rounded-xl border
            border-gray-300 px-4 py-3
            text-sm text-gray-900
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

      </section>


      {/* =====================================
          SUBMIT
      ===================================== */}

      <div className="border-t border-gray-100 pt-6">

        <Button
          type="submit"
          isLoading={
            createProfile.isPending ||
            categoriesLoading
          }
          disabled={
            categoriesLoading ||
            !!categoriesError ||
            categories.length === 0
          }
        >

          {createProfile.isPending
            ? "Creating AgricWise Business..."
            : "Create AgricWise Business Profile"}

        </Button>

      </div>

    </form>

  );

};


export default FarmerProfileForm;