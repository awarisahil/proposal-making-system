import { prisma } from "../config/database.js";
export async function getOrganization(
  organizationId: string
) {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,

      logoUrl: true,
      email: true,
      phone: true,
      website: true,

      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,

      primaryColor: true,
      secondaryColor: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateOrganization(
  organizationId: string,
  data: {
    name?: string;
    logoUrl?: string | null;
    email?: string | null;
    phone?: string | null;
    website?: string | null;

    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;

    primaryColor?: string | null;
    secondaryColor?: string | null;
  }
) {
  return prisma.organization.update({
    where: {
      id: organizationId,
    },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,

      logoUrl: true,
      email: true,
      phone: true,
      website: true,

      addressLine1: true,
      addressLine2: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,

      primaryColor: true,
      secondaryColor: true,

      createdAt: true,
      updatedAt: true,
    },
  });
}