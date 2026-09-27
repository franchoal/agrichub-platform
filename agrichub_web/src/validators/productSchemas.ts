import { z } from "zod";

export const productSchema = z.object({
  category: z.coerce
    .number()
    .min(1, "Please select a category."),

  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters.")
    .max(150, "Product name is too long."),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description is too long."),

  price: z.coerce
    .number()
    .positive("Price must be greater than zero."),

  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than zero."),

  unit: z.enum([
    "kg",
    "bag",
    "basket",
    "crate",
    "bunch",
    "piece",
    "ton",
  ]),

  is_available: z.boolean().default(true),

  image: z
    .instanceof(File)
    .optional()
    .or(z.null()),
});

export type ProductFormInput = z.input<typeof productSchema>;

export type ProductFormData = z.output<typeof productSchema>;