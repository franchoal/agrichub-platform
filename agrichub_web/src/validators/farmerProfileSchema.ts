import { z } from "zod";

/**
 * AgricWise Agricultural Business / Professional Profile
 *
 * NOTE:
 * The API still uses the legacy field names:
 * - farm_name
 * - farm_location
 * - farm_description
 *
 * These are intentionally preserved for backend compatibility.
 * The UI presents them as broader business/professional fields.
 */
export const farmerProfileSchema = z.object({
  farm_name: z
    .string()
    .trim()
    .min(
      3,
      "Business or professional name must be at least 3 characters."
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
    .array(z.number())
    .min(
      1,
      "Select at least one agricultural category."
    ),
});

export type FarmerProfileFormData = z.infer<
  typeof farmerProfileSchema
>;