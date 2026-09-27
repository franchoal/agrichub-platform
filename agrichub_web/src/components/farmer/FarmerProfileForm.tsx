import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  farmerProfileSchema,
  type FarmerProfileFormData,
} from "../../validators/farmerProfileSchema";

import { useCreateFarmerProfile } from "../../hooks/useCreateFarmerProfile";

import {
  Button,
  Input,
} from "../ui";


const FarmerProfileForm = () => {

  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();


  /*
  ==========================================
  RETURN DESTINATION
  ==========================================

  When a user reaches Farmer Profile
  onboarding from another AgricWise activity,
  that activity can provide a returnTo query
  parameter.

  Example:

  /farmer/profile?returnTo=/community/create

  Normal farmer-profile onboarding continues
  to the existing farmer dashboard.
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


  const createProfile =
    useCreateFarmerProfile(() => {

      navigate(
        returnTo,
        {
          replace: true,
        }
      );

    });


  const {
    register,
    handleSubmit,
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
    },

  });


  const onSubmit = (
    data: FarmerProfileFormData
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

      className="space-y-6 rounded-2xl bg-white p-8 shadow"

    >

      <Input

        label="Farm Name"

        placeholder="e.g. Green Valley Farms"

        {...register(
          "farm_name"
        )}

        error={
          errors.farm_name?.message
        }

      />


      <Input

        label="Farm Location"

        placeholder="e.g. Abeokuta, Ogun State"

        {...register(
          "farm_location"
        )}

        error={
          errors.farm_location?.message
        }

      />


      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">

          Farm Description

        </label>


        <textarea

          {...register(
            "farm_description"
          )}

          rows={5}

          placeholder="Tell buyers about your farm..."

          className="
          w-full rounded-lg border
          border-gray-300 px-4 py-3
          outline-none focus:border-green-600
          "

        />


        {
          errors.farm_description && (

            <p className="mt-2 text-sm text-red-500">

              {
                errors
                  .farm_description
                  .message
              }

            </p>

          )
        }


      </div>


      <Button

        type="submit"

        isLoading={
          createProfile.isPending
        }

      >

        {
          createProfile.isPending
            ? "Creating Farm Profile..."
            : "Create Farm Profile"
        }

      </Button>


    </form>

  );

};


export default FarmerProfileForm;