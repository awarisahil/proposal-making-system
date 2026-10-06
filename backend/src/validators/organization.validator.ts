import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .max(255)
  .nullable()
  .optional();

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  logoUrl: optionalString,

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .nullable()
    .optional(),

  phone: optionalString,

  website: z
    .string()
    .trim()
    .url("Please provide a valid website URL")
    .nullable()
    .optional(),

  addressLine1: optionalString,
  addressLine2: optionalString,
  city: optionalString,
  state: optionalString,
  postalCode: optionalString,
  country: optionalString,

  primaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Primary color must be a valid hex color"
    )
    .nullable()
    .optional(),

  secondaryColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Secondary color must be a valid hex color"
    )
    .nullable()
    .optional(),
});

export type UpdateOrganizationInput = z.infer<
  typeof updateOrganizationSchema
>;