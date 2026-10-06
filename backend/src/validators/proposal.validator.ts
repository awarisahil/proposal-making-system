import { z } from "zod";

export const createProposalSchema = z.object({
  clientId: z
    .string()
    .uuid("Invalid client ID"),

  title: z
    .string()
    .trim()
    .min(2, "Proposal title must be at least 2 characters")
    .max(200, "Proposal title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(5000, "Description must not exceed 5000 characters")
    .optional(),

  currency: z
    .enum(["INR", "USD", "EUR", "GBP"])
    .optional(),

  validUntil: z
    .coerce
    .date()
    .optional(),
});

export const updateProposalSchema =
  createProposalSchema.partial();

export const createProposalSectionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Section title is required")
    .max(200, "Section title must not exceed 200 characters"),

  content: z
    .string()
    .max(20000, "Section content is too long")
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const updateProposalSectionSchema =
  createProposalSectionSchema.partial();

export const createProposalItemSchema = z.object({
  productId: z
    .string()
    .uuid("Invalid product ID")
    .optional(),

  type: z
    .enum(["PRODUCT", "CUSTOM"])
    .optional(),

  name: z
    .string()
    .trim()
    .min(1, "Item name is required")
    .max(200, "Item name must not exceed 200 characters"),

  description: z
    .string()
    .max(2000)
    .optional(),

  quantity: z
    .number()
    .positive("Quantity must be greater than zero"),

  unit: z
    .string()
    .trim()
    .min(1)
    .max(50)
    .optional(),

  unitPrice: z
    .number()
    .nonnegative("Unit price cannot be negative"),

  discountType: z
    .enum(["PERCENTAGE", "FIXED"])
    .optional(),

  discountValue: z
    .number()
    .nonnegative("Discount cannot be negative")
    .optional(),

  taxRate: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const updateProposalItemSchema =
  createProposalItemSchema.partial();

export type CreateProposalInput =
  z.infer<typeof createProposalSchema>;

export type UpdateProposalInput =
  z.infer<typeof updateProposalSchema>;

export type CreateProposalSectionInput =
  z.infer<typeof createProposalSectionSchema>;

export type UpdateProposalSectionInput =
  z.infer<typeof updateProposalSectionSchema>;

export type CreateProposalItemInput =
  z.infer<typeof createProposalItemSchema>;

export type UpdateProposalItemInput =
  z.infer<typeof updateProposalItemSchema>;