import { prisma } from "../config/database.js";

import {
  calculateItemPricing,
  calculateProposalTotals,
} from "../utils/pricing.js";

import type {
  CreateProposalInput,
  UpdateProposalInput,
  CreateProposalSectionInput,
  UpdateProposalSectionInput,
  CreateProposalItemInput,
  UpdateProposalItemInput,
} from "../validators/proposal.validator.js";

export async function createProposal(
  organizationId: string,
  data: CreateProposalInput
) {
  const client = await prisma.client.findFirst({
    where: {
      id: data.clientId,
      organizationId,
      status: "ACTIVE",
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const proposalNumber =
    await generateProposalNumber(organizationId);

  return prisma.proposal.create({
    data: {
      organizationId,
      clientId: data.clientId,

      proposalNumber,
      title: data.title,
      description: data.description,

      currency: data.currency ?? "INR",
      validUntil: data.validUntil,

      status: "DRAFT",
    },

    include: {
      client: true,
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
}

async function generateProposalNumber(
  organizationId: string
): Promise<string> {
  const count = await prisma.proposal.count({
    where: {
      organizationId,
    },
  });

  const number = count + 1;

  return `PROP-${String(number).padStart(5, "0")}`;
}

export async function getProposals(
  organizationId: string
) {
  return prisma.proposal.findMany({
    where: {
      organizationId,
    },

    include: {
      client: true,

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

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProposalById(
  organizationId: string,
  proposalId: string
) {
  return prisma.proposal.findFirst({
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
}

export async function updateProposal(
  organizationId: string,
  proposalId: string,
  data: UpdateProposalInput
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

  if (data.clientId) {
    const client = await prisma.client.findFirst({
      where: {
        id: data.clientId,
        organizationId,
        status: "ACTIVE",
      },
    });

    if (!client) {
      throw new Error("Client not found");
    }
  }

  return prisma.proposal.update({
    where: {
      id: proposal.id,
    },

    data,

    include: {
      client: true,
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
}

export async function deleteProposal(
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

  await prisma.proposal.update({
    where: {
      id: proposal.id,
    },

    data: {
      status: "CANCELLED",
    },
  });
}

export async function addProposalSection(
  organizationId: string,
  proposalId: string,
  data: CreateProposalSectionInput
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  return prisma.proposalSection.create({
    data: {
      proposalId,

      title: data.title,
      content: data.content,

      sortOrder: data.sortOrder ?? 0,
    },
  });
}

export async function updateProposalSection(
  organizationId: string,
  proposalId: string,
  sectionId: string,
  data: UpdateProposalSectionInput
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  const section =
    await prisma.proposalSection.findFirst({
      where: {
        id: sectionId,
        proposalId,
      },
    });

  if (!section) {
    throw new Error("Proposal section not found");
  }

  return prisma.proposalSection.update({
    where: {
      id: section.id,
    },

    data,
  });
}

export async function deleteProposalSection(
  organizationId: string,
  proposalId: string,
  sectionId: string
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  const section =
    await prisma.proposalSection.findFirst({
      where: {
        id: sectionId,
        proposalId,
      },
    });

  if (!section) {
    throw new Error("Proposal section not found");
  }

  await prisma.proposalSection.delete({
    where: {
      id: section.id,
    },
  });
}

export async function addProposalItem(
  organizationId: string,
  proposalId: string,
  data: CreateProposalItemInput
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  let product = null;

  if (data.productId) {
    product = await prisma.product.findFirst({
      where: {
        id: data.productId,
        organizationId,
        isActive: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }
  }

  const unitPrice =
    product && data.unitPrice === undefined
      ? Number(product.price)
      : data.unitPrice;

  const taxRate =
    product && data.taxRate === undefined
      ? Number(product.taxRate)
      : data.taxRate ?? 0;

  const unit =
    data.unit ??
    product?.unit ??
    "unit";

  const itemType =
    data.type ??
    (product ? "PRODUCT" : "CUSTOM");

  const pricing = calculateItemPricing({
    quantity: data.quantity,
    unitPrice,
    discountType:
      data.discountType ?? "PERCENTAGE",
    discountValue:
      data.discountValue ?? 0,
    taxRate,
  });

  const item = await prisma.proposalItem.create({
    data: {
      proposalId,
      productId: product?.id,

      type: itemType,

      name:
        data.name ||
        product?.name ||
        "Custom Item",

      description:
        data.description ??
        product?.description,

      quantity: data.quantity,
      unit,

      unitPrice,

      discountType:
        data.discountType ?? "PERCENTAGE",

      discountValue:
        data.discountValue ?? 0,

      taxRate,

      subtotal: pricing.grossAmount,
      taxAmount: pricing.taxAmount,
      total: pricing.total,

      sortOrder:
        data.sortOrder ?? 0,
    },
  });

  await recalculateProposal(
    proposalId
  );

  return item;
}

export async function updateProposalItem(
  organizationId: string,
  proposalId: string,
  itemId: string,
  data: UpdateProposalItemInput
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  const existing =
    await prisma.proposalItem.findFirst({
      where: {
        id: itemId,
        proposalId,
      },
    });

  if (!existing) {
    throw new Error("Proposal item not found");
  }

  const quantity =
    data.quantity ?? Number(existing.quantity);

  const unitPrice =
    data.unitPrice ?? Number(existing.unitPrice);

  const discountType =
    data.discountType ??
    existing.discountType;

  const discountValue =
    data.discountValue ??
    Number(existing.discountValue);

  const taxRate =
    data.taxRate ??
    Number(existing.taxRate);

  const pricing = calculateItemPricing({
    quantity,
    unitPrice,
    discountType,
    discountValue,
    taxRate,
  });

  const item = await prisma.proposalItem.update({
    where: {
      id: existing.id,
    },

    data: {
      ...data,

      subtotal: pricing.grossAmount,
      taxAmount: pricing.taxAmount,
      total: pricing.total,
    },
  });

  await recalculateProposal(
    proposalId
  );

  return item;
}

export async function deleteProposalItem(
  organizationId: string,
  proposalId: string,
  itemId: string
) {
  await ensureProposal(
    organizationId,
    proposalId
  );

  const item =
    await prisma.proposalItem.findFirst({
      where: {
        id: itemId,
        proposalId,
      },
    });

  if (!item) {
    throw new Error("Proposal item not found");
  }

  await prisma.proposalItem.delete({
    where: {
      id: item.id,
    },
  });

  await recalculateProposal(
    proposalId
  );
}

async function ensureProposal(
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

  return proposal;
}

async function recalculateProposal(
  proposalId: string
) {
  const items =
    await prisma.proposalItem.findMany({
      where: {
        proposalId,
      },
    });

  const pricingResults = items.map((item) =>
    calculateItemPricing({
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),

      discountType:
        item.discountType,

      discountValue:
        Number(item.discountValue),

      taxRate:
        Number(item.taxRate),
    })
  );

  const totals =
    calculateProposalTotals(
      pricingResults
    );

  await prisma.proposal.update({
    where: {
      id: proposalId,
    },

    data: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
    },
  });
}