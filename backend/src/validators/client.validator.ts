import { z } from "zod";

export const createClientSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name must not exceed 150 characters"),

  displayName: z
    .string()
    .trim()
    .max(150, "Display name must not exceed 150 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .optional(),

  website: z
    .string()
    .trim()
    .url("Please provide a valid website URL")
    .optional()
    .or(z.literal("")),

  addressLine1: z
    .string()
    .trim()
    .max(200)
    .optional(),

  addressLine2: z
    .string()
    .trim()
    .max(200)
    .optional(),

  city: z
    .string()
    .trim()
    .max(100)
    .optional(),

  state: z
    .string()
    .trim()
    .max(100)
    .optional(),

  country: z
    .string()
    .trim()
    .max(100)
    .optional(),

  postalCode: z
    .string()
    .trim()
    .max(20)
    .optional(),

  notes: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  status: z
    .enum(["ACTIVE", "INACTIVE", "ARCHIVED"])
    .optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const createClientContactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional(),

  designation: z
    .string()
    .trim()
    .max(100)
    .optional(),

  isPrimary: z
    .boolean()
    .optional(),
});

export const updateClientContactSchema =
  createClientContactSchema.partial();

export type CreateClientInput =
  z.infer<typeof createClientSchema>;

export type UpdateClientInput =
  z.infer<typeof updateClientSchema>;

export type CreateClientContactInput =
  z.infer<typeof createClientContactSchema>;

export type UpdateClientContactInput =
  z.infer<typeof updateClientContactSchema>;