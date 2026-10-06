import bcrypt from "bcrypt";

import { prisma } from "../config/database.js";
import type { RegisterInput } from "../validators/auth.validator.js";

const DEFAULT_ROLES = [
  {
    name: "ORGANIZATION_ADMIN",
    description: "Full access within an organization",
  },
  {
    name: "PROPOSAL_MANAGER",
    description: "Manage proposals and proposal workflows",
  },
  {
    name: "SALES",
    description: "Create and manage sales proposals",
  },
  {
    name: "EDITOR",
    description: "Edit proposal content",
  },
  {
    name: "REVIEWER",
    description: "Review and approve proposals",
  },
  {
    name: "VIEWER",
    description: "Read-only access",
  },
];

export async function registerUser(input: RegisterInput) {
  const {
    organizationName,
    firstName,
    lastName,
    email,
    password,
  } = input;

  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const slug = await generateUniqueOrganizationSlug(organizationName);

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
        slug,
      },
    });

    const roles = [];

    for (const roleData of DEFAULT_ROLES) {
      const role = await tx.role.create({
        data: {
          organizationId: organization.id,
          name: roleData.name,
          description: roleData.description,
        },
      });

      roles.push(role);
    }

    const permissions = await tx.permission.findMany();

    const organizationAdminRole = roles.find(
      (role) => role.name === "ORGANIZATION_ADMIN"
    );

    if (!organizationAdminRole) {
      throw new Error("Organization admin role could not be created");
    }

    await tx.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: organizationAdminRole.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });

    const user = await tx.user.create({
      data: {
        organizationId: organization.id,
        firstName,
        lastName,
        email,
        passwordHash,
      },
    });

    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId: organizationAdminRole.id,
      },
    });

    return {
      organization,
      user,
    };
  });

  return {
    organization: {
      id: result.organization.id,
      name: result.organization.name,
      slug: result.organization.slug,
    },

    user: {
      id: result.user.id,
      firstName: result.user.firstName,
      lastName: result.user.lastName,
      email: result.user.email,
    },
  };
}

async function generateUniqueOrganizationSlug(
  organizationName: string
): Promise<string> {
  const baseSlug = organizationName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = baseSlug || "organization";
  let counter = 1;

  while (true) {
    const existingOrganization = await prisma.organization.findUnique({
      where: {
        slug,
      },
    });

    if (!existingOrganization) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}