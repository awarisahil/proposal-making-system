import { prisma } from "../config/database.js";

export async function createProposalVersion(
  organizationId: string,
  proposalId: string,
  userId: string
) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },

    include: {
      client: {
        include: {
          contacts: true,
        },
      },

      sections: {
        orderBy: {
          sortOrder: "asc",
        },
      },

      items: {
        orderBy: {
          sortOrder: "asc",
        },

        include: {
          product: true,
        },
      },
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  const latestVersion =
    await prisma.proposalVersion.findFirst({
      where: {
        proposalId,
      },

      orderBy: {
        version: "desc",
      },
    });

  const nextVersion =
    (latestVersion?.version ?? 0) + 1;

  const snapshot = {
    proposal: {
      id: proposal.id,
      proposalNumber: proposal.proposalNumber,
      title: proposal.title,
      description: proposal.description,
      status: proposal.status,
      currency: proposal.currency,
      validUntil: proposal.validUntil,

      subtotal: proposal.subtotal.toString(),
      discount: proposal.discount.toString(),
      tax: proposal.tax.toString(),
      total: proposal.total.toString(),
    },

    client: proposal.client,

    sections: proposal.sections,

    items: proposal.items.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      description: item.description,
      quantity: item.quantity.toString(),
      unit: item.unit,
      unitPrice: item.unitPrice.toString(),
      discountType: item.discountType,
      discountValue:
        item.discountValue.toString(),
      taxRate: item.taxRate.toString(),
      subtotal: item.subtotal.toString(),
      taxAmount: item.taxAmount.toString(),
      total: item.total.toString(),
      sortOrder: item.sortOrder,
    })),
  };

  await prisma.proposalVersion.updateMany({
    where: {
      proposalId,
      status: "FINAL",
    },

    data: {
      status: "SUPERSEDED",
    },
  });
console.log("Creating proposal version:", {
  proposalId,
  nextVersion,
  snapshot,
});
  const version =
    await prisma.proposalVersion.create({
      data: {
        proposalId,
        version: nextVersion,

        snapshot,

        createdBy: userId,

        status: "FINAL",
      },
    });

  await prisma.proposalActivity.create({
    data: {
      proposalId,
      userId,

      action: "VERSION_CREATED",

      description:
        `Proposal version ${nextVersion} created`,

      metadata: {
        version: nextVersion,
      },
    },
  });

  return version;
}

export async function getProposalVersions(
  organizationId: string,
  proposalId: string
) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  return prisma.proposalVersion.findMany({
    where: {
      proposalId,
    },

    orderBy: {
      version: "desc",
    },
  });
}

export async function getProposalVersion(
  organizationId: string,
  proposalId: string,
  versionNumber: number
) {
  const proposal = await prisma.proposal.findFirst({
    where: {
      id: proposalId,
      organizationId,
    },
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  const version =
    await prisma.proposalVersion.findFirst({
      where: {
        proposalId,
        version: versionNumber,
      },
    });

  if (!version) {
    throw new Error("Proposal version not found");
  }

  return version;
}