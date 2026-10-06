import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const roles = [
  {
    name: "SUPER_ADMIN",
    description: "Full system access",
  },
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

const permissions = [
  "proposal:create",
  "proposal:view",
  "proposal:edit",
  "proposal:delete",
  "proposal:approve",
  "proposal:send",

  "client:create",
  "client:view",
  "client:edit",
  "client:delete",

  "template:create",
  "template:view",
  "template:edit",
  "template:delete",

  "product:create",
  "product:view",
  "product:edit",
  "product:delete",

  "analytics:view",
  "team:manage",
  "settings:manage",
];

async function main() {
  console.log("Starting database seed...");

  for (const permissionName of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permissionName,
      },
      update: {},
      create: {
        name: permissionName,
      },
    });
  }

  console.log(`Created/verified ${permissions.length} permissions.`);

  console.log(
    "Roles will be created when an organization is created because roles are organization-specific."
  );

  console.log("Database seed completed.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });