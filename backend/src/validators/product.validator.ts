import { z } from "zod";

export const createProductCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateProductCategorySchema =
  createProductCategorySchema.partial();

export const createProductSchema = z.object({
  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional(),

  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name must not exceed 150 characters"),

  sku: z
    .string()
    .trim()
    .max(100, "SKU must not exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),

  unit: z
    .string()
    .trim()
    .min(1, "Unit is required")
    .max(50, "Unit must not exceed 50 characters")
    .optional(),

  price: z
    .number()
    .nonnegative("Price cannot be negative"),

  taxRate: z
    .number()
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export const updateProductSchema =
  createProductSchema.partial();

export type CreateProductCategoryInput =
  z.infer<typeof createProductCategorySchema>;

export type UpdateProductCategoryInput =
  z.infer<typeof updateProductCategorySchema>;

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;