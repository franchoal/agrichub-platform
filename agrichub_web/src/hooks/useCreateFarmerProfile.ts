import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import axios from "axios";
import { toast } from "react-hot-toast";

import { farmerService } from "../services/farmerService";

import type {
  CreateFarmerProfileData,
} from "../services/farmerService";


export const useCreateFarmerProfile = (
  onSuccess?: () => void
) => {

  const queryClient =
    useQueryClient();


  return useMutation({

    mutationFn: (
      data: CreateFarmerProfileData
    ) =>
      farmerService.createProfile(
        data
      ),


    onSuccess: async () => {

      toast.success(
        "AgricWise business profile created successfully!"
      );


      /*
      ==========================================
      Refresh Agricultural Business Profile
      ==========================================
      */

      await queryClient.invalidateQueries({
        queryKey: [
          "farmer-profile",
        ],
      });


      if (onSuccess) {
        onSuccess();
      }

    },


    onError: (error) => {

      if (
        axios.isAxiosError(error)
      ) {

        console.error(
          error.response?.data
        );


        const message =
          typeof error.response
            ?.data === "object"
            ? Object.values(
                error.response.data
              )
                .flat()
                .join("\n")
            : "Failed to create AgricWise business profile.";


        toast.error(
          message
        );


        return;
      }


      toast.error(
        "Failed to create AgricWise business profile."
      );

    },

  });

};