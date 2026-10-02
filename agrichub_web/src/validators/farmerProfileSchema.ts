import { z } from "zod";


export const farmerProfileSchema =
  z.object({

    farm_name: z
      .string()
      .trim()
      .min(
        3,
        "Business or farm name must be at least 3 characters."
      ),


    farm_location: z
      .string()
      .trim()
      .min(
        3,
        "Business location is required."
      ),


    farm_description: z
      .string()
      .trim()
      .min(
        20,
        "Business description must be at least 20 characters."
      ),


    category_ids: z
      .array(
        z.number()
      )
      .min(
        1,
        "Select at least one agricultural category."
      ),

  });


export type FarmerProfileFormData =
  z.infer<
    typeof farmerProfileSchema
  >;