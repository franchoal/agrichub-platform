import { z } from "zod";

/**
 * Registration Schema
 *
 * AgricWise registration is person-centered.
 * Users do not select a permanent buyer/farmer role.
 */
export const registerSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .email("Please enter a valid email address"),

  phone_number: z
    .string()
    .optional(),

  location: z
    .string()
    .optional(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;